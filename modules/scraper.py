#!/usr/bin/env python

import json
import time
import timeit
import feedparser
import urllib.request
from datetime import datetime, timedelta
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from pymongo import MongoClient


# urls from rss feeds to be processed with beautifulsoup
bs4_feed_urls = {
    'inquirer':                 'http://www.inquirer.net/fullfeed',
    'philstar-breakingnews':    'http://www.philstar.com/rss/breakingnews',
    'philstar-headlines':       'http://www.philstar.com/rss/headlines',
    'philstar-nation':          'http://www.philstar.com/rss/nation',
    'mb':                       'http://mb.com.ph/mb-feed/',
    'rappler':                  'http://feeds.feedburner.com/rappler/'
}

# urls from rss feeds to be processed with selenium
sel_feed_urls = {
    'gma-news':                 'http://www.gmanetwork.com/news/rss/news/',
    'gma-cbb':                  'http://www.gmanetwork.com/news/rss/cbb/',
    'gma-scitech':              'http://www.gmanetwork.com/news/rss/scitech/',
    'gma-serbisyopubliko':      'http://www.gmanetwork.com/news/rss/serbisyopubliko/',
    'gma-publicaffairs':        'http://www.gmanetwork.com/news/rss/publicaffairs/'

}

# urls from news site pages to be processed with beautifulsoup
bs4_site_urls = {
    'abscbn':                   'http://news.abs-cbn.com/news?page=',
    'inquirer':                 'http://www.inquirer.net/article-index?d='
}

# urls from news site pages to be processed with selenium
# note: site structures have changed and implementation has to be redone
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


def rss_scrape(file1, file2):
    """
    Retrieves article URLs from news feeds.
    Saves URLs to two files: One for articles to be processed using BeautifulSoup,
    the other for articles to be processed using Selenium.
    """
    # initialize htmlopener to open web pages
    opener = HTMLopener()
    rss_urls = 0
    start = timeit.default_timer()

    print("Scraping RSS feeds...")

    # iterate through each feed and scrape all article links in feed
    # articles here will later be scraped with beautifulsoup
    for key, url in bs4_feed_urls.items():
        feed = feedparser.parse(url)

        try:
            for article in feed['items']:
                file1.write(article['link'] + '\n')
                print(article['link'])
                rss_urls += 1
        except:
            continue
    # iterate through each feed and scrape all article links in feed
    # articles here will later be scraped with selenium
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
    logs = client.news.rss_scrape_logs
    logs.insert({
        'date': datetime.now(),
        'rss_urls': rss_urls,
        'rss_time': rss_time,
    })


def web_scrape(file1, file2):
    """
    Retrieves article URLs from the pages of news sites.
    Saves URLs to two files: One for articles to be processed using
    BeautifulSoup, the other for articles to be processed using Selenium.
    """
    # initialize htmlopener to open web pages
    opener = HTMLopener()
    web_urls = 0
    start = timeit.default_timer()

    print("Scraping web pages...")

    # iterate through each site url and scrape all the article links
    for key, url in bs4_site_urls.items():
        web_urls += 1

        try:
            # scrape inquirer article links
            if key == 'inquirer':
                for i in range(0, 4):
                    date = datetime.now() - timedelta(days=i)
                    response = opener.open(url + '%s-%s-%s' %
                                        (date.year, date.month, date.day))
                    soup = BeautifulSoup(response, 'html.parser')
                    articles = soup.find_all('a', attrs={'rel': 'bookmark'})

                    for article in articles:
                        file1.write(article.get('href') + '\n')
                        print(article.get('href'))

            # scrape abs-cbn article links
            elif key == 'abscbn':
                for i in range(1, 5):
                    response = opener.open(url + str(i))
                    soup = BeautifulSoup(response, 'html.parser')
                    articles = soup.select('article > a')

                    for article in articles:
                        file1.write('http://news.abs-cbn.com' +
                                    article.get('href') + '\n')
                        print('http://news.abs-cbn.com' + article.get('href'))

            # scrape philstar article links
            elif key == 'philstar-headlines' or 'philstar-nation':
                for i in range(1, 5):
                    response = opener.open(url + str(i))
                    soup = BeautifulSoup(response, 'html.parser')
                    articles = soup.select('span.article-title > a')

                    for article in articles:
                        file1.write('http://www.philstar.com' +
                                    article.get('href') + '\n')
                        print('http://www.philstar.com' + article.get('href'))

            # selenium links to be scraped here

        except ValueError as e:
            # if unable to load link, wait 10 seconds then try again
            # error may be due to high volume of scraping, so crawl delay
            # must be implemented
            print(str(e) + ': ' + url)
            print('Retrying in 10 seconds...')
            time.sleep(10)
            continue

    # used to log the time it took to scrape
    stop = timeit.default_timer()
    web_time = stop - start

    # insert these logs into the database
    client = MongoClient()
    logs = client.news.web_scrape_logs
    logs.insert({
        'date': datetime.now(),
        'web_urls': web_urls,
        'web_time': web_time,
    })


