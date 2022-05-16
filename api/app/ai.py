import numpy as np
import pandas as pd
from catboost import CatBoostRegressor


def set_floor(input_str):
    try:
        s = float(input_str)
        if s<0:
            return '-1'
        if s == 1:
            return '1'
        if s==2:
            return '2'
        if s<5:
            return '3'
        if s<10:
            return '4'
        if s<20:
            return '5'
        if s<50:
            return '6'
        if s<90:
            return '7'
        else:
            return '0'
    except:
        if 'подвал' in input_str.lower() :
            return 'подвал'
        if 'цоколь' in input_str.lower() :
            return 'цоколь'
        else:
            return 'uknown'

def get_ready_data(data):
    data = data.drop(['date'], axis = 1).copy()
    data['floor'] = data['floor'].apply(str)
    data['floor'] = data['floor'].apply(set_floor)
    data['realty_type']= data['realty_type'].apply(str)
    data['total_square_log'] = data['total_square'].apply(np.log)
    data.drop(unused_features, axis = 1, inplace=True)

    return data

def get_price(data):

    test = get_ready_data(data)

    test_predict = catboost_regressor.predict(test)
    test_predict = np.exp(test_predict)

    return test_predict[0]


mode = pd.read_csv('/data/tables/mode.csv')
mode = mode.reindex(columns=sorted(mode.columns))

cat_features = ['region', 'street', 'osm_city_nearest_name', 'floor', 'city', 'realty_type']
unused_features = ['total_square', 'price_type']

catboost_regressor = CatBoostRegressor()
catboost_regressor.load_model('/data/model.cbm')


def get_placeholder_prediction():
    return get_price(mode)