import json
import urllib.request
from bs4 import BeautifulSoup

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
	file = open('static/web_out.txt', 'r')
	parse2(file)

	file = open('static/rss_out.txt', 'r')
	parse2(file)

	with open('static/articles.json', 'w', encoding='utf-8') as outfile:
		json.dump(articles, outfile, indent=4, ensure_ascii=False)

def parse2(file):
	for url in file:
		print(url)
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
			# note: there are a few articles that don't return content. abs-cbn doesn't use the class names 
			# for articles that are just captions of a photo kasi so im still trying to find out what tags
			# are used for those (amongst other article types if possible)
			articles['abs-cbn'].append({
				'title': title,
				'timestamp': timestamp,
				'content': content,
				'url': url
				})
parse()