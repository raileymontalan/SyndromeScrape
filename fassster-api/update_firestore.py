import json
from copy import deepcopy
from itertools import groupby
from google.cloud import firestore
# from pymongo import MongoClient

# initialize firebase
db = firestore.Client()

# retrieve data from database
# client = MongoClient()
# incidents = client.news.incidents
# changes = client.news.changes
# statuses = client.news.statuses

incidents = json.load(open('data/incidents5.json'))
statuses = json.load(open('data/statuses5.json'))
changes = json.load(open('data/changes5.json'))

# start with incidents
# segregate each incident by disease
i_dengue = []
i_measles = []
i_typhoid = []

for document in incidents:
    # del document['_id']
    del document['date-end']
    if document['disease'] == 'dengue':
        i_dengue.append(document)
    elif document['disease'] == 'measles':
        i_measles.append(document)
    elif document['disease'] == 'typhoid':
        i_typhoid.append(document)
    del document['disease']

# group diseases by date
# i_dengue = [list(g) for k, g in groupby(
#     i_dengue, key=lambda x: x['date-start'].split('-')[0])]
# i_measles = [list(g) for k, g in groupby(
#     i_measles, key=lambda x: x['date-start'].split('-')[0])]
# i_typhoid = [list(g) for k, g in groupby(
#     i_typhoid, key=lambda x: x['date-start'].split('-')[0])]

# print(i_dengue)

i_dengue_docs = []
i_measles_docs = []
i_typhoid_docs = []

for i in range(2008, 2019):
    year = []

    for doc in i_dengue:
        print(doc['date-start'].split('-')[0])
        print(str(i))
        
        if doc['date-start'].split('-')[0] == str(i):
            year.append(doc)
    if year:
        i_dengue_docs.append(year)

for i in range(2008, 2019):
    year = []

    for doc in i_measles:
        print(doc['date-start'].split('-')[0])
        print(str(i))
        
        if doc['date-start'].split('-')[0] == str(i):
            year.append(doc)
    if year:
        i_measles_docs.append(year)

for i in range(2008, 2019):
    year = []

    for doc in i_dengue:
        print(doc['date-start'].split('-')[0])
        print(str(i))
        
        if doc['date-start'].split('-')[0] == str(i):
            year.append(doc)
    if year:
        i_dengue_docs.append(year)

# format each group appropriately
# dengue incidents
for group in i_dengue_docs:
    features = []

    for doc in group:
        coordinates = deepcopy(doc['code'])
        
        obj = {
            "type": "Feature",
            "properties": doc,
            "geometry": {
                "type": "Point",
                "coordinates": coordinates
            }
        }

        features.append(obj)

    # push documents to cloud
    doc_id = 'dengue&' + group[0]['date-start'].split('-')[0]
    doc_ref = db.collection(u'incidents').document(doc_id)
    doc_ref.update({
        u'type': u'FeatureCollection',
        u'features': features
    }, firestore.CreateIfMissingOption(True))

    js = {
        'type': 'FeatureCollection',
        'features': features
    }

    # with open('incidents-' + doc_id + '.json', 'w', encoding='utf-8') as f:
    #         json.dump(js, f, ensure_ascii=False, indent=4)

# measles incidents
for group in i_measles_docs:
    features = []

    for doc in group:
        coordinates = deepcopy(doc['code'])
        
        obj = {
            "type": "Feature",
            "properties": doc,
            "geometry": {
                "type": "Point",
                "coordinates": coordinates
            }
        }

        features.append(obj)

    # push documents to cloud
    doc_id = 'measles&' + group[0]['date-start'].split('-')[0]
    doc_ref = db.collection(u'incidents').document(doc_id)
    doc_ref.update({
        u'type': u'FeatureCollection',
        u'features': features
    }, firestore.CreateIfMissingOption(True))

    js = {
        'type': 'FeatureCollection',
        'features': features
    }

    # with open('incidents-' + doc_id + '.json', 'w', encoding='utf-8') as f:
    #         json.dump(js, f, ensure_ascii=False, indent=4)

# typhoid incidents
for group in i_typhoid_docs:
    features = []

    for doc in group:
        coordinates = deepcopy(doc['code'])
        
        obj = {
            "type": "Feature",
            "properties": doc,
            "geometry": {
                "type": "Point",
                "coordinates": coordinates
            }
        }

        features.append(obj)

    # push documents to cloud
    doc_id = 'typhoid&' + group[0]['date-start'].split('-')[0]
    doc_ref = db.collection(u'incidents').document(doc_id)
    doc_ref.update({
        u'type': u'FeatureCollection',
        u'features': features
    }, firestore.CreateIfMissingOption(True))

    js = {
        'type': 'FeatureCollection',
        'features': features
    }

    # with open('incidents-' + doc_id + '.json', 'w', encoding='utf-8') as f:
    #         json.dump(js, f, ensure_ascii=False, indent=4)

