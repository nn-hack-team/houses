import pandas as pd

DATA_PATH = '/data/tables/n1000.csv'

def read_data(path = DATA_PATH):
    return pd.read_csv(path)

from app.data.read import *
from app.data.create import *