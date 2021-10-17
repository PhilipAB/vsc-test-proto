import React, { useMemo } from 'react';
import { TableInstance, useTable, useSortBy, useFilters, useRowSelect, Row, ColumnInstance, useRowState } from 'react-table';
import jwt from "jsonwebtoken";
import { apiBaseUrl } from '../../constants';
import { UserCourseRole } from '../../models/User';
import CodiconsTriangleDown from '../../svg/CodiconsTriangleDown';
import CodiconsTriangleUp from '../../svg/CodiconsTriangleUp';
import CheckBox from '../../react-table-components/CheckBox';
import ColumnFilter from '../../react-table-components/ColumnFilter';
import { userColumns } from './userColumns';
import './UserTable.css';
import { isJwtPayloadWithExp } from '../../predicates/isJwtPayloadWithExp';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const UserTable = (props: { userArray: UserCourseRole[], courseId: number, accessToken: string }) => {
    const uColumns = useMemo(() => userColumns, []);
    const uData = useMemo(() => props.userArray, props.userArray);
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const defaultColumnFilter = useMemo(() => ({ Filter: ColumnFilter }), []);

    const [data, setData] = React.useState(uData);
    const [originalData, setOriginalData] = React.useState(data);
    const [skipPageReset, setSkipPageReset] = React.useState(false);

    // We need to keep the table from resetting the pageIndex when we
    // Update data. So we can keep track of that flag with a ref.

    // When our cell renderer calls updateMyData, we'll use
    // the rowIndex, columnId and new value to update the
    // original data
    const updateMyData = (rowIndex: number, columnId: number, value: string) => {
        // We also turn on the flag to not reset the page
        setSkipPageReset(true);
        setData((old) =>
            old.map((row, index) => {
                if (index === rowIndex) {
                    return {
                        ...old[rowIndex],
                        [columnId]: value
                    };
                }
                return row;
            })
        );
    };

    // Let's add a data resetter/randomizer to help
    // illustrate that flow...
    const resetRoleChanges = () => setData(originalData);

    // Be sure to pass our updateMyData and the skipPageReset option
    // eslint-disable-next-line @typescript-eslint/naming-convention
    function Table({ columns, data, updateMyData, skipPageReset }: any) {

        const userTable: TableInstance<UserCourseRole> = useTable({
            columns: columns,
            data: data,
            defaultColumn: defaultColumnFilter,
            // useControlledState: state => {
            //     return React.useMemo(
            //         () => ({
            //             ...state,
            //             selectedRowIds: controlledRowIds,
            //         }),
            //         [state, controlledRowIds]
            //     );
            // },
            // use the skipPageReset option to disable page resetting temporarily
            autoResetPage: !skipPageReset,
            // updateMyData isn't part of the API, but
            // anything we put into these options will
            // automatically be available on the instance.
            // That way we can call this function from our
            // cell renderer!
            updateMyData
        },
            useFilters,
            useSortBy,
            useRowSelect,
            hooks => {
                const payload = jwt.decode(props.accessToken, { json: true });
                hooks.visibleColumns.push((columns: ColumnInstance<UserCourseRole>[]) => [
                    // Let's make a column for selection
                    {
                        id: 'selection',
                        // The header can use the table's getToggleAllRowsSelectedProps to render a checkbox.
                        // However this results in also selecting disabled checkboxes.
                        // Therefore I implemented a workaround and posted the solution on:
                        // https://github.com/tannerlinsley/react-table/issues/2988#issuecomment-861506888
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        Header: ({ toggleRowSelected, rows, selectedFlatRows }) => {
                            const style = {
                                cursor: 'pointer',
                            };
                            const checked: boolean = rows.length > 1 && rows.length - selectedFlatRows.length === 1; // In my case: If all but one rows are selected -> all selectable rows are selected and header checkbox should be checked
                            const title: string = 'Toggle All Rows Selected'; 
                            const indeterminate: boolean = !checked && selectedFlatRows.length > 0; // If my header checkbox is not checked (therefore not all rows are selected) but some rows are selected -> header checkbox is indeterminate
                            const disabled: boolean = rows.length === 1; // In my case: If only one row exists, it is a row with a disabled checkbox. Hence, we can disable the header checkbox because it can and should not modify the row's selection.
                            const overiddenOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                                rows.forEach(row => {
                                    // The condition whether a row is selectable or not
                                    if (isJwtPayloadWithExp(payload) && row.original.id !== payload.userId) {
                                        toggleRowSelected(row.id, event.currentTarget.checked);
                                    }
                                });
                            };
                            const modifiedToggleAllRowsProps = {
                                onChange: overiddenOnChange,
                                style: style,
                                checked: checked,
                                title: title,
                                indeterminate: indeterminate,
                                disabled: disabled
                            };
                            return (
                                <div>
                                    <CheckBox {...modifiedToggleAllRowsProps} />
                                </div>
                            );
                        },
                        // The cell can use the individual row's getToggleRowSelectedProps method
                        // to the render a checkbox
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        Cell: ({ row }: { row: Row<UserCourseRole> }) => {
                            let disableCheckbox = false;
                            let disabledProps: { disabled: boolean };
                            if (isJwtPayloadWithExp(payload) && row.original.id === payload.userId) {
                                disableCheckbox = row.original.id === payload.userId; // disableCheckbox is true 
                            }
                            disabledProps = { disabled: disableCheckbox };
                            return (
                                <div>
                                    <CheckBox {...{ ...row.getToggleRowSelectedProps(), ...disabledProps }} />
                                </div>
                            );
                        },
                    },
                    ...columns,
                ]);
            });

        const {
            getTableProps,
            getTableBodyProps,
            headerGroups,
            rows,
            prepareRow,
            selectedFlatRows,
            state
        } = userTable;

        const stopPropagationFromFilter = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            event.stopPropagation();
        };

        const onClickUpdateRoleForSelectedRows = () => {
            selectedFlatRows.forEach(async (row: Row<UserCourseRole>) => {
                await fetch(`${apiBaseUrl}/courses/role/${props.courseId}/${row.original.id}`, {
                    method: 'PUT',
                    // Auth header not required yet to fetch courses from api. 
                    // Still included to prevent errors in case of future api updates.    
                    headers: {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        'Authorization': `Bearer ${props.accessToken}`,
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        'Accept': 'application/json',
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ role: row.original.role })
                }).then(response => {
                    if (response.status === 200) {
                        vscode.postMessage({ type: 'onInfo', value: `Updated role property from user ${row.original.name} to ${row.original.role}!` });
                        setOriginalData(data);
                    } else {
                        vscode.postMessage({ type: 'onInfo', value: `Failed to update role property from user ${row.original.name}!` });
                    }
                }).catch(_reason => {
                    vscode.postMessage({ type: 'onError', value: `Failed to reach backend!` });       
                });
            });
        };

        // After data changes, we turn the flag back off
        // so that if data actually changes when we're not
        // editing it, the page is reset
        React.useEffect(() => {
            setSkipPageReset(false);
        }, [data]);

        return (
            // apply the table props
            <>
                <div>
                    <table {...getTableProps()}>
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
                                rows.map(row => {
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
                <button className="button-update" onClick={onClickUpdateRoleForSelectedRows}>Update selected roles</button>
                {/* <pre>
                    <code>
                        {JSON.stringify(selectedFlatRows.map((row: Row<UserCourseRole>) => row.original))}
                    </code>
                </pre> */}
            </>
        );
    }

    return (
        <>
            <Table
                columns={uColumns}
                data={data}
                updateMyData={updateMyData}
                skipPageReset={skipPageReset}
            />
            <button className="button-reset" onClick={resetRoleChanges}>Reset role changes</button>
        </>
    );

};