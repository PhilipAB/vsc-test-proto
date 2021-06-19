import React from "react";

// Stateless (functional) React components should be named in PascalCase
// eslint-disable-next-line @typescript-eslint/naming-convention
const CodiconsRefresh = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.681 3H2V2h3.5l.5.5V6H5V4a5 5 0 104.53-.761l.302-.954A6 6 0 114.681 3z"
      />
    </svg>
  );
};

export default CodiconsRefresh;