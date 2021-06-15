import React, { useState } from 'react';
import { Cell, Column } from "react-table";
import { UserCourseRole } from '../../models/User';
import { EditableCell } from './EditableCell';

export const userColumns: Array<Column<UserCourseRole>> =
    [
        // We do not need to show the id column!
        // {
        //     // eslint-disable-next-line @typescript-eslint/naming-convention
        //     Header: 'User ID',
        //     accessor: 'id', // accessor is the "key" in the data
        // },
        {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            Header: 'Name',
            accessor: 'name'
        },
        {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            Header: 'Role',
            accessor: 'role',
            // eslint-disable-next-line @typescript-eslint/naming-convention
            Cell: EditableCell
        }
    ];