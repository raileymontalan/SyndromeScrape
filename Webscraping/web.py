import urllib.request
from bs4 import BeautifulSoup

site_urls = {
	'abscbn':					'http://news.abs-cbn.com/news?page=',
## GMA's website is unusable! It fetched data via JS rather than puting it in the actual site
#	'gma-news':					'http://www.gmanetwork.com/news/archives/news/',
# 	'gma-cbb':					'http://www.gmanetwork.com/news/archives/cbb/',
# 	'gma-scitech':				'http://www.gmanetwork.com/news/archives/scitech',
# 	'gma-serbisyopubliko':		'http://www.gmanetwork.com/news/archives/serbisyopubliko'
## GMA's website is unusable! It fetched data via JS rather than puting it in the actual site
	'inquirer':					'http://www.inquirer.net/article-index?d=',
	'philstar-headlines':		'http://www.philstar.com/headlines/archive?page=',
	'philstar-nation': 			'http://www.philstar.com/nation/archive/top-stories?page=',
	'mb-national':				'http://news.mb.com.ph/category/national/page/',
	'mb-metro':					'http://news.mb.com.ph/category/metro/page/',
	'mb-luzon':					'http://news.mb.com.ph/category/luzon/page/',
	'mb-visayas':				'http://news.mb.com.ph/category/visayas/page/',
	'mb-mindanao':				'http://news.mb.com.ph/category/mindanao/page/',
	'mb-environment-nature':	'http://news.mb.com.ph/category/environment-nature/page/',
## Rappler is unusable as well, need permission because of HTTPS security	
	# 'rappler-nation':			'https://www.rappler.com/nation?start=',
	# 'rappler-move-ph':			'https://www.rappler.com/move-ph/issues?start=',
	# 'rappler-life-health':		'https://www.rappler.com/science-nature/life-health?start=',
	# 'rappler-matters-numbers':	'https://www.rappler.com/science-nature/matters-numbers?start=',
	# 'rappler-specials':			'https://www.rappler.com/science-nature/specials?start=',
	# 'rappler-environment':		'https://www.rappler.com/science-nature/environment?start='
##
}


class HTMLopener(urllib.request.FancyURLopener):
    version='Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'
opener = HTMLopener()

def scrape(site_urls):
	file = open('web_out.txt', 'w')

	for key, url in site_urls.items():
		if key == 'inquirer':
			for i in range(13, 14):
				response = opener.open(url + '2017-09-' + str(i))
				soup = BeautifulSoup(response, 'html.parser')
				articles = soup.find_all('a', attrs={'rel': 'bookmark'})
				for article in articles:
					file.write(article.get('href') + '\n')
					print(article.get('href'))
		if key == 'abscbn':
			for i in range (1, 10):
				response = opener.open(url + str(i))
				soup = BeautifulSoup(response, 'html.parser')
				articles = soup.select('article > a')
				for article in articles:
					file.write('http://news.abs-cbn.com' + article.get('href') + '\n')
					print('http://news.abs-cbn.com' + article.get('href'))
		if key == 'philstar-headlines' or 'philstar-nation':
			for i in range (1, 10):
				response = opener.open(url + str(i))
				soup = BeautifulSoup(response, 'html.parser')
				articles = soup.select('span.article-title > a')
				for article in articles:
					file.write('https://www.philstar.com' + article.get('href') + '\n')
					print('https://www.philstar.com' + article.get('href'))
		if key == 'mb-national' or 'mb-metro' or 'mb-luzon' or 'mb-visayas' or 'mb-mindanao' or 'mb-environment-nature':
			for i in range (1, 3):
				response = opener.open(url + str(i))
				soup = BeautifulSoup(response, 'html.parser')
				articles = soup.select('div > div > h3 > a')
				for article in articles:
					file.write(article.get('href') + '\n')
					print(article.get('href'))
		# if key == 'rappler-nation' or 'rappler-move-ph' or 'rappler-life-health' or 'rappler-matters-numbers' or 'rappler-specials' or 'rappler-environment':
		# 	for i in range (0, 10):
		# 		response = opener.open(url + str(i*10))
		# 		soup = BeautifulSoup(response, 'html.parser')
		# 		articles = soup.select('h4 > a')
		# 		for article in articles:
		# 			print('http://www.rappler.com' + article.get('href'))

	file.close()

scrape(site_urls)