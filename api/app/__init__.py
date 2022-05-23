from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

app = FastAPI(
    title="vMeste API"
)


app.mount('/data/images', StaticFiles(directory='/data/images'), name='data')

from app.routes import *