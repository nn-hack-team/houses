from typing import List, Union
from pydantic import BaseModel
from fastapi import HTTPException

from app import app
from app.data import add_item, add_like, remove_like, remove_item

class Item(BaseModel):
    name: str
    address: str
    type: str
    price: float
    bedrooms: int
    bathrooms: int
    parking: bool
    furnished: bool
    floor: int
    imgUrls: List[str]
    lat: float
    lng: float
    userRef: str
    total_square: int


@app.post('/houses')
async def create_item(data: Item):

    try:
        item_ref = add_item(data.dict())
    except:
        raise HTTPException(status_code=500, detail="Item has not been created")

    return {"message": "Item created", "item_ref": item_ref}


@app.delete('/houses/{item_id}')
async def delete_item(item_id):

    try:
        remove_item(item_id)
    except:
        raise HTTPException(status_code=500, detail="Item has not been removed")

    return {"message": "Item removed"}


@app.post('/like/{what}/{item_id}/{user_id}')
async def like_item(what: str, item_id: int, user_id: str):
    if what == "add":
        add_like(item_id, user_id)
    elif what == 'remove':
        remove_like(item_id, user_id)
    try:
        print()
    except:
        raise HTTPException(status_code=500, detail="Item has not been liked")

    return {"message": "Item liked"}