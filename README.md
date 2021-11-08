# DEX ANALYTICS TEMPLATE FOR COVALENT API

This is a dashboard template for analyzing data of DEcentralized eXchages using [covalent's api](https://www.covalenthq.com/docs/learn/guides/configure/uniswap-clone). It is hosted on [Heroku](https://dex-analytics.herokuapp.com/) and can be run locally in 3 steps:

1. Add your covalent api key to environment variable as `REACT_APP_CKEY`
1. Install required dependencies
1. run `npm start` in the current folder

You might also want to change the `Config` in src/utils.py. Available dexname can be found [here](https://www.covalenthq.com/docs/learn/guides/configure/uniswap-clone#introduction) and you can check the chain_id [here](https://www.covalenthq.com/docs/networks#indexed-networks). Also make sure to use the correct `explorer` for your network.


If you see the following error message on the hosted dashboard. Kindly refresh the page a couple of times. I'll look into it and probably upgrade soon.

<img src='https://i.stack.imgur.com/ZDBwR.png' alt='nothing here yet error' width='500px' style='text-align: center;' />


## Structure
The project is built with react components which are extensions of what is provided by `recharts` and `react-table` libraries. They are easy to style with css or `styled-components`. The building components are:
* AreaChart
* BarChart
* ButtonGroup
* Info
* Table

The pages are where api is fetched and the data is processed for the visualization components. This is a [**demo video**](https://youtu.be/gg2Gx-YBUZo) to see the components and pages.

The dashboard contains all visualizations that are currently used by DEXes and more. Happy building and I'm an issue away.


## Bad news
Every component and page is working now **but** some of my data aggregation seems wrong, as well as some bizarre results from the API.


### A few notes for Covalent team
* API is slow sometimes. (Ok, I think it's too damn slow). And it breaks sometimes, a few times.
* There's usually spike in 30d chart data for this [ecosystem endpoint](https://api.covalenthq.com/v1/{chain_id}/xy=k/{dexname}/ecosystem/). It is a common error among all DEXes but it disappears sometimes. Also, I noticed that such spikes are not in 7d chart datas.
* Allow parameters such as page, offset, limit and sort for some of the endpoints.
