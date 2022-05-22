from app.data import read_data
from app.tools import get_alpha_raduis


def filter_by_loc_and_radius(data, lat, lng, radius):
    alpha_radius = get_alpha_raduis(radius)

    return data[(data.lat - lat) ** 2 + (data.lng - lng)**2 <= alpha_radius]

def filter_by_location(data, lat_start, lat_end, lng_start, lng_end):

    return data[(data.lat >= lat_start) & (data.lat <= lat_end) & (data.lng >= lng_start) & (data.lng <= lng_end)]

def filter_by_price(data, start_price=None, end_price=None):
    if start_price is None:
        return data[data.price <= end_price]
    elif end_price is None:
        return data[data.price >= start_price]
    
    return data[(data.price >= start_price) & (data.price <= end_price)]



def get_data_items(start=None, end=None, lat_start=None, lat_end=None, lng_start=None, lng_end=None, radius=None, start_price=None, end_price=None, category=None, owner=None, liked_by=None):
    data = read_data()

    if None not in [lat_start, lng_start, radius]:
        data = filter_by_loc_and_radius(data.copy(), lat_start, lng_start, radius)
    elif None not in [lat_start, lng_start, lat_end, lng_end]:
        data = filter_by_location(data.copy(), lat_start, lat_end, lng_start, lng_end)
    
    if start_price is not None or end_price is not None:
        data = filter_by_price(data.copy(), start_price, end_price)

    if category is not None:
        data = data[data.type == category].copy()

    if owner is not None:
        data = data[data.userRef == owner].copy()

    if liked_by is not None:
        data = data[data.likedBy.astype(str).str.contains(liked_by)].copy()
    
    if None not in [start, end]:
        data = data.iloc[start:end].copy()

    return data.to_dict('records')

def get_by_id(id):
    return get_data_items(start=id, end=id+1)[0]
