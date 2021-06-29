import React, { useEffect, forwardRef } from 'react';

interface CheckBoxProps {
    indeterminate?: boolean
}

const useCombinedRefs = (...refs: React.ForwardedRef<HTMLInputElement | null>[]): React.MutableRefObject<HTMLInputElement | null> | undefined => {
    const targetRef = React.useRef<HTMLInputElement | null>(null);

    React.useEffect(() => {
        refs.forEach(ref => {
            if (!ref) {
                return;
            }
            if (typeof ref === 'function') {
                ref(targetRef.current);
            } else {
                ref.current = targetRef.current;
            }
        });
    }, [refs]);

    return targetRef;
};

// eslint-disable-next-line @typescript-eslint/naming-convention
const CheckBox = forwardRef<HTMLInputElement, CheckBoxProps>(
    ({ indeterminate, ...rest }, ref: React.ForwardedRef<HTMLInputElement | null>) => {
        const defaultRef = React.useRef<HTMLInputElement | null>(null);
        const combinedRef = useCombinedRefs(ref, defaultRef);

        useEffect(() => {
            if (combinedRef?.current) {
                combinedRef.current.indeterminate = indeterminate ?? false;
            }
        }, [combinedRef, indeterminate]);

        return (
            <input type="checkbox" ref={combinedRef} {...rest} />
        );
    }
);

export default CheckBox;