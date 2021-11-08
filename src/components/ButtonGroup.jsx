import React from 'react';
import styled from 'styled-components';


const Div = styled.div`
	margin: 5px;
	button {
		padding: 5px 10px;
		margin: 5px;
		background-color: #2a275a;
		color: white;
		&:hover {
			opacity: .7;
		}
		&:active {
			opacity: 1;
		}
		&.selected {
			background-color: #7256ce;
			font-weight: bold;
		}
	}
`



const ButtonGroup = ({ options, selected, setSelected }) => {
	return (
		<Div>
			{options.map(([key, value]) => {
				return (
					<button  key={key} 
						onClick={() => setSelected(value)}
						className={value===selected ? 'selected' : ''}
					>{key}</button>
				)
			})}
		</Div>
	)
			
}


export default ButtonGroup;
