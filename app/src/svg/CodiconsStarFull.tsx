import React from "react";

// Stateless (functional) React components should be named in PascalCase
// eslint-disable-next-line @typescript-eslint/naming-convention
const CodiconsStarFull = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.595 6.252L8 1 6.405 6.252H1l4.373 3.4L3.75 15 8 11.695 12.25 15l-1.623-5.348L15 6.252H9.595z"
      />
    </svg>
  );
};

export default CodiconsStarFull;