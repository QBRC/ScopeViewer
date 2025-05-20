# ScopeViewer — Quick Start Guide

## 1. Get the Code
- Clone the repository and enter the folder:  
  ```bash
  git clone https://github.com/QBRC/ScopeViewer.git
  cd scopeviewer
   ```
 - The repo already includes:
    - docker-compose.yml
    - launcher.py
    - slides/ — put your slide files here
    - smp_data/ — optional; put your CSVs here


## 2. Prepare Your Slides

### Whole-slide Images

- Supported formats: `.svs`, `.tif`, `.tiff`

### DeepZoom Images

- Format: `.dzi` plus its companion `_files/` folder

Copy all slide files into the `slides/` folder.

### Masked Slides (Dual Viewer)

If you have a “mask” for a slide, name it by appending `_mask` to the base name. Example:
- slides/
  - sample.svs
  - mask_sample.svs
  - deepzoom1.dzi
  - deepzoom1_files/…
  - mask_deepzoom1.dzi
  - mask_deepzoom1_files/…

The viewer will automatically display each slide with its mask side-by-side.

## 3. (Optional) SMP Overlay Data
To overlay sample (SMP) data, prepare three CSVs per slide, named:
- smp_data/
  - sample.gene.csv
  - sample.count.csv
  - sample.loc.csv

When you run the launcher, these CSVs convert into smp_data/sample.db and get added to slides.json under "smp_layer".

## 4. Launch the Viewer
Run the launcher script:
 ```bash
    python3 launcher.py
 ```

What happens: 
- slides.json is generated/updated from slides/
- Any SMP CSV triples become .db files and entries in slides.json 
- Docker Compose starts (or restarts) Redis, the DeepZoom API, and the React frontend 
- The script waits for services to be healthy 
- Your browser opens at http://localhost:3001

## 5. Customize & Update

- Edit slides.json to add free-text notes in pathology_histology

- Add, remove, or update files in slides/ or smp_data/

Then rerun:
```bash
python3 launcher.py
 ```
It will open a new page in browser