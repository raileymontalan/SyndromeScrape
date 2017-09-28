import json
import urllib.request
from bs4 import BeautifulSoup
from pymongo import MongoClient

articles = {}
articles['abs-cbn'] = []
articles['gma'] = []
articles['inquirer'] = []
articles['mb'] = []
articles['philstar'] = []
articles['rappler'] = []

class HTMLopener(urllib.request.FancyURLopener):
    version ='Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'
opener = HTMLopener()

def parse():
	file = open('../static/web_out.txt', 'r')
	parse2(file)

	file = open('../static/rss_out.txt', 'r')
	parse2(file)

	with open('../static/articles.json', 'w', encoding='utf-8') as outfile:
		json.dump(articles, outfile, indent=4, ensure_ascii=False)

def parse2(file):
	client = MongoClient()
	collection = client.scrape.articles
	for url in file:
		if(collection.find({"url": url}).count() > 0):
			print("Exists in DB: " + url)
			continue
		if 'news.abs-cbn.com' in url:
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
		## SSL Certification errors
		# if 'inquirer.net' in url:
		#	response = opener.open(url)
		#	soup = BeautifulSoup(response, 'html.parser')
		# 	title = soup.find('title').text[:-16]
		# 	timestamp = soup.find('div', id='art_plat').text.strip()

		# 	if '/' in timestamp:
		# 		timestamp = timestamp.split('/')[1].strip()

		# 	table = soup.find('div', id='article_content').findAll('p')
		# 	content = []

		# 	for x in table:
		# 		content.append(''.join(x.findAll(text=True)))

		# 	articles['inquirer'].append({
		# 		'title': title,
		# 		'timestamp': timestamp,
		# 		'content': content,
		# 		'url': url
		# 	})
		# 	
		# 	print("Added to DB: " + url)
		if 'philstar.com' in url:
			response = opener.open(url)
			soup = BeautifulSoup(response, 'html.parser')
			title = soup.find('title').text.split('|')[0].strip()
			timestamp = soup.find('span', attrs={'class': 'article-date-info'}).text[8:]
			content = []
			table = soup.find('div', attrs={'class': 'field-item even', 'property': 'content:encoded'}).findAll('p')

			for x in table:
				content.append(''.join(x.findAll(text=True)))

			articles['philstar'].append({
				'title': title,
				'timestamp': timestamp,
				'content': content,
				'url': url	
			})

			print("Added to DB: " + url)
		if 'news.mb.com.ph' in url:
			response = opener.open(url)
			soup = BeautifulSoup(response, 'html.parser')
			title = soup.find('title').text.split('»')[1].strip()
			timestamp = soup.find('time').text
			content = []
			table = soup.find('article').findAll('p')

			for x in table:
				content.append(''.join(x.findAll(text=True)))

			articles['mb'].append({
				'title': title,
				'timestamp': timestamp,
				'content': content,
				'url': url	
			})

			print("Added to DB: " + url)
parse()