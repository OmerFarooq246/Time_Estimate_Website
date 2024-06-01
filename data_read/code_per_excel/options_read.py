import pandas as pd
import requests
import os
import json
from pprint import pprint

def get_time_pairs(excel_path):
    time_pairs = []
    for i in range(2):
        print("sheet:", i)
        df = pd.read_excel(excel_path, sheet_name = i)
        for j in range(df.shape[0]):
            row = df.iloc[j]
            # print("row:", row)
            # break
            # if row.isnull().any():
            #     continue

            num = 0
            options = []
            for option in row:
                if(num > 4):
                    if type(option) == type(str('')):
                        options.append(str(option))
                num = num + 1
            
            if type(df[df.keys()[3]][j]) == type(str('')):
                pair = {'process': df[df.keys()[3]][j], 'time': float(df[df.keys()[4]][j]), 'options': ",".join(options)}
                print(pair)
                time_pairs.append(pair)
            else:
                pair = {'process': df[df.keys()[3]][j], 'time': (df[df.keys()[4]][j]), 'options': ",".join(options)}
                print("nan pair:", pair)
    # print(time_pairs)

            
print("\n")
excel_path = "D:/VSCODEs/Time_Estimate_Website/time-estimate-website/data_read/Packing.xlsx"
get_time_pairs(excel_path)
print("\n")