import React from 'react';
import { useEffect, useState } from "react";
import styled from 'styled-components';
import { Config, numFormatter } from '../utils';
import AreaChart from '../components/AreaChart.jsx';
import BarChart from '../components/BarChart.jsx';
import Info from '../components/Info.jsx';


const Div = styled.div`
	font-family: Kanit, sans-serif;
`;

const Header = styled.div`
	font-weight: bold;
	font-size: 200%;
	text-align: center;
	color: #2a275a;
	margin: 1rem 0;
	width: 100%;
`;

const RowDiv = styled.div`
	display: flex;
	@media screen and (max-width: 768px) {
		display: block;
		align-items: center;
	}
`;

const Overview = () => {
	const [data, setData] = useState({});

	useEffect(() => {
		async function get_data() {
			const url = `https://api.covalenthq.com/v1/${Config.chain_id}/xy=k/${Config.dexname}/ecosystem/?key=${Config.key}`;
			let response = await fetch(url);
			let result = await response.json();
			result = result.data.items[0];

			const liquidity = result.liquidity_chart_30d.map(
				(x) => ({'date': x.dt.substr(0,10), 'value': x.liquidity_quote}));
			const volume = result.volume_chart_30d.map(
				(x) => ({'date': x.dt.substr(0,10), 'value': x.volume_quote}));
			const swaps = result.volume_chart_30d.map(
				(x) => ({'date': x.dt.substr(0,10), 'value': x.swap_count_24}));
			const meta = {
				'Swap (24hr)': result.total_swaps_24h.toLocaleString('en-US'),
				'Active pairs (7d)': result.total_active_pairs_7d.toLocaleString('en-US'),
				'Fees (24hr)': '$' + numFormatter(result.total_fees_24h),
				[Config.chain_name + ' price']: '$' + numFormatter(result.gas_token_price_quote)
			};

			return {
				'liquidity': liquidity,
				'volume': volume,
				'swaps': swaps,
				'meta': meta
			};
		}
		get_data().then(data => setData(data))
	}, [])
	return (
		<>
			<Div>
				<Header>{Config.dexname} info and analytics with covalenthq</Header>
				<RowDiv>
					<AreaChart data={data.liquidity} title='Liquidity' />
					<BarChart data={data.volume} title='Volume' />
				</RowDiv>
				<RowDiv>
					<BarChart data={data.swaps} title='Swaps' valPrefix='' />
					<Info data={data.meta} title='Metadata' />
				</RowDiv>
			</Div>
		</>
	)
}

export default Overview
