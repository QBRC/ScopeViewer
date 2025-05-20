#!/usr/bin/env python3
import os
import sys
import json
import subprocess
import time
import webbrowser
import urllib.request
import sqlite3
import csv

# --- Configuration --- #

API_HEALTH_URL = "http://localhost:10010/health"
FRONTEND_URL = "http://localhost:3001"
DOCKER_COMPOSE_CMD = ["docker-compose", "up", "-d"]
SERVICES_TO_RESTART = ["redis", "deepzoom"]


# --- Functions --- #
def build_smp_db(slides_dir, smp_dir, entry):
    """
    Given a slide entry and a folder `smp_dir`, looks for:
      {image_name}.gene.csv,
      {image_name}.count.csv,
      {image_name}.loc.csv
    If all three exist, creates/overwrites
      smp_data/{image_name}.db
    and returns the relative path to the .db file.
    Otherwise returns None.
    """
    name = entry["image_name"]
    gene_csv = os.path.join(smp_dir, f"{name}.gene.csv")
    count_csv = os.path.join(smp_dir, f"{name}.count.csv")
    loc_csv = os.path.join(smp_dir, f"{name}.loc.csv")

    # Require all three
    if not (os.path.isfile(gene_csv) and os.path.isfile(count_csv) and os.path.isfile(loc_csv)):
        return None

    # Prepare output folder
    out_dir = os.path.join(smp_dir)
    os.makedirs(out_dir, exist_ok=True)
    db_path = os.path.join(out_dir, f"{name}.db")

    if os.path.isfile(db_path):
        try:
            os.remove(db_path)
            print(f"Removed existing SMP DB: {db_path}")
        except Exception as e:
            print(f"Warning: failed to remove old db {db_path}: {e}")

    # Connect / recreate
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    # Create tables
    c.execute("CREATE TABLE IF NOT EXISTS gene_list_sql (value INTEGER PRIMARY KEY, label TEXT NOT NULL);")
    c.execute("CREATE TABLE IF NOT EXISTS smp_count_sql (label TEXT NOT NULL, data TEXT NOT NULL);")
    c.execute("CREATE TABLE IF NOT EXISTS smp_loc_sql (x INTEGER, y INTEGER);")

    # Load CSVs
    with open(gene_csv)  as f: genelist  = list(csv.reader(f))
    with open(count_csv) as f: countlist = list(csv.reader(f))
    with open(loc_csv)   as f: loclist   = list(csv.reader(f))

    # Validate simple shape: len(genelist)-1 == len(countlist) etc.
    if not (len(genelist)-1 == len(countlist) and len(countlist[0]) == len(loclist)):
        conn.close()
        print(f"Warning: SMP CSV shape mismatch for {name}, skipping.")
        return None

    # Populate gene_list_sql (skip header)
    headers = genelist.pop(0)
    c.executemany(
        "INSERT OR REPLACE INTO gene_list_sql(value,label) VALUES(?,?)",
        genelist
    )

    # Populate smp_count_sql
    entries = []
    for row in countlist:
        label = row[0]
        data_string = ",".join(row[1:])
        entries.append((label, data_string))
    c.executemany(
        "INSERT OR REPLACE INTO smp_count_sql(label,data) VALUES(?,?)",
        entries
    )

    # **Create index** on label for fast lookups
    c.execute("CREATE INDEX IF NOT EXISTS v_value ON smp_count_sql(label);")

    # Populate smp_loc_sql (skip header)
    loclist.pop(0)
    c.executemany(
        "INSERT OR REPLACE INTO smp_loc_sql(x,y) VALUES(?,?)",
        loclist
    )

    conn.commit()
    conn.close()
    print(f"Built SMP DB for {name} → {db_path}")

    # Return the relative path for JSON
    return os.path.relpath(db_path, os.path.dirname(__file__))


def is_deepzoom(base, slides_dir):
    """
    Return True if base.dzi exists and base_files/ is present.
    """
    return (
        os.path.isfile(os.path.join(slides_dir, base + ".dzi")) and
        os.path.isdir(os.path.join(slides_dir, base + "_files"))
    )


def load_existing_metadata(json_path):
    """Load existing slides.json if valid JSON, else return []"""
    if not os.path.exists(json_path):
        return []
    try:
        with open(json_path, "r") as f:
            return json.load(f)
    except json.JSONDecodeError:
        print("Warning: slides.json is invalid—ignoring it.", file=sys.stderr)
        return []


