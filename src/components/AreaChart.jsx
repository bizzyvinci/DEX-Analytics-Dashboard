import React from 'react';
import { useEffect, useState } from "react";
import styled from 'styled-components';
import { 
	ResponsiveContainer,
	Area,
	AreaChart,
	defs,
	XAxis,
	YAxis,
	Tooltip
} from 'recharts';
import { format, parseISO, subDays } from "date-fns";
import { numFormatter, dayFormatter } from '../utils';

const Div = styled.div`
	padding: 2rem;
	margin: 1rem;
	display: inline-block;
	border: solid 2px #2a275a;
	border-radius: 1rem;
	background-color: #eee;
	width: ${p => (p.width || '50%')};
	height: ${p => (p.height || '310px')};
	@media screen and (max-width: 768px) {
		display: block;
		width: 80%;
	}
`;

const TitleP = styled.p`
	font-weight: bold;
	color: #7256ce;
	margin: 3px;
`;

const ValueP = styled.p`
	font-weight: bold;
	font-size: 150%;
	color: #2a275a;
	margin: 3px;
`;

const DateP = styled.p`
	color: #2a275a;
	margin: 3px;
`;


const MyAreaChart = ({ title, data, height, width }) => {
	const [hoveredValue, setHoveredValue] = useState("");
	const [hoveredDate, setHoveredDate] = useState("");

	const updateHover = (payload) => {
		setHoveredValue(`$${numFormatter(payload.value)}`);
		setHoveredDate(format(parseISO(payload.date), 'MMM d, yyyy'));
	}
	
	const defaultHover = () => {
		if (data) {
			updateHover(data.at(-1))
		}
	}

	const handleMouseMove = (a,b) => {
		if(a && a.activePayload) {
			//console.log(a.activePayload[0].payload);
			updateHover(a.activePayload[0].payload);
		}
	}

	// What the hell are you doing here
	useEffect(() => {
		defaultHover();
	}, [data]);

	return (
		<>
			<Div height={height} width={width}>
				{title && <div><TitleP>{title}</TitleP></div>}
				<div>
					<ValueP>{hoveredValue}</ValueP>
					<DateP>{hoveredDate}</DateP>
				</div>
				<ResponsiveContainer width="100%" height={250}>
					<AreaChart margin={{ top: 5, right: 20, left: 5, bottom: 5 }} data={data}
						onMouseLeave={defaultHover} onMouseMove={handleMouseMove}>
						<Area dataKey="value" stroke="#2a275a" fill="url(#color)" />
						<defs>
							<linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
								<stop offset="0%" stopColor="#2a275a" stopOpacity={0.9} />
								<stop offset="75%" stopColor="#2a275a" stopOpacity={0.1} />
							</linearGradient>
						</defs>
						<XAxis 
							dataKey="date"
							axisLine={false}
							tickLine={false}
							tickFormatter={str => dayFormatter(str)}
						/>
						<YAxis
							dataKey="value"
							orientation="right"
							axisLine={false}
							tickLine={false}
							tickCount={8}
							tickFormatter={val => numFormatter(val)}
						/>
						<Tooltip content={() => null} />
					</AreaChart>
				</ResponsiveContainer>
			</Div>
		</>
	)
}

export default MyAreaChart;
