import React from "react";

// Stateless (functional) React components should be named in PascalCase
// eslint-disable-next-line @typescript-eslint/naming-convention
const CodiconsFilter = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="M6 12v-1h4v1H6zM4 7h8v1H4V7zm10-4v1H2V3h12z" />
        </svg>
    );
};

export default CodiconsFilter;