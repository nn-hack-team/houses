from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.mount('/data', StaticFiles(directory='/data'), name='data')

from app.routes import *