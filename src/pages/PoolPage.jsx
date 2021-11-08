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
		display: block;
		justify-content: center;
	}
`;


const PoolPage = () => {
	const { address } = useParams();
	const [data, setData] = useState({})
	const [buttonOptions, setButtonOptions] = useState([])
	const [selectedChart, setSelectedChart] = useState('liquidity')

	const columns = React.useMemo(() => [
		{Header: 'ACTION', accessor: 'link'},
		{Header: 'TOTAL VALUE', accessor: 'total_value'},
		{Header: 'TOKEN AMOUNT', accessor: 'amount_0'},
		{Header: 'TOKEN AMOUNT', accessor: 'amount_1'},
		{Header: 'TIME', accessor: 'time'},
	], [])

	useEffect(() => {
		async function get_data() {
			const pool_url = `https://api.covalenthq.com/v1/${Config.chain_id}/xy=k/${Config.dexname}/pools/address/${address}/?key=${Config.key}`;
			const transaction_url = `https://api.covalenthq.com/v1/${Config.chain_id}/xy=k/${Config.dexname}/pools/address/${address}/transactions/?key=${Config.key}`;
			let pool_response = await fetch(pool_url);
			let pool_result = await pool_response.json();
			pool_result = pool_result.data.items[0];

			let transaction_response = await fetch(transaction_url);
			let transaction_result = await transaction_response.json();
			
			const liquidity = pool_result.liquidity_timeseries_30d.map(
				x => ({'date': x.dt.substr(0,10), 'value': x.liquidity_quote}))
			const volume = pool_result.volume_timeseries_30d.map(
				x => ({'date': x.dt.substr(0,10), 'value': x.volume_quote}))
			const swaps = pool_result.volume_timeseries_30d.map(
				x => ({'date': x.dt.substr(0,10), 'value': x.swap_count_24}))
			const token_0_prices = pool_result.price_timeseries_30d.map(
				x => ({'date': x.dt.substr(0,10), 'value': x.price_of_token0_in_token1}))
			const token_1_prices = pool_result.price_timeseries_30d.map(
				x => ({'date': x.dt.substr(0,10), 'value': x.price_of_token1_in_token0}))
			const token_0 = pool_result.token_0
			const token_1 = pool_result.token_1
			const meta = {
				'Swap (24hr)': pool_result.swap_count_24h.toLocaleString('en-US'),
				'Liquidity': '$' + numFormatter(pool_result.total_liquidity_quote),
				'Volume (24hr)': '$' + numFormatter(pool_result.volume_24h_quote),
				'Fees (24hr)': '$' + numFormatter(pool_result.fee_24h_quote),
				'Volume (7d)': '$' + numFormatter(pool_result.volume_7d_quote),
				[pool_result.token_0.contract_ticker_symbol + ' Locked']: numFormatter(pool_result.token_0.reserve / 10^pool_result.token_0.contract_decimals),
				[pool_result.token_1.contract_ticker_symbol + ' Locked']: numFormatter(pool_result.token_1.reserve / 10^pool_result.token_1.contract_decimals)
			}

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
				liquidity: liquidity,
				volume: volume,
				swaps: swaps,
				token_0_prices: token_0_prices,
				token_1_prices: token_1_prices,
				token_0: token_0,
				token_1: token_1,
				meta: meta,
				transactions: swap_transactions.concat(
					add_transactions).concat(remove_transactions).sort(
					(a,b) => (b.time - a.time))
			}

			const buttonOptions = [
				['Liquidity', 'liquidity'],
				['Volume', 'volume'],
				['Swaps', 'swaps'],
				[`${data.token_0.contract_ticker_symbol}/${data.token_1.contract_ticker_symbol}`, 'token_0_prices'],
				[`${data.token_1.contract_ticker_symbol}/${data.token_0.contract_ticker_symbol}`, 'token_1_prices']
			]

			console.log(data, buttonOptions);
			return [data, buttonOptions];
		}

		get_data().then(([data, buttonOptions]) => {setData(data); setButtonOptions(buttonOptions)});
		
	}, []);

	const charts = {
		liquidity: <AreaChart data={data.liquidity} width='80%' />,
		volume: <BarChart data={data.volume} width='80%' />,
		swaps: <BarChart data={data.swaps} width='80%' valPrefix='' />,
		token_0_prices: <AreaChart data={data.token_0_prices} width='80%' />,
		token_1_prices: <AreaChart data={data.token_1_prices} width='80%' />,
	}

	
	return (
		<>
			<Div>
				<RowDiv>
					{data.token_0 &&
						<h3>
							{`${data.token_0.contract_ticker_symbol}/${data.token_1.contract_ticker_symbol} Analytics`}
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
					{data.transactions && <Table data={data.transactions} columns={columns}/>}
				</RowDiv>
			</Div>
		</>
	)
}

export default PoolPage;
