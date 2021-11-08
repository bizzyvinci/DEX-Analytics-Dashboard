import React from 'react';
import { useEffect, useState, useMemo } from "react";
import styled from 'styled-components';
import { useTable, useSortBy, usePagination } from 'react-table';
import {Config} from '../utils';
import Table from '../components/Table.jsx'


const Div = styled.div`
`

const TokenPage = () => {
	const [data, setData] = useState({})
	const [table, setTable] = useState(<h3>Tokens Table Loading</h3>)

	const columns = React.useMemo(() => [
		{Header: 'NAME', accessor: 'link'},
		{Header: 'PRICE', accessor: 'price'},
		{Header: 'VOLUME (24H)', accessor: 'volume_24h'},
		{Header: 'LIQUIDITY', accessor: 'liquidity'},
	], [])

	useEffect(() => {
		async function get_data() {
			const url = `https://api.covalenthq.com/v1/${Config.chain_id}/xy=k/${Config.dexname}/tokens/?key=${Config.key}`;
			let response = await fetch(url);
			let result = await response.json();
			
			// check pagination to get full data
			const data = result.data.items.map(
				(x) => ({
					'address': x.contract_address,
					'name': `${x.contract_name} (${x.contract_ticker_symbol})`,
					'link': <a href={`token/${x.contract_address}`}>{`${x.contract_name} (${x.contract_ticker_symbol})`}</a>,
					'price': x.quote_rate,
					'volume_24h': x.total_volume_24h_quote,
					'liquidity': x.total_liquidity_quote,
					//'decimal': x.contract_decimals,
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
