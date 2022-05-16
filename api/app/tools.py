import json
import numpy as np

def get_alpha_raduis(radius):
    return 180*radius/(np.pi*6.371)

def fix_image_paths(item):
    item['imgUrls'] = json.loads(item['imgUrls'].replace("'", '"'))
    return item

def fix_items(items):
    return list(map(fix_image_paths, items))