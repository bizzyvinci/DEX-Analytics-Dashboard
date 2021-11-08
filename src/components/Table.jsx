import React from 'react';
import styled from 'styled-components';
import { useTable, useSortBy, usePagination } from 'react-table';


const Div = styled.div`
	padding: 1rem;

	a {
		text-decoration: none;
		color: black;
		padding: 5px;
	}

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

`;


const MyTable = ({ columns, data, length }) => {
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		//rows, no longer used because of page
		prepareRow,
		page,

		// Useful for pagination
		canPreviousPage,
		canNextPage,
		pageOptions,
		pageCount,
		gotoPage,
		nextPage,
		previousPage,
		setPageSize,
		state: {pageIndex, pageSize},
	} = useTable({ columns, data, initialState: {pageSize: length||10} }, 
		useSortBy, usePagination
	)

	return (
		<>
			<Div>
				<table {...getTableProps()}>
					<thead>
						{headerGroups.map(headerGroup => (
							<tr {...headerGroup.getHeaderGroupProps()}>
								{headerGroup.headers.map(column => (
									<th {...column.getHeaderProps(column.getSortByToggleProps())}>
										{column.render('Header')}
										<span>
											{/*Change to desc first and make volume desc default*/}
											{column.isSorted ? column.isSortedDesc ? ' 🔽' : ' 🔼' : ''}
										</span>
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody {...getTableBodyProps()}>
						{page.map((row, i) => {
							prepareRow(row)
							return (
								<tr {...row.getRowProps()}>
									{row.cells.map(cell => {
										return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
									})}
								</tr>
							)
						})}
					</tbody>
				</table>
				<div className="pagination">
					<button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
						{'<<'}
					</button>{' '}
					<button onClick={() => previousPage()} disabled={!canPreviousPage}>
						{'<'}
					</button>{' '}
					<button onClick={() => nextPage()} disabled={!canNextPage}>
						{'>'}
					</button>{' '}
					<button onClick={() => gotoPage(pageCount-1)} disabled={!canNextPage}>
						{'>>'}
					</button>{' '}
					<span>
						Page{' '}
						<strong>
							{pageIndex+1} of {pageOptions.length}
						</strong>{' '}
					</span>
					<span>
						| Go to page:{' '}
						<input 
							type="number"
							defaultValue={pageIndex+1}
							onChange={e => {
								const page = e.target.value ? Number(e.target.value) - 1 : 0
								gotoPage(page)
							}}
							style={{width: '100px'}}
						/>{' '}
					</span>
				</div>
			</Div>
		</>
	)
}


export default MyTable