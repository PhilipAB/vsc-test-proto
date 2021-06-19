import React, { useState, useEffect } from 'react';

// Create an editable cell renderer
// eslint-disable-next-line @typescript-eslint/naming-convention
export const EditableCell = ({
    value: initialValue,
    row: { index },
    column: { id },
    updateMyData // This is a custom function that we supplied to our table instance
}: { value: string, row: { index: number }, column: { id: number }, updateMyData: (rowIndex: number, columnId: number, value: string) => any }) => {
    // We need to keep and update the state of the cell normally
    const [value, setValue] = useState(initialValue);

    const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setValue(e.currentTarget.value);
    };

    // We'll only update the external data when the input is blurred
    const onBlur = () => {
        updateMyData(index, id, value);
    };

    // If the initialValue is changed external, sync it up with our state
    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    return (
        <select onChange={onChange} onBlur={onBlur} value={value}>
            <option value={initialValue}>{initialValue}</option>
            {initialValue === "Student" ? (
                <>
                    <option value="Teacher">Teacher</option>
                    <option value="CourseAdmin">CourseAdmin</option>
                </>
            ) : initialValue === "Teacher" ? (
                <>
                    <option value="Student">Student</option>
                    <option value="CourseAdmin">CourseAdmin</option>
                </>
            ) : (
                <>
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher</option>
                </>
            )}
        </select>
    );
};