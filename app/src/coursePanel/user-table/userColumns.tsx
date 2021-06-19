import { Column } from "react-table";
import { UserCourseRole } from '../../models/User';
import { EditableCell } from './EditableCell';

export const userColumns: Array<Column<UserCourseRole>> =
    [
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