import React from "react";

// Stateless (functional) React components should be named in PascalCase
// eslint-disable-next-line @typescript-eslint/naming-convention
const CodiconsThreeBars = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14 5H2V3h12v2zm0 4H2V7h12v2zM2 13h12v-2H2v2z"
      />
    </svg>
  );
};

export default CodiconsThreeBars;