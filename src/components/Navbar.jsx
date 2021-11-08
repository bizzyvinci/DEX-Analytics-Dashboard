import React from 'react';
import { NavLink as Link, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';


const Bar = styled.div`
	background-color: #fafafa;
	display: block;
	width: 100%;
	box-sizing: border-box;
`;

const Nav = styled.div`
	font-family: Kanit, sans-serif;
	font-weight: bold;
	text-align: center;
	width: max-content;
	padding: 5px;
	margin: 0 1rem;
	display: inline-block;
	@media screen and (max-width: 768px) {
		width: 100%;
		align-items: center;
	}
`;

const TitleLink = styled(Link)`
	color: #2a275a;
	text-decoration: none;
`;

const NavMenu = styled.div`
	display: flex;
  border-radius: 2rem;
  background-color: #eee;
  justify-content: center;
`;

const NavLink = styled(Link)`
	color: #2a275a;
  display: flex;
  text-decoration: none;
  padding: 1rem;
  justify-content: center;
  height: 100%;
  cursor: pointer;
  min-width: 3rem;
  &.active {
  	color: #eee;
  	background-color: #2a275a;
  	border-radius: 2rem;
  };
  &:hover {
    transition: all 0.2s ease-in-out;
    opacity: 0.5;
  };
  
`;


const Navbar = (props) => {
	let activeIndex = 0
	const isPools = useRouteMatch(['/pools', '/pool', '/pair'])
  const isTokens = useRouteMatch(['/tokens', '/token'])
  if (isPools) {
    activeIndex = 1
  }
  if (isTokens) {
    activeIndex = 2
  }
  
	return (
		<>
			<Bar>
				<Nav>
					<TitleLink to='/'>Covalent DEX Template</TitleLink>
				</Nav>

				<Nav>
					<NavMenu>
						<NavLink to='/' isActive={(a,b) => (0===activeIndex)}>Overview</NavLink>
						<NavLink to='/pools' isActive={(a,b) => (1===activeIndex)}>Pools</NavLink>
						<NavLink to='/tokens' isActive={(a,b) => (2===activeIndex)}>Tokens</NavLink>
					</NavMenu>
				</Nav>
			</Bar>
		</>
	)
}


export default Navbar
