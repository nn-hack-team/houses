from app import app
# from app.ai import get_placeholder_prediction
from app.data import get_by_id, get_data_items

@app.get("/")
def read_root():
    return { "message": "Welcome to vMeste API" }


# @app.get("/ai_house_price")
# def get_ai_price():
#     return {"price": get_placeholder_prediction()}

@app.get('/houses/pagination/{start}/{end}')
async def get_pagination_houses(start: int, end: int, lat_start: float = None, lat_end: float = None, lng_start: float = None, lng_end: float = None, radius: float = None, start_price: float = None, end_price: float = None, category: str = None, owner: str = None, liked_by: str = None):
    return get_data_items(
        start=start,
        end=end,
        lat_start=lat_start,
        lat_end=lat_end,
        lng_start=lng_start,
        lng_end=lng_end,
        radius=radius,
        start_price=start_price,
        end_price=end_price,
        category=category,
        owner=owner,
        liked_by=liked_by
    )

@app.get('/houses/{house_id}')
def get_house(house_id: int):
    return get_by_id(house_id)

from app.routes.create import *