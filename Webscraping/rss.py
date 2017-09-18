import feedparser, csv, os
 
feed_urls = {
    'gma-news':                 'http://www.gmanetwork.com/news/rss/news/',
    'gma-cbb':                  'http://www.gmanetwork.com/news/rss/cbb/',
    'gma-scitech':              'http://www.gmanetwork.com/news/rss/scitech/',
    'gma-serbisyopubliko':      'http://www.gmanetwork.com/news/rss/serbisyopubliko/',
    'gma-newstv':               'http://www.gmanetwork.com/news/rss/newstv/',
    'gma-photo':                'http://www.gmanetwork.com/news/rss/photo/',
    'gma-video':                'http://www.gmanetwork.com/news/rss/video/',
    'gma-publicaffairs':        'http://www.gmanetwork.com/news/rss/publicaffairs/',
    'inquirer':                 'http://www.inquirer.net/fullfeed',
    'philstar-breakingnews':    'http://www.philstar.com/rss/breakingnews',
    'philstar-headlines':       'http://www.philstar.com/rss/headlines',
    'philstar-nation':          'http://www.philstar.com/rss/nation',
    'mb':                       'http://mb.com.ph/mb-feed/',
    'rappler':                  'http://feeds.feedburner.com/rappler/'
}

file = open('rss_out.txt', 'w')
for key, url in feed_urls.items():
    feed = feedparser.parse(url)
    for article in feed['items']:
        file.write(article['link'] + '\n')
        print(article['link'])
file.close()