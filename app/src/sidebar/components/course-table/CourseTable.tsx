import React, { useMemo, useState } from 'react';
import { TableInstance, useTable, useSortBy, useFilters, useRowSelect, Row, ColumnInstance, usePagination } from 'react-table';
import { apiBaseUrl } from '../../../constants';
import CodiconsTriangleDown from '../../../svg/CodiconsTriangleDown';
import CodiconsTriangleUp from '../../../svg/CodiconsTriangleUp';
import CheckBox from '../../../react-table-components/CheckBox';
import ColumnFilter from '../../../react-table-components/ColumnFilter';
import { courseColumns } from './courseColumns';
import './CourseTable.css';
import { SimpleCourse } from '../../../models/Course';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const CourseTable = (props: { courseArray: SimpleCourse[], assignmentId: number, accessToken: string }) => {
    const cColumns = useMemo(() => courseColumns, []);
    const [cData, setData] = useState(useMemo(() => props.courseArray, props.courseArray));
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const defaultColumnFilter = useMemo(() => ({ Filter: ColumnFilter }), []);

    const courseTable: TableInstance<SimpleCourse> = useTable({
        columns: cColumns,
        data: cData,
        defaultColumn: defaultColumnFilter,
        initialState: { pageIndex: 0, pageSize: 2 }
    },
        useFilters,
        useSortBy,
        usePagination,
        useRowSelect,
        hooks => {
            hooks.visibleColumns.push((columns: ColumnInstance<SimpleCourse>[]) => [
                // Let's make a column for selection
                {
                    id: "selection",
                    // The header can use the table's getToggleAllRowsSelectedProps method
                    // to render a checkbox
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    Header: ({ getToggleAllPageRowsSelectedProps }) => (
                        <div>
                            <CheckBox {...getToggleAllPageRowsSelectedProps()} />
                        </div>
                    ),
                    // The cell can use the individual row's getToggleRowSelectedProps method
                    // to the render a checkbox
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    Cell: ({ row }: { row: Row<SimpleCourse> }) => (
                        <div>
                            <CheckBox {...row.getToggleRowSelectedProps()} />
                        </div>
                    )
                },
                ...columns
            ]);
        });

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        selectedFlatRows,
        page, // Instead of using 'rows', we'll use page, which has only the rows for the active page
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        state: { pageIndex, pageSize }
    } = courseTable;

    const stopPropagationFromFilter = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
    };

    const removeAssignmentFromCourse = () => {
        selectedFlatRows.forEach(async (row: Row<SimpleCourse>) => {
            await fetch(`${apiBaseUrl}/courses/course/${row.original.id}/assignment/${props.assignmentId}`, {
                method: 'DELETE',
                // Auth header not required yet to fetch courses from api. 
                // Still included to prevent errors in case of future api updates.    
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'Authorization': `Bearer ${props.accessToken}`,
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'Accept': 'application/json',
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                if (response.status === 200) {
                    // Remove row from table
                    const tempData = [...cData];
                    tempData.splice(row.index, 1);
                    setData(tempData);
                }
            });
        });
    };

    if (cData.length !== 0) {
        return (
            // apply the table props
            <div className="course-table-container">
                <div>
                    <table className="course-table" {...getTableProps()}>
                        <thead>
                            {// Loop over the header rows
                                headerGroups.map(headerGroup => (
                                    // Apply the header row props
                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                        {// Loop over the headers in each row
                                            headerGroup.headers.map(column => (
                                                // Apply the header cell props
                                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                                    {// Render the header
                                                        column.render('Header')}
                                                    <span>
                                                        {column.isSorted ? (column.isSortedDesc ? (
                                                            <CodiconsTriangleDown className="sort-down"></CodiconsTriangleDown>
                                                        ) : (
                                                            <CodiconsTriangleUp className="sort-up"></CodiconsTriangleUp>
                                                        )) : ''}
                                                    </span>
                                                    <div onClick={stopPropagationFromFilter}>{column.canFilter ? column.render('Filter') : null}</div>
                                                </th>
                                            ))}
                                    </tr>
                                ))}
                        </thead>
                        {/* Apply the table body props */}
                        <tbody {...getTableBodyProps()}>
                            {// Loop over the table rows
                                page.map(row => {
                                    // Prepare the row for display
                                    prepareRow(row);
                                    return (
                                        // Apply the row props
                                        <tr {...row.getRowProps()}>
                                            {// Loop over the rows cells
                                                row.cells.map(cell => {
                                                    // Apply the cell props
                                                    return (
                                                        <td {...cell.getCellProps()}>
                                                            {// Render the cell contents
                                                                cell.render('Cell')}
                                                        </td>
                                                    );
                                                })}
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>
                <div className="table-page-numbers">
                    Page{" "}<strong>{pageIndex + 1}</strong> of <strong>{pageOptions.length}</strong>
                </div>
                <div className="pagination">
                    <button className="pagination-button" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                        {"<<"}
                    </button>{" "}
                    <button className="pagination-button" onClick={() => previousPage()} disabled={!canPreviousPage}>
                        {"<"}
                    </button>{" "}
                    <button className="pagination-button" onClick={() => nextPage()} disabled={!canNextPage}>
                        {">"}
                    </button>{" "}
                    <button className="pagination-button" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                        {">>"}
                    </button>{" "}
                </div>
                <button className="button-update-related-courses" onClick={removeAssignmentFromCourse}>Remove selected assignments from course</button>
            </div>
        );
    } else {
        return (
            <div className="empty-course-array">No courses to display!</div>
        );
    }
};