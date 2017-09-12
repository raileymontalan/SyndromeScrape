########### SETUP THE FUNCTIONS FIRST (JUST RUN THE SCRIPT IN THIS SECTION) ###########

#install.packages(rvest)
#install.packages(R.utils)
library(rvest)
require(R.utils)


#Function to set up start page, end page, keyword, folder where the articles will be saved
initializeSetup <- function(start, end, key) {
  #Change parameters
  start_search_page <<- start
  end_search_page <<- end
  keyword <<- key
  
  #Set up the folder where the articles will be saved
  saved_articles_folder <<- paste("ManilaTimesArticles/",keyword, sep = "")
  if (!dir.exists(saved_articles_folder)) {
    dir.create(saved_articles_folder)
  }
}

#keyword<-"duterte"
#page <- 1
#Function that will output a list of articles that contains the keyword in the title of the article
prepareListOfArticlesToCollect <- function() { 
  collected_list <<- NULL
  for(page in (start_search_page):(end_search_page)) {
    html <- read_html(paste("http://www.manilatimes.net/?s=",keyword,"&paged=",page,sep=""))
    
    links_in_page <- html %>%
      html_nodes("h2 a") %>%
      html_attr("href")
    
    collected_list <<- c(collected_list, links_in_page)
  }
  
  #Remove articles with no mention of the keyword in the headline
  collected_list <<- Filter(function(x) any(grepl(keyword, x)), collected_list)
}

#Function to start scraping all articles in collected_list
startScrape <- function() {
  for (i in 1:length(collected_list)){
    tryCatch({
      #Catch timeout exception for articles that are taking too long to scrape (30 seconds)
      
      evalWithTimeout({
        html <- read_html(collected_list[i])
        
        paragraphs <- html %>%
          html_nodes("div h1, span time, div p") %>%
          html_text(trim=TRUE)
        
        # Saves the scraped articles to separate files in the "Articles" folder of the pwd
        paragraphs[1] <- gsub("/", " ", paragraphs[1])
        write(paragraphs, file = paste(saved_articles_folder,"/", as.Date(paragraphs[2], format = "%B %d, %Y"), "_", paragraphs[1], ".txt",sep=""))
        print(i)
        closeAllConnections()},timeout = 30)
    }, TimeoutException = function(ex) {
      print(paste(i,"was skipped due to timeout."))
    }, error = function(err) {
      # Prints out the article numbers of articles that had error in them
      print(paste(i,"was not scraped."))
    }, warning = function(err) {
      # Just shows warnings, but articles are scraped
      print(paste(i,"has a warning:", err ))
    })
  }
}

############### ONCE EVERYTHING IS SET UP, JUST RUN THE SCRIPT BELOW ############### 

#Store keywords in "crime_keywords.csv" with one keyword per line
#Script still can't handle
keywords_compilation <- read.csv(file="crime_keywords.csv", header = FALSE)

for (word in keywords_compilation[,1]) {
  #Start Page (Latest News) [int], End Page [int], keyword (string)
  initializeSetup(1,517,word)
  prepareListOfArticlesToCollect()
  startScrape()
}


