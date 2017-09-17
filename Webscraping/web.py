import urllib.request
from bs4 import BeautifulSoup

site_urls = {
	'abscbn':					'http://news.abs-cbn.com/news?page=',
	'gma-news':					'www.gmanetwork.com/news/archives/news/',
# 	'gma-cbb':					'http://www.gmanetwork.com/news/archives/cbb',
# 	#							http://www.gmanetwork.com/news/archives/cbb/2
# 	'gma-scitech':				'http://www.gmanetwork.com/news/archives/scitech',
# 	#							http://www.gmanetwork.com/news/archives/scitech/2
# 	'gma-serbisyopubliko':		'http://www.gmanetwork.com/news/archives/serbisyopubliko'
# 	#							http://www.gmanetwork.com/news/archives/serbisyopubliko/2
	'inquirer':					'http://www.inquirer.net/article-index?d=',
# 	#							'http://www.inquirer.net/article-index?d=2017-09-12'
# 	'philstar-headlines':		'http://www.philstar.com/headlines/archive',
# 	#							'http://www.philstar.com/headlines/archive?page=2'
# 	'philstar-nation': 			'http://www.philstar.com/nation/archive/top-stories',
# 	#							'http://www.philstar.com/nation/archive/top-stories?page=2'
# 	'mb-national':				'http://news.mb.com.ph/category/national/page',
# 	#							'http://news.mb.com.ph/category/national/page/2
# 	'mb-metro':					'http://news.mb.com.ph/category/metro/page',
# 	#							'http://news.mb.com.ph/category/metro/page/2
# 	'mb-luzon':					'http://news.mb.com.ph/category/luzon/page',
# 	#							'http://news.mb.com.ph/category/luzon/page/2
# 	'mb-visayas':				'http://news.mb.com.ph/category/visayas/page',
# 	#							'http://news.mb.com.ph/category/visayas/page/2
# 	'mb-mindanao':				'http://news.mb.com.ph/category/mindanao/page',
# 	#							'http://news.mb.com.ph/category/mindanao/page/2'
# 	'mb-environment-nature':	'http://news.mb.com.ph/category/environment-nature/page',
# 	#							'http://news.mb.com.ph/category/environment-nature/page/2/
# 	'rappler-nation':			'https://www.rappler.com/nation?start=',
# 	#							'https://www.rappler.com/nation?start=20'
# 	'rappler-science-nature':	'https://www.rappler.com/science-nature',
# 	#							'https://www.rappler.com//science-nature'
# 	'rappler-move-ph':			'https://www.rappler.com/move-ph/issues?start=',
# 	#							'https://www.rappler.com/move-ph/issues?start=20'
}


class HTMLopener(urllib.request.FancyURLopener):
    version = "Mozilla/5.0"
opener = HTMLopener()

def scrape(site_urls):
	for key, url in site_urls.items():
		# if key == 'inquirer':
		# 	for i in range(13, 14):
		# 		response = opener.open(url + '2017-09-' + str(i))
		# 		soup = BeautifulSoup(response, 'html.parser')
		# 		articles = soup.find_all('a', attrs={'rel': 'bookmark'})
		# 		for article in articles:
		# 			print(article.get('href'))
		# if key == 'abscbn':
		# 	for i in range (1, 10):
		# 		response = opener.open(url + str(i))
		# 		soup = BeautifulSoup(response, 'html.parser')
		# 		articles = soup.select('article > a')
		# 		for article in articles:
		# 			print('http://news.abs-cbn.com' + article.get('href'))
		if key == 'gma-news':
			for i in range (1, 10):
				response = opener.open('url' + str(i))
				soup = BeautifulSoup(response, 'html.parser')
				articles = soup.select('li > div > a')
				for article in articles:
					print(article.get('href'))

scrape(site_urls)



# response = opener.open('http://www.inquirer.net/article-index?d=2017-09-17')

# soup = BeautifulSoup(response, 'html.parser')
# articles = soup.find_all('a', attrs={'rel': 'bookmark'})
# for article in articles:
# 	print(article.get('href'))