import React from "react";

// Stateless (functional) React components should be named in PascalCase
// eslint-disable-next-line @typescript-eslint/naming-convention
const CodiconsCircleSlash = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M8 1a7 7 0 11-7 7 7.008 7.008 0 017-7zM2 8c0 1.418.504 2.79 1.423 3.87l8.447-8.447A5.993 5.993 0 002 8zm12 0c0-1.418-.504-2.79-1.423-3.87L4.13 12.577A5.993 5.993 0 0014 8z" />
    </svg>
  );
};

export default CodiconsCircleSlash;