# changes
# segregate each change by disease
c_dengue = []
c_measles = []
c_typhoid = []

for document in changes:
    # del document['_id']
    del document['date-end']
    if document['disease'] == 'dengue':
        c_dengue.append(document)
    elif document['disease'] == 'measles':
        c_measles.append(document)
    elif document['disease'] == 'typhoid':
        c_typhoid.append(document)

# group diseases by date
# c_dengue = [list(g) for k, g in groupby(
#     c_dengue, key=lambda x: x['date-start'])]
# c_measles = [list(g) for k, g in groupby(
#     c_measles, key=lambda x: x['date-start'])]
# c_typhoid = [list(g) for k, g in groupby(
#     c_typhoid, key=lambda x: x['date-start'])]

c_dengue_docs = []
c_measles_docs = []
c_typhoid_docs = []

for i in range(2008, 2019):
    year = []

    for doc in c_dengue:
        print(doc['date-start'].split('-')[0])
        print(str(i))

        if doc['date-start'].split('-')[0] == str(i):
            year.append(doc)
    if year:
        c_dengue_docs.append(year)

for i in range(2008, 2019):
    year = []

    for doc in c_measles:
        print(doc['date-start'].split('-')[0])
        print(str(i))

        if doc['date-start'].split('-')[0] == str(i):
            year.append(doc)
    if year:
        c_measles_docs.append(year)

for i in range(2008, 2019):
    year = []

    for doc in c_dengue:
        print(doc['date-start'].split('-')[0])
        print(str(i))

        if doc['date-start'].split('-')[0] == str(i):
            year.append(doc)
    if year:
        c_dengue_docs.append(year)

# format each group appropriately
# dengue changes
for group in c_dengue_docs:
    features = []

    for doc in group:
        print(doc)
        coordinates = deepcopy(doc['code'])
        
        obj = {
            "type": "Feature",
            "properties": doc,
            "geometry": {
                "type": "Point",
                "coordinates": coordinates
            }
        }

        features.append(obj)

    # push documents to cloud
    doc_id = 'dengue&' + group[0]['date-start'].split('-')[0]
    doc_ref = db.collection(u'changes').document(doc_id)
    doc_ref.update({
        u'type': u'FeatureCollection',
        u'features': features
    }, firestore.CreateIfMissingOption(True))

    js = {
        'type': 'FeatureCollection',
        'features': features
    }

    # with open('changes-' + doc_id + '.json', 'w', encoding='utf-8') as f:
    #         json.dump(js, f, ensure_ascii=False, indent=4)

# measles changes
for group in c_measles_docs:
    features = []

    for doc in group:
        coordinates = deepcopy(doc['code'])
        
        obj = {
            "type": "Feature",
            "properties": doc,
            "geometry": {
                "type": "Point",
                "coordinates": coordinates
            }
        }

        features.append(obj)

    # push documents to cloud
    doc_id = 'measles&' + group[0]['date-start'].split('-')[0]
    doc_ref = db.collection(u'changes').document(doc_id)
    doc_ref.update({
        u'type': u'FeatureCollection',
        u'features': features
    }, firestore.CreateIfMissingOption(True))

    js = {
        'type': 'FeatureCollection',
        'features': features
    }

    # with open('changes-' + doc_id + '.json', 'w', encoding='utf-8') as f:
    #         json.dump(js, f, ensure_ascii=False, indent=4)

# typhoid changes
for group in c_typhoid_docs:
    features = []

    for doc in group:
        coordinates = deepcopy(doc['code'])
        obj = {
            "type": "Feature",
            "properties": doc,
            "geometry": {
                "type": "Point",
                "coordinates": coordinates
            }
        }

        features.append(obj)

    # push documents to cloud
    doc_id = 'typhoid&' + group[0]['date-start'].split('-')[0]
    doc_ref = db.collection(u'changes').document(doc_id)
    doc_ref.update({
        u'type': u'FeatureCollection',
        u'features': features
    }, firestore.CreateIfMissingOption(True))

    js = {
        'type': 'FeatureCollection',
        'features': features
    }

    with open('changes-' + doc_id + '.json', 'w', encoding='utf-8') as f:
            json.dump(js, f, ensure_ascii=False, indent=4)

# statuses
# segregate each status by disease
s_dengue = []
s_measles = []
s_typhoid = []

