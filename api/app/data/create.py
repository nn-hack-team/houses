import pandas as pd 
import random

from app.data import read_data

def add_item(item):

    data = read_data()

    new_item = data.iloc[random.randint(1, 1000)].copy()

    for key in item.keys():
        if key in data.columns:
            new_item[key] = item[key]
    new_item.likes = 0
    new_item.id = data.shape[0]

    data = data.append(new_item, ignore_index=True)

    data.to_csv('/data/tables/n1000.csv', index=False)

    return new_item.id

def add_like(house_id, user_id):

    data = read_data()

    data.loc[data.id == house_id, 'likes'] += 1
    data.loc[data.id == house_id, 'likedBy'].iloc[0].append(user_id)

    data.to_csv('/data/tables/n1000.csv', index=False)

def remove_like(house_id, user_id):

    data = read_data()

    data.loc[data.id == house_id, 'likes'] -= 1
    data.loc[data.id == house_id, 'likedBy'].iloc[0].remove(user_id)

    data.to_csv('/data/tables/n1000.csv', index=False)