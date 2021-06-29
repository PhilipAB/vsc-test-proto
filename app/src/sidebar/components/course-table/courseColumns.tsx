import { Column } from "react-table";
import { SimpleCourse } from "../../../models/Course";

export const courseColumns: Array<Column<SimpleCourse>> =
    [
        {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            Header: 'Name',
            accessor: 'name'
        }
    ];