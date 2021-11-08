import React from 'react';
import { useEffect, useState } from "react";
import styled from 'styled-components';
import { 
	ResponsiveContainer,
	Bar,
	BarChart,
	Cell,
	defs,
	XAxis,
	YAxis,
	Tooltip,
	CartesianGrid,
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


const MyBarChart = ({ title, data, width, height, valPrefix }) => {
	const [hoveredValue, setHoveredValue] = useState("");
	const [hoveredDate, setHoveredDate] = useState("");
	const [focusBar, setFocusBar] = useState(null);
	const [mouseLeave, setMouseLeave] = useState(true);

	const updateHover = (payload) => {
		setHoveredValue(`${valPrefix==null ? '$' : valPrefix}${numFormatter(payload.value)}`);
		setHoveredDate(format(parseISO(payload.date), 'MMM d, yyyy'));
	}
	
	const defaultHover = () => {
		if (data) {
			updateHover(data.at(-1))
		}
	}

	const handleMouseMove = (state) => {
		if(state) {
			//console.log(state.activePayload, state.activeTooltipIndex)
			if (state.activePayload) {
				updateHover(state.activePayload[0].payload);
			};

			if (state.isTooltipActive) {
				setFocusBar(state.activeTooltipIndex);
				setMouseLeave(false);
			} else {
				setFocusBar(null);
				setMouseLeave(true);
			};
		}
	}

	const getCells = () => {
		if (data) {
			//console.log('making array')
			return (
				data.map((entry, index) => {
					return <Cell fill={focusBar===index || mouseLeave 
							? "#7256ce" : "rgba(114, 86, 221, 0.6)"} key={index} />
				})
			)
		}
		//console.log('empty array')
		return [];
	}

	useEffect(() => {
		defaultHover();
	}, [data]);

	return (
		<>
			<Div width={width} height={height}>
				{title && <div><TitleP>{title}</TitleP></div>}
				<div>
					<ValueP>{hoveredValue}</ValueP>
					<DateP>{hoveredDate}</DateP>
				</div>
				<ResponsiveContainer width="100%" height={250}>
					<BarChart width={500} height={250} margin={{ top: 5, right: 20, left: 5, bottom: 5 }} data={data} 
						onMouseLeave={() => {defaultHover(); setMouseLeave(true);}} onMouseMove={handleMouseMove}>
						<Bar dataKey="value" fill="#7256ce">
							{getCells()}
						</Bar>
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
						<Tooltip content={() => null} cursor={false} />
					</BarChart>
				</ResponsiveContainer>
			</Div>
		</>
	)
}

export default MyBarChart;
