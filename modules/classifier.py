#!/usr/bin/env python
import pandas as pd
from pymongo import MongoClient
from sklearn.externals import joblib

def classify():
    # load new articles from database
    client = MongoClient()
    db = client.news
    new_articles = db.new_articles.find()

    # create DataFrame out of articles list
    df = pd.DataFrame(list(new_articles))
    df = df[df['content'] != '']
    df1 = df[['content', 'title', 'url']]

    # load pickled trained classifier
    mnb = joblib.load('models/mnb.pkl')
    cv = joblib.load('models/cv.pkl')

    # classify new articles
    df_x = df['content']
    df_cv = cv.transform(df_x)
    predictions = mnb.predict(df_cv)
    df.loc[:, 'disease'] = predictions
    df = df[df['disease'] != 0]
    df = df[7:].reset_index(drop=True)

    print('Successfully classified articles.')

    # insert classified articles with labels back into db
    if not len(df['disease']) == 0:
        db.infodem_articles.insert_many(df.to_dict('records'))
        print('Inserted infodemiological articles into database.')
    else:
        print('No new infodemiological articles.')

    # delete new_articles collection
    # this is the collection that will be used by the system
    # so that only new articles will be processed
    if db.new_articles.delete_many({}):
        print('Dropped new_articles collection.')
