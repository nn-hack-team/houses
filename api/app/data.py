import pandas as pd 

from app.tools import get_alpha_raduis, fix_items

data = pd.read_csv('/data/tables/n1000.csv')

def get_all():
    return data.to_dict('records')

def get_from_to(start, end):
    return fix_items(data.iloc[start:end].to_dict('records'))

def get_by_id(id):
    return get_from_to(id, id+1)[0]

def filter_by_location(lat, lng, radius):

    alpha_radius = get_alpha_raduis(radius)

    return data[(data.lat - lat) ** 2 + (data.lng - lng)**2 <= alpha_radius].to_dict('records')

def filter_by_price(start_price=None, end_price=None):
    if start_price is None and end_price is None:
        return data.to_dict('records')
    elif start_price is None:
        return data[data.price <= end_price].to_dict('records')
    elif end_price is None:
        return data[data.price >= start_price].to_dict('records')
    
    return data[(data.price >= start_price) & (data.price <= end_price)].to_dict('records')