def log_parse():
    """
    Creates a log that includes the runtime of the articles parsed by
    BeautifulSoup and Selenium, respectively.
    """
    # initialize dictionary to be saved as json file
    articles = []
    new_articles = 0
    client = MongoClient()
    collection = client.news.articles

    # time spent scraping using beautifulsoup
    bs4_file = open('static/bs4_out.txt', 'r')
    start = timeit.default_timer()
    bs4_parse(bs4_file, new_articles, articles, collection)
    stop = timeit.default_timer()
    bs4_time = stop - start

    # time spent scraping using selenium
    sel_file = open('static/sel_out.txt', 'r')
    start = timeit.default_timer()
    sel_parse(sel_file, new_articles, articles, collection)
    stop = timeit.default_timer()
    sel_time = stop - start

    # log the times into the database
    logs = client.news.parse_logs
    logs.insert({
        'date': datetime.now(),
        'new_articles': new_articles,
        'urls': sum(1 for line in open('static/bs4_out.txt'))
                + sum(1 for line in open('static/sel_out.txt')),
        'time': bs4_time + sel_time,
        })

    # save all information from articles into a json file
    with open('static/articles.json', 'w', encoding='utf-8') as outfile:
        json.dump(articles, outfile, indent=4, ensure_ascii=False)


def bs4_parse(file, new_articles, articles, collection):
    """
    Parses the necessary information from each article in the given file using BeautifulSoup.
    """
    print("Parsing using BeautifulSoup...")

    opener = HTMLopener()

    for url in file:
        # count the number of new articles
        new_articles += 1

        # if article already exists in db, do not add
        if collection.find({"url": url}).count() > 0:
            print("Exists in DB: " + url)
            new_articles -= 1
            continue

        # if url is from news.abs-cbn.com
        elif 'news.abs-cbn.com' in url:
            time.sleep(5)
            try:
                response = opener.open(url)
                soup = BeautifulSoup(response, 'html.parser')
                title = soup.select('h1.news-title')[0].text
                timestamp = soup.select('span.date-posted')[0].text
                content = []
                table = soup.find('div', attrs={'class': 'article-content'})
                if not table:
                    table = soup.find('small', attrs={'class': 'media-caption'})
                if table:
                    table = table.findAll('p')
                    for x in table:
                        content.append(''.join(x.findAll(text= True)))

                content = ' '.join(content)

                articles.append({
                    'title': title,
                    'timestamp': timestamp,
                    'content': content,
                    'url': url[:-2]
                    })

                print("Added to JSON file: " + url)
            except Exception as e:
                print("Unable to open " + url + ":\n" + str(e))
                continue

        # if news is from philstar
        elif 'philstar.com' in url:
            try:
                response = opener.open(url)
                soup = BeautifulSoup(response, 'html.parser')
                title = soup.find('div',
                                  attrs={'id': 'sports_title'
                                  }).text.split('|')[0].strip()
                timestamp = soup.find('div',
                                      attrs={'id': 'sports_article_credits'
                                      }).text.split(' - ')[1]
                content = []
                table = soup.find('div',
                                  attrs={'id': 'sports_article_writeup'
                                  }).findAll('p')

                for x in table:
                    content.append(''.join(x.findAll(text=True)))

                content = ' '.join(content)

                articles.append({
                    'title': title,
                    'timestamp': timestamp,
                    'content': content,
                    'url': url[:-2]
                })

                print("Added to JSON file: " + url)
            except Exception as e:
                print("Unable to open " + url + ":\n" + str(e))
                continue

        else:
            print("Not scraped: " + url)
            new_articles -= 1
            continue


def sel_parse(file, new_articles, articles, collection):
    """
    Parses the necessary information from each article in the given file using Selenium.
    """
    print('Parsing using Selenium...')
    driver = webdriver.Firefox(executable_path='/mnt/c/Users/beatr/OneDrive/Documents/Git/SyndromeScrape/geckodriver.exe')

    for url in file:
        # count the number of new articles
        new_articles += 1

        # if article already exists in db, do not add
        if collection.find({"url": url}).count() > 0:
            print("Exists in DB: " + url)
            new_articles -= 1
            continue

        # if url is from gmanetwork.com
        elif 'gmanetwork.com' in url:
            try:
                driver.get(url
)
                assert "We cannot find the page" not in driver.page_source

                title = driver.find_element_by_tag_name('title').get_attribute('textContent').split('|')[0].strip()
                timestamp = driver.find_element_by_xpath('//time[@itemprop="datePublished"]').get_attribute('textContent').strip()
                content = []
                table = driver.find_elements_by_xpath('//div[@class="story_main"]//p')

                for x in table:
                    content.append(''.join(x.get_attribute('textContent')))

                content = ' '.join(content)

                articles.append({
                    'title': title,
                    'timestamp': timestamp,
                    'content': content,
                    'url': url[:-2]
                    })

                print("Added to JSON file: " + url)
            except Exception as e:
                print("Unable to open " + url + ":\n" + str(e))
                continue

        else:
            print("Not scraped: " + url)
            new_articles -= 1
            continue

    # close selenium driver
    driver.close()


def insert_articles():
    """Inserts articles into the database."""
    client = MongoClient()
    # database of all articles ever scraped
    collection = client.news.articles
    # database of new articles
    collection_new = client.news.new_articles

    # read json files of article information
    file = open('static/articles.json', 'r', encoding='utf-8')
    parsed = json.loads(file.read())

    # insert into articles collection
    for key in parsed:
        collection.insert(key)

    # insert into new_articles collection
    for key in parsed:
        collection_new.insert(key)

    print("Successfully added articles to database.")
