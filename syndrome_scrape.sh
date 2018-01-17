(sleep 20 && python server.py) &
(sleep 40 && (
	python webscraping/scrape.py &&
	python webscraping/parse.py &&
	python webscraping/insert.py
)) &

sudo mongod