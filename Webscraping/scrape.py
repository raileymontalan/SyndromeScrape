import csv, os

site_urls = {
	'abscbn':					'http://www.news.abs-cbn.com',
	#							'http://www.news.abs-cbn.com/news?page=2
	'gma-news':					'http://www.gmanetwork.com/news/archives/news',
	#							http://www.gmanetwork.com/news/archives/news/2
	'gma-cbb':					'http://www.gmanetwork.com/news/archives/cbb',
	#							http://www.gmanetwork.com/news/archives/cbb/2
	'gma-scitech':				'http://www.gmanetwork.com/news/archives/scitech',
	#							http://www.gmanetwork.com/news/archives/scitech/2
	'gma-serbisyopubliko':		'http://www.gmanetwork.com/news/archives/serbisyopubliko'
	#							http://www.gmanetwork.com/news/archives/serbisyopubliko/2
	'inquirer':					'http://www.inquirer.net/article-index',
	#							'http://www.inquirer.net/article-index?d=2017-09-12'
	'philstar-headlines':		'http://www.philstar.com/headlines/archive',
	#							'http://www.philstar.com/headlines/archive?page=2'
	'philstar-nation': 			'http://www.philstar.com/nation/archive/top-stories',
	#							'http://www.philstar.com/nation/archive/top-stories?page=2'
	'mb-national':				'http://news.mb.com.ph/category/national/page',
	#							'http://news.mb.com.ph/category/national/page/2
	'mb-metro':					'http://news.mb.com.ph/category/metro/page',
	#							'http://news.mb.com.ph/category/metro/page/2
	'mb-luzon':					'http://news.mb.com.ph/category/luzon/page',
	#							'http://news.mb.com.ph/category/luzon/page/2
	'mb-visayas':				'http://news.mb.com.ph/category/visayas/page',
	#							'http://news.mb.com.ph/category/visayas/page/2
	'mb-mindanao':				'http://news.mb.com.ph/category/mindanao/page',
	#							'http://news.mb.com.ph/category/mindanao/page/2'
	'mb-environment-nature':	'http://news.mb.com.ph/category/environment-nature/page',
	#							'http://news.mb.com.ph/category/environment-nature/page/2/
	'rappler-nation':			'https://www.rappler.com/nation?start=',
	#							'https://www.rappler.com/nation?start=20'
	'rappler-science-nature':	'https://www.rappler.com/science-nature',
	#							'https://www.rappler.com//science-nature'
	'rappler-move-ph':			'https://www.rappler.com/move-ph/issues?start=',
	#							'https://www.rappler.com/move-ph/issues?start=20'
}

