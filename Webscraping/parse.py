import json
import timeit
import urllib.request
from datetime import datetime
from bs4 import BeautifulSoup
from pymongo import MongoClient

articles = {}
articles['abs-cbn'] = []
articles['gma'] = []
articles['inquirer'] = []
articles['mb'] = []
articles['philstar'] = []
articles['rappler'] = []
new_articles = 0

class HTMLopener(urllib.request.FancyURLopener):
    version ='Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'
opener = HTMLopener()

def parse():
	# timers are used to identify the how long parsing all the urls from one file takes
	file = open('static/rss_out.txt', 'r')
	start = timeit.default_timer()
	parse2(file)
	stop = timeit.default_timer()
	rss_time = stop - start

	file = open('static/web_out.txt', 'r')
	start = timeit.default_timer()
	parse2(file)
	stop = timeit.default_timer()
	web_time = stop - start

	# after scraping URLs from both rss_out.txt and web_out.txt, 
	# this will log certain starts into the MongoDB
	client = MongoClient()
	logs = client.scrape.parse_logs
	logs.insert({
		'date': datetime.now(),
		'new_articles': new_articles,
		'rss_urls': sum(1 for line in open('static/rss_out.txt')),
		'web_urls': sum(1 for line in open('static/web_out.txt')),
		'rss_time': rss_time,
		'web_time': web_time,
		})

	with open('static/articles.json', 'w', encoding='utf-8') as outfile:
		json.dump(articles, outfile, indent=4, ensure_ascii=False)

def parse2(file):
	global new_articles
	client = MongoClient()
	collection = client.scrape.articles
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
			# note: there are a few articles that don't return content. abs-cbn doesn't use the class names 
			# for articles that are just captions of a photo kasi so im still trying to find out what tags
			# are used for those (amongst other article types if possible)
			articles['abs-cbn'].append({
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
parse()