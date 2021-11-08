import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Config, numFormatter } from '../utils';
import AreaChart from '../components/AreaChart.jsx';
import BarChart from '../components/BarChart.jsx';
import Info from '../components/Info.jsx';
import Table from '../components/Table.jsx';
import ButtonGroup from '../components/ButtonGroup.jsx';


const Div = styled.div`
	font-family: Kanit, sans-serif;
`

const RowDiv = styled.div`
	display: flex;
	div.chart {
		width: 70%;
		display: block;
	}
	@media screen and (max-width: 768px) {
		display: block;
		align-items: center;
	}
	h3 {
		justify-content: center;
	}
`;


const TokenPage = () => {
	const { address } = useParams();
	const [data, setData] = useState({})
	const [buttonOptions, setButtonOptions] = useState([])
	const [selectedChart, setSelectedChart] = useState('liquidity')

	const transactionColumns = React.useMemo(() => [
		{Header: 'ACTION', accessor: 'link'},
		{Header: 'TOTAL VALUE', accessor: 'total_value'},
		{Header: 'TOKEN AMOUNT', accessor: 'amount_0'},
		{Header: 'TOKEN AMOUNT', accessor: 'amount_1'},
		{Header: 'TIME', accessor: 'time'},
	], [])

	const poolColumns = React.useMemo(() => [
		{Header: 'POOL', accessor: 'pool'},
		{Header: 'VOLUME (24HR)', accessor: 'volume_24h'},
		{Header: 'VOLUME (24D)', accessor: 'volume_7d'},
		{Header: 'LIQUIDITY', accessor: 'liquidity'},
		{Header: 'SWAP', accessor: 'swaps'},
		{Header: 'FEE', accessor: 'fee_24h'},
	], [])

	useEffect(() => {
		async function get_data() {
			console.log('Getting Data')
			const token_url = `https://api.covalenthq.com/v1/${Config.chain_id}/xy=k/${Config.dexname}/tokens/address/${address}/?key=${Config.key}`;
			const transaction_url = `https://api.covalenthq.com/v1/${Config.chain_id}/xy=k/${Config.dexname}/tokens/address/${address}/transactions/?key=${Config.key}`;
			let token_response = await fetch(token_url);
			let token_result = await token_response.json();
			token_result = token_result.data.items;
			
			let transaction_response = await fetch(transaction_url);
			let transaction_result = await transaction_response.json();
			
			const meta = {
				'Swap (24hr)': 0, //swap_count_24h
				'Liquidity': 0, //total_liquidity_quote
				'Volume (24hr)': 0, //volume_24h_quote
				'Volume (7d)': 0, //volume_7d_quote
				'Fee (24hr)': 0, //fee_24h_quote
			}

			let pools = []

			//liquidity_timeseries_30d.liquidity_quote
			let liquidity = new Proxy({}, {
				get: (target, name) => name in target ? target[name] : 0
			})
			let volume = new Proxy({}, {
				get: (target, name) => name in target ? target[name] : 0
			}) //volume_timeseries_30d.volume_quote
			let swaps = new Proxy({}, {
				get: (target, name) => name in target ? target[name] : 0
			}) //volume_timeseries_30d.swap_count_24
			let price = new Proxy({}, {
				get: (target, name) => name in target ? target[name] : 0
			}) //price_timeseries_30d.price_of_token0_in_quote_currency
			

			for (let i=0; i<token_result.length; i++) {
				const pool = token_result[i];
				meta['Swap (24hr)'] += pool.swap_count_24h
				meta['Liquidity'] += pool.total_liquidity_quote
				meta['Volume (24hr)'] += pool.volume_24h_quote
				meta['Volume (7d)'] += pool.volume_7d_quote
				meta['Fee (24hr)'] += pool.fee_24h_quote

				pools.push({
					'pool': (<a href={`/pool/${pool.exchange}`}>
								{`${pool.token_0.contract_ticker_symbol}/${pool.token_1.contract_ticker_symbol}`}
							</a>),
					'volume_24h': pool.volume_24h_quote,
					'volume_7d': pool.volume_7d_quote,
					'fee_24h': pool.fee_24h_quote,
					'liquidity': pool.total_liquidity_quote,
					'swaps': pool.swap_count_24h,
				});

				pool.liquidity_timeseries_30d.map((x => {
					liquidity[x.dt.substr(0,10)] += x.liquidity_quote;
				}));

				pool.volume_timeseries_30d.map((x => {
					volume[x.dt.substr(0,10)] += x.volume_quote;
					swaps[x.dt.substr(0,10)] += x.swap_count_24h;
				}))


				pool.price_timeseries_30d.map((x => {
					price[x.dt.substr(0,10)] += x.price_of_token0_in_quote_currency;
				}));
			}

			console.log(meta, pools, price, swaps, liquidity, volume)

			const swap_transactions = transaction_result.data.items.filter(x => (
				x.act==='SWAP'
			)).map((x) => ({
				// Probably to_address, from_address or sender_address
				'address': x.address,
				'tx_hash': x.tx_hash,
				'action': x.act,
				'total_value': x.total_quote,
				'link': <a href={`${Config.chain_explorer}tx/${x.tx_hash}`} 
					target='_blank' rel='noreferrer noopener'>
					{('SWAP '
						+ (x.amount_0_in=='0' ? x.token_1.contract_ticker_symbol : x.token_0.contract_ticker_symbol)
						+ ' FOR '
						+ (x.amount_0_in=='0' ? x.token_0.contract_ticker_symbol : x.token_1.contract_ticker_symbol)
					)}
					</a>,
				'amount_0': ((parseInt(x.amount_0_in) || parseInt(x.amout_0_out)) / 10^x.token_0.contract_decimals) + ' ' + x.token_0.contract_ticker_symbol,
				'amount_1': ((parseInt(x.amount_1_in) || parseInt(x.amout_1_out)) / 10^x.token_1.contract_decimals) + ' ' + x.token_1.contract_ticker_symbol,
				'time': x.block_signed_at
			}))

			const add_transactions = transaction_result.data.items.filter(x => (
				x.act==='ADD_LIQUIDITY'
			)).map(x => ({
				'address': x.address,
				'tx_hash': x.tx_hash,
				'action': x.act,
				'total_value': x.total_quote,
				'link': <a href={`${Config.chain_explorer}tx/${x.tx_hash}`} 
					target='_blank' rel='noreferrer noopener'>
					{`ADD ${x.token_0.contract_ticker_symbol} and ${x.token_1.contract_ticker_symbol}`}
					</a>,
				'amount_0': (parseInt(x.amount_0) / 10^x.token_0.contract_decimals) + ' ' + x.token_0.contract_ticker_symbol,
				'amount_1': (parseInt(x.amount_1) / 10^x.token_1.contract_decimals) + ' ' + x.token_1.contract_ticker_symbol,
				'time': x.block_signed_at
			}))

			const remove_transactions = transaction_result.data.items.filter(x => (
				x.act==='REMOVE_LIQUIDITY'
			)).map(x => ({
				'address': x.address,
				'tx_hash': x.tx_hash,
				'action': x.act,
				'total_value': x.total_quote,
				'link': <a href={`${Config.chain_explorer}tx/${x.tx_hash}`} 
					target='_blank' rel='noreferrer noopener'>
					{`REMOVE ${x.token_0.contract_ticker_symbol} and ${x.token_1.contract_ticker_symbol}`}
					</a>,
				'amount_0': (parseInt(x.amount_0) / 10^x.token_0.contract_decimals) + ' ' + x.token_0.contract_ticker_symbol,
				'amount_1': (parseInt(x.amount_1) / 10^x.token_1.contract_decimals) + ' ' + x.token_1.contract_ticker_symbol,
				'time': x.block_signed_at
			}))
			
			const data = {
				token: token_result[0].token_0.contract_ticker_symbol,
				pools: pools,
				liquidity: Object.entries(liquidity).map(([key, value]) => ({'date': key, 'value': value})),
				volume: Object.entries(volume).map(([key, value]) => ({'date': key, 'value': value})),
				swaps: Object.entries(swaps).map(([key, value]) => ({'date': key, 'value': value})),
				price: Object.entries(price).map(([key, value]) => ({'date': key, 'value': value})),
				meta: meta,
				transactions: swap_transactions.concat(
					add_transactions).concat(remove_transactions).sort(
					(a,b) => (b.time - a.time))
			}

			const buttonOptions = [
				['Liquidity', 'liquidity'],
				['Volume', 'volume'],
				['Swaps', 'swaps'],
				['Price', 'price']
			]

			console.log(data, buttonOptions);
			return [data, buttonOptions];
		}

		get_data().then(([data, buttonOptions]) => {setData(data); setButtonOptions(buttonOptions)});
		
	}, []);
	
	const charts = {
		liquidity: <AreaChart data={data.liquidity} width='80%' />,
		price: <AreaChart data={data.liquidity} width='80%' />,
		volume: <BarChart data={data.volume} width='80%' />,
		swaps: <BarChart data={data.swaps} width='80%' valPrefix='' />,
	}

	return (
		<>
			<Div>
				<RowDiv>
					{data.token &&
						<h3>
							{`${data.token} Analytics`}
						</h3>
					}
				</RowDiv>
				<RowDiv>
					<Info data={data.meta} title='Metadata' width='30%' height='360px' hugeFont={false} />
					<div className='chart'>
						<ButtonGroup options={buttonOptions} selected={selectedChart} setSelected={setSelectedChart} />
						{charts[selectedChart]}
					</div>
				</RowDiv>
				<RowDiv>
					<h3>Transactions</h3>
				</RowDiv>
				<RowDiv>
					{data.transactions && <Table data={data.transactions} columns={transactionColumns}/>}
				</RowDiv>
				<RowDiv>
					<h3>Pools</h3>
				</RowDiv>
				<RowDiv>
					{data.pools && <Table data={data.pools} columns={poolColumns}/>}
				</RowDiv>
			</Div>
		</>
	)
}

export default TokenPage;
