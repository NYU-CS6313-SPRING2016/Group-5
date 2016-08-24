# Stocktwits -- real-time sentiment analysis
![Screenshot](https://github.com/NYU-CS6313-SPRING2016/Group-5-StockTweets/blob/master/Screen%20Shot%202016-08-22%20at%208.31.35%20PM.png)
- Video: https://vimeo.com/167449385
- Final Document: https://prezi.com/xza6pce6qwmm/stocktwits-dashboard/ 
- Working demo: [STOCKTWITS.com](http://angelinazhao.com/stock/)

####Description
Our project aims to develop a visual analytic platform to mine and visualize data to facilitate diverse traders to make decisions, specifically to buy or to sell. In our project, we hope traders can get information from the website, explore how the stock market is moving and make better decisions. We want to help users filter and visualize the tweets data so that they can understand the activities and market consensus of the stocks they are watching. In addition, they should also be able to capture the credibility and real-time data visualization by overview monitoring of the stock market. We need to pull data in sections like trending, investor-relation to give a further and concise analysis and visualization in aspects of the average recommendation, the market trending and the company/trader credibility and so on.

####We hope to deal with the following question
- 1.	How does the whole market change?
- 2.	What is the top hot sectors or stocks on the StockTwits?
- 3.	What is the co-relation between the stocks and the changes of their market mood?
- 4.	What kinds of traders are talking about the stock? What are their attitudes?
##Data Source
[StockTwits API](http://stocktwits.com/developers)

##Install Instructions
###Requirements
The systems has the following dependences:

1. **Python**: 2.7

###Runing
You may directly visit our online website. If you want to run it locally, you can clone the repository by:
```sh
git clone git@github.com:NYU-CS6313-SPRING2016/Group-7-StockTweets.git
```

This project is based on Django framework. It is strongly recommended that you run it in [virtualenv](https://github.com/kennethreitz/python-guide/blob/master/docs/dev/virtualenvs.rst) to create isolated Python environments and install all dependencies.

1. If virtualenv is not installed, install it via pip:

	```sh
		$ pip install virtualenv
	```

2. Create a virtual environment for a project:

	```sh
		$ cd Group-7-StockTweets
		$ virtualenv venv
	```

3. Install required packeges:

	```sh
		$ pip install -r requirements.txt
	```


4. To begin using the virtual environment, it needs to be activated:

	```sh
		$ source venv/bin/activate
	```

5. Run the server for local test:

	```sh
		$ python manage.py runserver
	```

	Then access to `localhost:8000/infovis`

5. If you are done working in the virtual environment for the moment, you can deactivate it:

	```sh
		$ deactivate
	```
