#!/usr/bin/env python
import numpy as np
import pandas as pd
import json
import pprint
import string
import spacy
from dateutil.parser import parse
from word2number import w2n
from pymongo import MongoClient
from geopy.geocoders import Nominatim
from spacy.pipeline import *
from spacy.lang.en.stop_words import STOP_WORDS


def record(record, f):
    """
    Receive extracted relations and convert them
    into the appropriate JSON object.
    """
    print("Recording to json...")
    if record == 'inc':
        return {
            'disease': str(f[0]),
            'date-start': str(f[1]),
            'date-end': str(f[2]),
            'title': str(f[3]),
            'url': str(f[4]),
            'code': str(f[5]),
            'incident': w2n.word_to_num(str(f[6]))
        }
    elif record == 'sta':
        return {
            'disease': str(f[0]),
            'date-start': str(f[1]),
            'date-end': str(f[2]),
            'title': str(f[3]),
            'url': str(f[4]),
            'code': str(f[5]),
            'state': str(f[6])
        }
    elif record == 'cha':
        return {
            'disease': str(f[0]),
            'date-start': str(f[1]),
            'date-end': str(f[2]),
            'title': str(f[3]),
            'url': str(f[4]),
            'code': str(f[5]),
            'change': str(f[6])
        }
    return {}


def extract_location(sent, ref=False):
    """Return the coordinates of the location provided."""
    print("Extracting location...")
    locs = []

    # Retrieves location found at the start of each article
    if ref:
        for word in sent:
            if word.is_punct:
                continue
            elif word.ent_type_ == 'GPE':
                locs.append(str(word))
            else:
                break

    # Retrieve location found in a given sentence
    else:
        for word in sent:
            if word not in STOP_WORDS:
                if word.ent_type_ == 'GPE':
                    locs.append(str(word))

    locs = ' '.join([str(x) for x in locs])
    out = get_centroid(locs)
    return out


def get_centroid(location):
    """Determines coordinates of the provided location string."""
    print(location)
    print('Generating coordinates...')

    # if no location given, return an empty array
    if not location.strip():
        print('No location given.')
        return []
    try:
        # try to get coordinates
        print("Attempting to find location...")
        geolocator = Nominatim()
        loc = geolocator.geocode(location)

        # if location is found, return coordinates
        if loc:
            print('Coordinates found.')
            return [loc.longitude, loc.latitude]
        # else, return an empty array
        else:
            raise Exception('No coordinates found.')
    except Exception as e:
        print(e)
        return []


def extract_incident(sent, refs):
    """
    Return all incidents found within a sentence
    """
    print("Extracting incidents...")

    # Load metadata values
    dis, date, title, url, loc = refs
    date_start = date.strftime('%Y-%m-%d')
    date_end = date.strftime('%Y-%m-%d')

    relations = []

    # Find all CARDINAL entities, then check if they are
    # linked to a disease, case, or location
    # If they are, they are probably incidence counts
    for number in filter(lambda w: w.ent_type_ == 'CARDINAL', sent):
        count = number.text.replace(',', '')

        if number.dep_ in ('attr', 'dobj'):
            case = [w for w in number.head.lefts if w.ent_type == 'nsubj']

            if case:
                relations.append(record('inc', [dis,  date_start,
                                 date_end, title, url, loc, count]))
        else:
            case = number.head.ent_type_

            if case == 'CASE':
                relations.append(record('inc', [dis,  date_start,
                                 date_end, title, url, loc, count]))
            if case == 'LOC':
                relations.append(record('inc', [dis,  date_start,
                                 date_end, title, url, loc, count]))

    return relations


def extract_status(sent, refs):
    """Return all statuses found within a sentence."""
    print("Extracting statuses...")

    # Load metadata values
    dis, date, title, url, loc = refs
    date_start = date.strftime('%Y-%m-%d')
    date_end = date.strftime('%Y-%m-%d')

    relations = []

    # Find all STATE entities, thenn concatenate
    # them into a string
    states = filter(lambda x: x.ent_type_ == 'STATE', sent)
    state = ' '.join(map(str, states))
    if state:
        if 'hot' in state:
            state = 'hot'
        elif 'calamity' in state:
            state = 'calamity'
        elif 'outbreak' in state or 'epidemic' in state:
            state = 'outbreak'
        relations.append(record('sta', [dis, date_start, date_end, title, url, loc, state]))

    return relations


def extract_change(sent, refs):
    """
    Return all changes found within a sentence
    """
    print("Extracting changes...")

    # Load metadata values
    dis, date, title, url, loc = refs
    date_start = date.strftime('%Y-%m-%d')
    date_end = date.strftime('%Y-%m-%d')

    rise = ['high', 'higher', 'increase', 'increasing',
            'increased', 'rise', 'rising', 'rose', 'more']
    fall = ['low', 'lower', 'decrease', 'decreasing',
            'decreased', 'fall', 'falling', 'fell', 'less']
    relations = []

    # Find all CHANGE entities, determine if they have word
    # dependencies to PERCENT ents, then. If they are,
    # they are most likely changes.
    for change in filter(lambda w: w.ent_type_ == 'CHANGE', sent):
        for child in change.children:
            if child.ent_type_ == 'PERCENT':
                if str(change) in rise:
                    change = 'rise'
                elif str(change) in fall:
                    change = 'fall'
                relations.append(record('change', [dis, date_start, date_end, title, url, loc, change]))

    return relations


def extract_refs(article, nlp):
    """Return reference information from articles."""
    print("Extracting keys from article...")

    dis = article['disease']
    date = parse(str(article['timestamp'])).date()
    title = article['title']
    url = article['url']

    # Look for location in article title, then first ine
    # then dateline or first line
    loc = extract_location(nlp(article['content']), ref=True)

    if loc == []:
        loc = extract_location(nlp(article['title']))

    return [dis, date, title, url, loc]


def extract():
    """Extract incident, status, and change data from the given articles."""
    # load new articles from database
    client = MongoClient()
    db = client.news
    infodem_articles = db.infodem_articles.find()

    # Load trained model, data, and psgc
    nlp = spacy.load('models')
    df = pd.DataFrame(list(infodem_articles))

    total_incidents = []
    total_statuses = []
    total_changes = []

    for index, article in df.iterrows():
        doc = nlp(article['content'])
        refs = extract_refs(article, nlp)
        deets = [article['title'], article['url']]
        incidents = []
        statuses = []
        changes = []

        for sent in doc.sents:
            i = extract_incident(sent,  refs)
            s = extract_status(sent, refs)
            t = extract_change(sent, refs)

            if i:
                [incidents.append(x) for x in i]
            if s:
                [statuses.append(x) for x in s]
            if t:
                [changes.append(x) for x in t]

        if incidents:
            [total_incidents.append(y) for y in incidents]
        if statuses:
            [total_statuses.append(y) for y in statuses]
        if changes:
            [total_changes.append(y) for y in changes]

    print("Writing data to JSON files...")

    # dump extracted information into separate collections
    db.incidents.insert_many(total_incidents)
    db.statuses.insert_many(total_statuses)
    db.changes.insert_many(total_changes)
