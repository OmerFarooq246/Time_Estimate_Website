import pandas as pd
import requests
import os
import json
from pprint import pprint

def get_json_obj(excel_path):
    cat_id = 0
    sub_cat_id = 0
    for i in range(11):
        print("sheet:", i)
        df = pd.read_excel(excel_path, sheet_name = i)

        sheet_1 = {}
        num = 0
        specs = []

        for col in df:
            if col == "Title ":
                num = num + 1
                continue
            else:
                if num == 4:
                    sheet_1[col] = ",".join(map(str, pd.unique(df[col])))
                elif num < 4:
                    key = col.replace(" ", "")
                    sheet_1[key] = pd.unique(df[col])[0]
                else:
                    # print([x for x in pd.unique(df[col]) if pd.notna(x)])
                    sheet_1[col] = ",".join([x for x in pd.unique(df[col]) if pd.notna(x)])
                    # [x for x in pd.unique(df[col]) if pd.notna(x)]
                    # specs.append({
                    #     "description": col,
                    #     "options": ",".join(pd.unique(df[col])),
                    #     "process": df["Process "]
                    # })
                num = num + 1
        
        # print(sheet_1)
        # print()

        specs = []
        process = {}
        num = 0

        for col in sheet_1:
            if num > 3:
                print("spec:", col)
                specs.append({
                    "description": col,
                    "options": sheet_1[col],
                    # 'time_inc': ",".join(["0"]*len(sheet_1[col].split(','))),
                    "process": sheet_1["Process"]
                })
            else:
                process[col] = sheet_1[col]
            num = num + 1

        process["specs"] = specs
        print("json_obj:")
        pprint(process)

        if i == 0: 
            cat_id = add_cat(process)
            # sub_cat_id = add_sub_cat(process, cat_id)
            # add_process(process, sub_cat_id)
            # break
        if i == 0 or i == 3 or i == 6 or i == 10:
            sub_cat_id = add_sub_cat(process, cat_id)
        add_process(process, sub_cat_id, i)
        print("---------------------")


def add_cat(json_obj):
    cat = {
        'name': json_obj["Category"],
        'img_source': ""
    }
    # {'categoryData': cat}
    # print(json.dumps(categoryData))
    print()
    print("adding cat:")
    pprint({'categoryData': cat})
    res = requests.post("http://localhost:3000/api/add_category", json={'categoryData': cat})
    print("res in add_cat:")
    pprint(res.json())
    return res.json()["id"]

def add_sub_cat(json_obj, cat_id):
    sub_cat = {
        'name': json_obj["SubCategory"],
        'img_source': "",
        'category': cat_id
    }
    print()
    print("adding sub_cat:")
    pprint({'sub_categoryData': sub_cat})
    res = requests.post("http://localhost:3000/api/add_sub_category", json={'sub_categoryData': sub_cat})
    print("res in add_sub_cat:")
    pprint(res.json())
    return res.json()["id"]

def add_process(json_obj, sub_cat_id, sheet_index):
    process = {
        'name': json_obj["Process"],
        'img_source': "",
        'time_per_unit': 3,
        'sub_category': sub_cat_id,
        'specs': json_obj["specs"]
    }
    print()
    print("adding process:")
    pprint({'processData': process})
    res = requests.post("http://localhost:3000/api/add_process_py", json={'processData': process})
    print("res in add_process:")
    pprint(res.json())
    get_time_pairs(sheet_index, res.json()["id"])

def get_time_pairs(sheet_index, process):
    time_pairs = []
    print("sheet:", sheet_index)
    df = pd.read_excel(excel_path, sheet_name = sheet_index)
    for j in range(df.shape[0]):
        row = df.iloc[j]
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
            pair = {'process': process, 'time': float(df[df.keys()[4]][j]), 'options': ",".join(options)}
            print(pair)
            time_pairs.append(pair)
        else:
            pair = {'process': process, 'time': (df[df.keys()[4]][j]), 'options': ",".join(options)}
            print("nan pair:", pair)
    # print(time_pairs)
    res = requests.post("http://localhost:3000/api/add_time_pairs_py", json={'time_pairs': time_pairs})
    print("res in add_time_pairs_py:")
    pprint(res.json())


print("\n")
excel_path = "D:/VSCODEs/Time_Estimate_Website/time-estimate-website/data_read/Paint _ Finishing.xlsx"
get_json_obj(excel_path)
print("\n")