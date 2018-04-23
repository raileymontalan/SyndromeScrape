import modules.scraper as s
import modules.classifier as c
import modules.extractor as e
import modules.uploader as u

# Create separate files for BeautifulSoup and Selenium
bs4_file = open('static/bs4_out.txt', 'w')
sel_file = open('static/sel_out.txt', 'w')

# Run scrapers
s.rss_scrape(bs4_file, sel_file)
s.web_scrape(bs4_file, sel_file)

# Close files
bs4_file.close()
sel_file.close()

# parse each article link for information
s.log_parse()

# put all articles into the database
s.insert_articles()

# classify the new articles
c.classify()

# extract relations from articles
e.extract()

# upload final data to the online database
u.upload()
