#!/usr/bin/env python

import json
from pymongo import MongoClient

client = MongoClient()
collection = client.scrape.articles

file = open('static/articles.json', 'r', encoding='utf-8')
parsed = json.loads(file.read())

for key in parsed:
    for item in parsed[key]:
        collection.insert(item)
