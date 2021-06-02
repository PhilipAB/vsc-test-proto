import * as React from "react";
import OpenInNew from "../svg/OpenInNew";
import './CourseCard.css';

// Stateless (functional) React components should be named in PascalCase
// eslint-disable-next-line @typescript-eslint/naming-convention
const CourseCard = (props: { name: string }) => {
    return (
        <div className="card">
            {props.name} <OpenInNew className="open-in-new"/>
        </div>
    );
};

export default CourseCard;


