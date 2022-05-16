from app import app
from app.data import filter_by_location, filter_by_price

@app.get('/filterby/location')
async def get_by_location(lat: float, lng: float, radius: float):
    return filter_by_location(lat, lng, radius)

@app.get('/filterby/price')
async def get_by_price(f: float = None, t: float = None):
    return filter_by_price(f, t)