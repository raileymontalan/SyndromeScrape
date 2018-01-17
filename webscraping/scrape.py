#!/usr/bin/env python

import timeit, feedparser, urllib.request
from datetime import datetime, timedelta
from bs4 import BeautifulSoup
from pymongo import MongoClient


# URLs from RSS feeds to be processed with BeautifulSoup
bs4_feed_urls = {
    'inquirer':                 'http://www.inquirer.net/fullfeed',
    'philstar-breakingnews':    'http://www.philstar.com/rss/breakingnews',
    'philstar-headlines':       'http://www.philstar.com/rss/headlines',
    'philstar-nation':          'http://www.philstar.com/rss/nation',
    'mb':                       'http://mb.com.ph/mb-feed/',
    'rappler':                  'http://feeds.feedburner.com/rappler/'
}

# URLs from RSS feeds to be processed with Selenium
sel_feed_urls = {
    'gma-news':                 'http://www.gmanetwork.com/news/rss/news/',
    'gma-cbb':                  'http://www.gmanetwork.com/news/rss/cbb/',
    'gma-scitech':              'http://www.gmanetwork.com/news/rss/scitech/',
    'gma-serbisyopubliko':      'http://www.gmanetwork.com/news/rss/serbisyopubliko/',
    'gma-publicaffairs':        'http://www.gmanetwork.com/news/rss/publicaffairs/'
    
}

# URLs from news site pages to be processed with BeautifulSoup
bs4_site_urls = {
    'abscbn':                   'http://news.abs-cbn.com/news?page=',
    'inquirer':                 'http://www.inquirer.net/article-index?d=',
    'philstar-headlines':       'http://www.philstar.com/headlines/archive?page=',
    'philstar-nation':          'http://www.philstar.com/nation/archive/top-stories?page=',
}

# URLs from news site pages to be processed with Selenium
# Currently NOT in use
sel_site_urls = {
    'gma-news':                 'http://www.gmanetwork.com/news/archives/news/',
    'gma-cbb':                  'http://www.gmanetwork.com/news/archives/cbb/',
    'gma-scitech':              'http://www.gmanetwork.com/news/archives/scitech',
    'gma-serbisyopubliko':      'http://www.gmanetwork.com/news/archives/serbisyopubliko',
    'mb-national':              'http://news.mb.com.ph/category/national/page/',
    'mb-metro':                 'http://news.mb.com.ph/category/metro/page/',
    'mb-luzon':                 'http://news.mb.com.ph/category/luzon/page/',
    'mb-visayas':               'http://news.mb.com.ph/category/visayas/page/',
    'mb-mindanao':              'http://news.mb.com.ph/category/mindanao/page/',
    'mb-environment-nature':    'http://news.mb.com.ph/category/environment-nature/page/',
    'rappler-nation':           'https://www.rappler.com/nation?start=',
    'rappler-move-ph':          'https://www.rappler.com/move-ph/issues?start=',
    'rappler-life-health':      'https://www.rappler.com/science-nature/life-health?start=',
    'rappler-matters-numbers':  'https://www.rappler.com/science-nature/matters-numbers?start=',
    'rappler-specials':         'https://www.rappler.com/science-nature/specials?start=',
    'rappler-environment':      'https://www.rappler.com/science-nature/environment?start='
}


class HTMLopener(urllib.request.FancyURLopener):
    """Initializes HTML opener for BeautifulSoup."""
    version = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 \
              (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'


def rss_parse(file1, file2):
    """
    Retrieves article URLs from news feeds.
    Saves URLs to two files: One for articles to be processed using BeautifulSoup,
    the other for articles to be processed using Selenium.
    """
    rss_urls = 0
    start = timeit.default_timer()

    for key, url in bs4_feed_urls.items():
        feed = feedparser.parse(url)
        
        try:
            for article in feed['items']:
                file1.write(article['link'] + '\n')
                print(article['link'])
                rss_urls += 1
        except:
            continue

    for key, url in sel_feed_urls.items():
        feed = feedparser.parse(url)
        
        try:
            for article in feed['items']:
                file2.write(article['link'] + '\n')
                print(article['link'])
                rss_urls += 1
        except:
            continue

    stop = timeit.default_timer()
    rss_time = stop - start

    client = MongoClient()
    logs = client.scrape.rss_logs
    logs.insert({
        'date': datetime.now(),
        'rss_urls': rss_urls,
        'rss_time': rss_time,
        })


def web_parse(file1, file2):
    """
    Retrieves article URLs from the pages of news sites.
    Saves URLs to two files: One for articles to be processed using BeautifulSoup,
    the other for articles to be processed using Selenium.
    """
    web_urls = 0
    start = timeit.default_timer()

    for key, url in bs4_site_urls.items():
        web_urls += 1

        if key == 'inquirer':
            for i in range(0, 4):
                date = datetime.now() - timedelta(days=i)
                response = opener.open(url + '%s-%s-%s' %(date.year, date.month, date.day))
                soup = BeautifulSoup(response, 'html.parser')
                articles = soup.find_all('a', attrs={'rel': 'bookmark'})
        
                for article in articles:
                    file1.write(article.get('href') + '\n')
                    print(article.get('href'))
        
        elif key == 'abscbn':
            for i in range (1, 5):
                response = opener.open(url + str(i))
                soup = BeautifulSoup(response, 'html.parser')
                articles = soup.select('article > a')
        
                for article in articles:
                    file1.write('http://news.abs-cbn.com' + article.get('href') + '\n')
                    print('http://news.abs-cbn.com' + article.get('href'))
        
        elif key == 'philstar-headlines' or 'philstar-nation':
            for i in range (1, 5):
                response = opener.open(url + str(i))
                soup = BeautifulSoup(response, 'html.parser')
                articles = soup.select('span.article-title > a')
        
                for article in articles:
                    file1.write('http://www.philstar.com' + article.get('href') + '\n')
                    print('http://www.philstar.com' + article.get('href'))

    # Insert Selenium code here (Manila Bulletin, Rappler, GMA?)

    stop = timeit.default_timer()
    web_time = stop - start

    client = MongoClient()
    logs = client.scrape.web_logs
    logs.insert({
        'date': datetime.now(),
        'web_urls': web_urls,
        'web_time': web_time,
    })


# Initialize HTMLopener()
opener = HTMLopener()

# Create separate files for BeautifulSoup and Selenium
bs4_file = open('static/bs4_out.txt', 'w')
sel_file = open('static/sel_out.txt', 'w')

# Run parsers
rss_parse(bs4_file, sel_file)
web_parse(bs4_file, sel_file)

# Close files
bs4_file.close()
sel_file.close()