def merge_slides_metadata(slides_dir, old_data):
    """
    Scan slides_dir for .svs/.tif/.tiff/.dzi (with companion _files/),
    merge with old_data by tile_folder_url, and return a new list of entries.
    Adds a 'mask_url' field when a matching *_mask file/folder exists.
    """
    old_map = {item["tile_folder_url"]: item for item in old_data if "tile_folder_url" in item}

    items = sorted(os.listdir(slides_dir))
    new_list = []
    idx = 0

    for fname in items:
        base, ext = os.path.splitext(fname)
        ext = ext.lower()

        # Determine if this is a slide:
        is_slide = False
        if ext in (".svs", ".tif", ".tiff"):
            is_slide = True
        elif ext == ".dzi" and is_deepzoom(base, slides_dir):
            is_slide = True

        if not is_slide:
            continue

        tile_url = f"slides/{fname}"

        # Detect mask:
        mask_url = ""
        mask_base = base + "_mask"
        if ext in (".svs", ".tif", ".tiff"):
            candidate = mask_base + ext
            if os.path.exists(os.path.join(slides_dir, candidate)):
                mask_url = f"slides/{candidate}"
        elif ext == ".dzi":
            # deepzoom mask needs both .dzi and _files/
            if is_deepzoom(mask_base, slides_dir):
                mask_url = f"slides/{mask_base}.dzi"

        # merge or new
        if tile_url in old_map:
            entry = old_map[tile_url]
            entry["image_id"]   = idx
            entry["image_name"] = base
        else:
            entry = {
                "image_id": idx,
                "image_name": base,
                "pathology_histology": "",
                "tile_folder_url": tile_url
            }

        # handle mask_url key: only set if non-empty
        if mask_url:
            entry["mask_url"] = mask_url
        else:
            # remove if present in old data
            entry.pop("mask_url", None)

        new_list.append(entry)
        idx += 1

    if not new_list:
        print("Error: slides/ contains no supported slide files.", file=sys.stderr)
        sys.exit(1)

    return new_list


def write_slides_json(json_path, data):
    """Write the merged slides metadata back to slides.json"""
    with open(json_path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"Wrote {len(data)} entries to slides.json.")


def run_docker_compose():
    """Run `docker-compose up -d` to start or reconnect the stack."""
    try:
        subprocess.run(DOCKER_COMPOSE_CMD, check=True)
        print("docker-compose up -d succeeded.")
    except subprocess.CalledProcessError as e:
        print("Error starting Docker Compose:", e, file=sys.stderr)
        sys.exit(1)

def restart_containers():
    try:
        # This will restart all running containers
        subprocess.run(
            ["docker", "compose", "restart"], 
            check=True
        )
        print("All containers have been restarted.")
    except subprocess.CalledProcessError as e:
        print("Failed to restart containers:", e, file=sys.stderr)
        sys.exit(1)

def wait_for_url(url, check_json=False, json_key=None, max_attempts=20, delay=1):
    """
    Poll the given URL until we get HTTP 200 (and optionally JSON with a key).
    Returns True on success, exits on failure.
    """
    for attempt in range(max_attempts):
        try:
            with urllib.request.urlopen(url, timeout=2) as resp:
                if resp.status == 200:
                    if check_json:
                        payload = json.loads(resp.read())
                        if payload.get(json_key) == "OK":
                            print(f"{url} is healthy.")
                            return True
                    else:
                        print(f"{url} is up.")
                        return True
        except Exception:
            pass
        time.sleep(delay)

    print(f"ERROR: {url} did not respond in time.", file=sys.stderr)
    sys.exit(1)

def main():
    script_dir = os.path.abspath(os.path.dirname(__file__))

    # locate slides folder
    slides_dir = os.path.join(script_dir, "slides")
    if not os.path.isdir(slides_dir):
        print("Error: No 'slides/' directory here.", file=sys.stderr)
        sys.exit(1)

    # load & merge metadata
    json_path = os.path.join(script_dir, "slides.json")
    old_data  = load_existing_metadata(json_path)
    new_data  = merge_slides_metadata(slides_dir, old_data)
    smp_dir = os.path.join(script_dir, "smp_data")
    if os.path.isdir(smp_dir):
        for entry in new_data:
            db_rel = build_smp_db(slides_dir, smp_dir, entry)
            if db_rel:
                entry["smp_layer"] = db_rel


    write_slides_json(json_path, new_data)

    # restart deepzoom
    run_docker_compose()
    
    restart_containers()

    # wait for API health endpoint
    wait_for_url(API_HEALTH_URL, check_json=True, json_key="health")

    # wait for frontend to be up
    wait_for_url(FRONTEND_URL)
    
    webbrowser.open(FRONTEND_URL)


if __name__ == "__main__":
    main()
