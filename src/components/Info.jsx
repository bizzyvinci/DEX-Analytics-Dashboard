import React from 'react';
import styled from 'styled-components';


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
	font-size: ${p => (p.hugeFont ? '150%' : '100%')};
	color: #2a275a;
	margin: 3px;
`;


const Info = ({ title, data, width, height, hugeFont }) => {
	if (!data) {
		return <Div></Div>
	}

	return (
		<>
			<Div width={width} height={height}>
				{title && <div><TitleP>{title}</TitleP></div>}
				{Object.entries(data).map(([key, value]) => {
					return <div key={key}><br /><ValueP hugeFont={hugeFont}>{key + ': ' + value}</ValueP></div>
				})}
			</Div>
		</>
	)
}

export default Info;
