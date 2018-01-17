#!/usr/bin/env python

import json
from pymongo import MongoClient

client = MongoClient()
# collection = client.scrape.articles
collection_new = client.scrape.new_articles

file = open('static/articles.json', 'r', encoding='utf-8')
parsed = json.loads(file.read())


for key in parsed:
    # collection.insert(key)
    collection_new.insert(key)

print("Successfully added articles to database.")
