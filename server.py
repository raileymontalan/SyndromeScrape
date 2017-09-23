import json
from bson import json_util
from bson.objectid import ObjectId
from pymongo import MongoClient
from tornado import ioloop, web, autoreload

class MainHandler(web.RequestHandler):
    def get(self):
        self.write("News Syndromic Surveillance")
        self.finish()

class DBHandler(web.RequestHandler):
    def get(self):
        client = MongoClient()
        collection = client.scrape.articles
        articles = collection.find()
        self.set_header("Content-Type", "application/json")
        self.write(json.dumps(list(articles),default=json_util.default))

class ArticlesHandler(web.RequestHandler):
    def get(self, key):
        client = MongoClient()
        collection = client.scrape.articles
        article = collection.find_one({"_id":ObjectId(str(article_id))})
        self.set_header("Content-Type", "application/json")
        self.write(json.dumps((article),default=json_util.default))

def make_app():
    return web.Application([
        (r"/", MainHandler),
        (r'/api/db', DBHandler),
        (r'/api/articles/(.*)', ArticlesHandler)
    ])

if __name__ == "__main__":
    app = make_app()
    app.listen(8888)
    ioloop = ioloop.IOLoop.instance()
    autoreload.start(ioloop)
    ioloop.start()