import React from 'react';
import { useEffect, useState, useMemo } from "react";
import styled from 'styled-components';
import { useTable, useSortBy, usePagination } from 'react-table';
import {Config} from '../utils';
import Table from '../components/Table.jsx'


const Div = styled.div`
	padding: 1rem;

	table {
		border-spacing: 0;
		border: 1px solid black;

		tr {
			:last-child {
				td {
					border-bottom: 0;
				}
			}
		}


		th, td {
			margin: 0;
			padding: 0.5rem;
			border-bottom: 1px solid black;
			border-right: 1px solid black;

			:last-child {
				border-right: 0;
			}
		}
	}

	.pagination {
		padding: 0.5rem;
	}
`


const TokenPage = () => {
	const [data, setData] = useState({})
	const [table, setTable] = useState(<h3>Pools Table Loading</h3>)

	const columns = React.useMemo(() => [
		{Header: 'NAME', accessor: 'link'},
		{Header: 'VOLUME (24H)', accessor: 'volume_24h'},
		{Header: 'SWAP (24H)', accessor: 'swap_24h'},
		{Header: 'FEE (24H)', accessor: 'fee_24h'},
		{Header: 'LIQUIDITY', accessor: 'liquidity'},
	], [])

	useEffect(() => {
		async function get_data() {
			const url = `https://api.covalenthq.com/v1/${Config.chain_id}/xy=k/${Config.dexname}/pools/?key=${Config.key}`;
			let response = await fetch(url);
			let result = await response.json();
			
			// check pagination to get full data
			const data = result.data.items.map(
				(x) => ({
					'address': x.exchange,
					'name': `${x.token_0.contract_ticker_symbol}/${x.token_1.contract_ticker_symbol}`,
					'link': <a href={`/pool/${x.exchange}`}>{`${x.token_0.contract_ticker_symbol}/${x.token_1.contract_ticker_symbol}`}</a>,
					'volume_24h': x.volume_24h_quote,
					'swap_24h': x.swap_count_24h,
					'fee_24h': x.fee_24h_quote,
					'liquidity': x.total_liquidity_quote,
				})
			);
			//console.log(data);
			return data;
		}

		get_data().then(data => setData(data))
	}, []);

	useEffect(() => {
		if (data.length > 0){
			setTable(<Table columns={columns} data={data} length={20} />);
		}
	}, [data]);

	//console.log(data);
	//console.log(columns);

	return (
		<Div>
			{table}
		</Div>
	)
}

export default TokenPage;
