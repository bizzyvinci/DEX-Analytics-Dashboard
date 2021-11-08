# DEX ANALYTICS TEMPLATE FOR COVALENT API

This is a dashboard template for analyzing data of DEcentralized eXchages using [covalent's api](https://www.covalenthq.com/docs/learn/guides/configure/uniswap-clone). It is hosted on [Heroku](https://dex-analytics.herokuapp.com/) and can be run locally in 3 steps:

1. Add your covalent api key to environment variable as `REACT_APP_CKEY`
1. Install required dependencies
1. run `npm start` in the current folder

You might also want to change the `Config` in src/utils.py. Available dexname can be found [here](https://www.covalenthq.com/docs/learn/guides/configure/uniswap-clone#introduction) and you can check the chain_id [here](https://www.covalenthq.com/docs/networks#indexed-networks). Also make sure to use the correct `explorer` for your network.



#### A few notes for Covalent team
* API is slow sometimes.
* There's usually spike in 30d chart data for this [ecosystem endpoint](https://api.covalenthq.com/v1/{chain_id}/xy=k/{dexname}/ecosystem/). It is a common error among all DEXes but it disappears sometimes. Also, I noticed that such spikes are not in 7d chart datas.
* Allow parameters such as page, offset, limit and sort for some of the endpoints.