for document in statuses:
    # del document['_id']
    del document['date-end']
    if document['disease'] == 'dengue':
        s_dengue.append(document)
    elif document['disease'] == 'measles':
        s_measles.append(document)
    elif document['disease'] == 'typhoid':
        s_typhoid.append(document)

# group diseases by date
# s_dengue = [list(g) for k, g in groupby(
#     s_dengue, key=lambda x: x['date-start'])]
# s_measles = [list(g) for k, g in groupby(
#     s_measles, key=lambda x: x['date-start'])]
# s_typhoid = [list(g) for k, g in groupby(
#     s_typhoid, key=lambda x: x['date-start'])]

s_dengue_docs = []
s_measles_docs = []
s_typhoid_docs = []

for i in range(2008, 2019):
    year = []

    for doc in s_dengue:
        print(doc['date-start'].split('-')[0])
        print(str(i))

        if doc['date-start'].split('-')[0] == str(i):
            year.append(doc)
    if year:
        s_dengue_docs.append(year)

for i in range(2008, 2019):
    year = []

    for doc in s_measles:
        print(doc['date-start'].split('-')[0])
        print(str(i))

        if doc['date-start'].split('-')[0] == str(i):
            year.append(doc)
    if year:
        s_measles_docs.append(year)

for i in range(2008, 2019):
    year = []

    for doc in s_dengue:
        print(doc['date-start'].split('-')[0])
        print(str(i))

        if doc['date-start'].split('-')[0] == str(i):
            year.append(doc)
    if year:
        s_dengue_docs.append(year)

# format each group appropriately
# dengue statuses
for group in s_dengue_docs:
    features = []

    for doc in group:
        coordinates = deepcopy(doc['code'])
        
        obj = {
            "type": "Feature",
            "properties": doc,
            "geometry": {
                "type": "Point",
                "coordinates": coordinates
            }
        }

        features.append(obj)

    # push documents to cloud
    doc_id = 'dengue&' + group[0]['date-start'].split('-')[0]
    doc_ref = db.collection(u'statuses').document(doc_id)
    doc_ref.update({
        u'type': u'FeatureCollection',
        u'features': features
    }, firestore.CreateIfMissingOption(True))

    js = {
        'type': 'FeatureCollection',
        'features': features
    }

    # with open('statuses-' + doc_id + '.json', 'w', encoding='utf-8') as f:
    #         json.dump(js, f, ensure_ascii=False, indent=4)

# measles statuses
for group in s_measles_docs:
    features = []

    for doc in group:
        coordinates = deepcopy(doc['code'])
        
        obj = {
            "type": "Feature",
            "properties": doc,
            "geometry": {
                "type": "Point",
                "coordinates": coordinates
            }
        }

        features.append(obj)

    # push documents to cloud
    doc_id = 'measles&' + group[0]['date-start'].split('-')[0]
    doc_ref = db.collection(u'statuses').document(doc_id)
    doc_ref.update({
        u'type': u'FeatureCollection',
        u'features': features
    }, firestore.CreateIfMissingOption(True))

    js = {
        'type': 'FeatureCollection',
        'features': features
    }

    # with open('statuses-' + doc_id + '.json', 'w', encoding='utf-8') as f:
    #         json.dump(js, f, ensure_ascii=False, indent=4)

# typhoid statuses
for group in s_typhoid_docs:
    features = []

    for doc in group:
        coordinates = deepcopy(doc['code'])
        
        obj = {
            "type": "Feature",
            "properties": doc,
            "geometry": {
                "type": "Point",
                "coordinates": coordinates
            }
        }

        features.append(obj)

    # push documents to cloud
    doc_id = 'typhoid&' + group[0]['date-start'].split('-')[0]
    doc_ref = db.collection(u'statuses').document(doc_id)
    doc_ref.update({
        u'type': u'FeatureCollection',
        u'features': features
    }, firestore.CreateIfMissingOption(True))

    js = {
        'type': 'FeatureCollection',
        'features': features
    }

    # with open('statuses-' + doc_id + '.json', 'w', encoding='utf-8') as f:
    #         json.dump(js, f, ensure_ascii=False, indent=4)

# each segregation forms a document
# if document exists, pull document, append to the features array, and update
# else, just create document and set value

# {
# 	"type": "FeatureCollection",

# 	"features": [{
# 				"type": "Feature",
# 				"properties": {
# 			        "date-start": "2015-06-30",
# 			        "title": "Isabela town in state of calamity due to dengue",
# 			        "url": "https://www.rappler.com/nation/97920-luna-isabela-state-of-calamity-dengue",
# 			        "incident": "54"
# 				},
# 				"geometry": {
# 					"type": "Point",
# 					"coordinates": [120.568897, 15.14962]
# 				}
# 			}]
# }
