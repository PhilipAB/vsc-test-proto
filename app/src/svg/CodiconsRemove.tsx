import React from "react";

// Stateless (functional) React components should be named in PascalCase
// eslint-disable-next-line @typescript-eslint/naming-convention
const CodiconsRemove = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="M15 8H1V7h14v1z" />
        </svg>
    );
};

export default CodiconsRemove;