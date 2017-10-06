#!/usr/bin/env python

import json
import timeit
import urllib.request
from datetime import datetime
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from pymongo import MongoClient


# Initialize dictionary to be saved as JSON file
articles = {}
articles['abs-cbn'] = []
articles['gma'] = []
articles['inquirer'] = []
articles['mb'] = []
articles['philstar'] = []
articles['rappler'] = []

new_articles = 0
client = MongoClient()
collection = client.scrape.articles


class HTMLopener(urllib.request.FancyURLopener):
    """Initializes HTML opener for BeautifulSoup."""
    version ='Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 \
             (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'


def log_parse():
    """
    Creates a log that includes the runtime of the articles parsed by
    BeautifulSoup and Selenium, respectively.
    """
    
    # Time scraping using BeautifulSoup
    bs4_file = open('static/bs4_out.txt', 'r')
    start = timeit.default_timer()
    bs4_parse(bs4_file)
    stop = timeit.default_timer()
    bs4_time = stop - start
    
    # # Time scraping using Selenium
    # sel_file = open('static/sel_out.txt', 'r')
    # start = timeit.default_timer()
    # sel_parse(sel_file)
    # stop = timeit.default_timer()
    # sel_time = stop - start

    # Log the times into the database
    logs = client.scrape.parse_logs
    logs.insert({
        'date': datetime.now(),
        'new_articles': new_articles,
        'urls': sum(1 for line in open('static/bs4_out.txt')) 
                + sum(1 for line in open('static/sel_out.txt')),
        'bs4_time': bs4_time,
        # 'sel_time': sel_time
        })

    # Save all information from articles into a JSON file
    with open('static/articles.json', 'w', encoding='utf-8') as outfile:
        json.dump(articles, outfile, indent=4, ensure_ascii=False)


def bs4_parse(file):
    """
    Parses the necessary information from each article in the given file using BeautifulSoup.
    """
    global new_articles

    for url in file:
        new_articles += 1
        
        if(collection.find({"url": url}).count() > 0):
            print("Exists in DB: " + url)
            new_articles -= 1
            continue

        elif 'news.abs-cbn.com' in url:
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
                    
            articles['abs-cbn'].append({
                'title': title,
                'timestamp': timestamp,
                'content': content,
                'url': url
                })

            print("Added to DB: " + url)

        elif 'philstar.com' in url:
            response = opener.open(url)
            soup = BeautifulSoup(response, 'html.parser')
            title = soup.find('title').text.split('|')[0].strip()
            timestamp = soup.find('span', attrs={'class': 'article-date-info'}).text[8:]
            content = []
            table = soup.find('div', attrs={'class': 'field-item even', 
                              'property': 'content:encoded'}).findAll('p')

            for x in table:
                content.append(''.join(x.findAll(text=True)))

            articles['philstar'].append({
                'title': title,
                'timestamp': timestamp,
                'content': content,
                'url': url  
            })

            print("Added to DB: " + url)

        else:
            print("Not scraped: " + url)
            new_articles -= 1
            continue


def sel_parse(file):
    """
    Parses the necessary information from each article in the given file using Selenium.
    """
    global new_articles
    driver = webdriver.Firefox()

    for url in file:
        new_articles += 1
        
        if(collection.find({"url": url}).count() > 0):
            print("Exists in DB: " + url)
            new_articles -= 1
            continue

        elif 'gmanetwork.com' in url:
            driver.get(url)

            assert "We cannot find the page" not in driver.page_source

            title = driver.find_element_by_tag_name('title').get_attribute('textContent').split('|')[0].strip()
            timestamp = driver.find_element_by_xpath('//time[@itemprop="datePublished"]').get_attribute('textContent').strip()
            content = []
            table = driver.find_elements_by_xpath('//div[@class="story_main"]//p')

            for x in table:
                content.append('\n'.join(x.get_attribute('textContent')))

            articles['gma'].append({
                'title': title,
                'timestamp': timestamp,
                'content': content,
                'url': url
                })

            print("Added to DB: " + url)
            
        else:
            print("Not scraped: " + url)
            new_articles -= 1
            continue

    driver.close()


# Initialize HTMLopener()
opener = HTMLopener()

# Begin parsing the news articles
log_parse()
