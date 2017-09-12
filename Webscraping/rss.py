import feedparser
 
feed_urls = {
    'gma-serbisyopubliko':      'http://www.gmanetwork.com/news/rss/serbisyopubliko/',
    'gma-newstv':               'http://www.gmanetwork.com/news/rss/newstv/',
    'gma-photo':                'http://www.gmanetwork.com/news/rss/photo/',
    'gma-video':                'http://www.gmanetwork.com/news/rss/video/',
    'inquirer':                 'http://www.inquirer.net/fullfeed',
    'philstar-breakingnews':    'http://www.philstar.com/rss/breakingnews',
    'mb':                       'http://mb.com.ph/mb-feed/',
    'rappler':                  'http://feeds.feedburner.com/rappler/'
}

articles = []

for key, url in feed_urls.items():
    feed = feedparser.parse(url)
    for article in feed['items']:
        articles.append(article['title'])

for article in articles:
    print(article)