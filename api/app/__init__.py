from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.mount('/data/images', StaticFiles(directory='/data/images'), name='data')

from app.routes import *