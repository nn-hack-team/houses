from app import app
from app.ai import get_placeholder_prediction
from app.data import get_all, get_by_id, get_from_to

@app.get("/")
def read_root():
    return { "message": "Welcome to Houses API" }

@app.get("/ai_house_price")
def get_ai_price():
    return {"price": get_placeholder_prediction()}

@app.get('/houses/all')
async def get_all_houses():
    return get_all()

@app.get('/houses/pagination/{start}/{end}')
async def get_pagination_houses(start: int, end: int):
    return get_from_to(start, end)

@app.get('/houses/{house_id}')
def get_house(house_id: int):
    return get_by_id(house_id)

from app.routes.filters import *