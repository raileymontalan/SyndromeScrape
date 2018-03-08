(sleep 20 && python server.py) &
(sleep 40 && (
	python web_scraper/scrape.py &&
	python web_scraper/parse.py &&
	python web_scraper/insert.py
)) &

sudo mongod