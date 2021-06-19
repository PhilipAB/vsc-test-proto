import React from 'react';
import { HeaderGroup } from 'react-table';
import { UserCourseRole } from '../../../models/User';

export interface ColumnFilterProps {
    column: HeaderGroup<UserCourseRole>
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const ColumnFilter: React.FunctionComponent<ColumnFilterProps> = ({ column }) => {
    const { filterValue, setFilter } = column;
    const onChangeFilterValue = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilter(event.currentTarget.value);
    };
    return (
        <span>
            <input value={filterValue || ''} onChange={onChangeFilterValue}></input>
        </span>
    );
};
export default ColumnFilter;