import csv
import json
from pickle import FALSE, TRUE
from re import T
import sqlite3
from urllib.request import urlopen
from sqlite3 import Error

# returns a connection to the sqlite database
def create_connection(db_file):
    conn = None
    try:
        conn = sqlite3.connect(db_file)
    except Error as e:
        print(e)
    return conn

# creates all 3 tables
def create_tables(conn):
    gene_list_sql = """ CREATE TABLE IF NOT EXISTS gene_list_sql (
                                        value integer PRIMARY KEY,
                                        label text NOT NULL
                                    ); """
                
    smp_count_sql = """ CREATE TABLE IF NOT EXISTS smp_count_sql (
                                        label text NOT NULL,
                                        data text NOT NULL
                                    ); """

    smp_loc_sql = """ CREATE TABLE IF NOT EXISTS smp_loc_sql (
                                        x integer,
                                        y integer
                                    ); """
    
    try:
        c = conn.cursor()
        c.execute(gene_list_sql)
        c.execute(smp_count_sql)
        c.execute(smp_loc_sql)
    except Error as e:
        print(e)

# checks to ensure that JSON and csv files are formatted correctly
def ensure_format(genelist, counts, locations):
    if(len(genelist)-1 == len(counts) and len(counts[0]) == len(locations)):
        return True
    else:
        return False

def main():
    
    # replace with a link to genelist JSON file
    gene_name_file = open('human_prostate_acinar_cell_carcinoma_ffpe.gene_name.csv')
    gene_name_reader = csv.reader(gene_name_file)
    gene_list = list(gene_name_reader)

    # replace with a path to smp count csv file
    smp_count_file =  open('human_prostate_acinar_cell_carcinoma_ffpe.count.csv')
    smp_count_reader = csv.reader(smp_count_file)
    count_list = list(smp_count_reader)

    # replace with a path to location csv file
    smp_loc_file = open('human_prostate_acinar_cell_carcinoma_ffpe.loc.csv')
    smp_loc_reader = csv.reader(smp_loc_file)
    location_list = list(smp_loc_reader)

    # database will be created if data is formatted correctly
    if(ensure_format(gene_list, count_list, location_list)):

        #replace with preferred path and file name for the database to be created
        database = r"sqlite_data.db"

        conn = create_connection(database)
        if conn is not None:
            create_tables(conn)
        else:
            print("Cannot create database connection.")
            return

        c = conn.cursor()


        # insert gene list JSON data into first table
        columns = ['value','label']
        gene_list.pop(0)
        insert_gene_name = "INSERT INTO gene_list_sql VALUES(?,?)"
        c.executemany(insert_gene_name, gene_list)


        # insert smp count data from csv file into second table
        smp_count_contents = []
        # correct the format and insert data as a string with , delimiter 
        for row in count_list:
            value = row[0]
            row.pop(0)
            data_to_string = ','.join(row)
            new_tuple = (value, data_to_string)
            smp_count_contents.append(new_tuple)
        insert_smp_count = "INSERT INTO smp_count_sql (label, data) VALUES (?,?)"
        c.executemany(insert_smp_count, smp_count_contents)
 
        c.execute('CREATE INDEX v_value ON smp_count_sql (label)')


        # insert smp loc data from csv file into third table
        # get rid of header line
        location_list.pop(0)
        insert_smp_loc = "INSERT INTO smp_loc_sql (x,y) VALUES(?,?)"
        c.executemany(insert_smp_loc, location_list)

        print("Database successfully created.")

        # commit changes
        conn.commit()

        # close connection
        conn.close()

    else:
        print("Files formatted incorrectly. Failed to create database.")


    

if __name__ == '__main__':
    main()

