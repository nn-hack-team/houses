from typing import List, Union
from pydantic import BaseModel
from fastapi import HTTPException

from app import app
from app.data import add_item

class Item(BaseModel):
    name: str
    type: str
    price: float
    bedrooms: int
    bathrooms: int
    parking: bool
    furnished: bool
    imgUrls: List[str]
    lat: float
    lng: float
    userRef: str


@app.post('/houses')
async def create_item(data: Item):

    try:
        item_ref = add_item(data.dict())
    except:
        raise HTTPException(status_code=500, detail="Item has not been created")

    return {"message": "Item created", "item_ref": item_ref}