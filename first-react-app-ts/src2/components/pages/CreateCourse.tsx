import * as React from "react";
import './CreateCourse.css';

// Stateless (functional) React components should be named in PascalCase
// eslint-disable-next-line @typescript-eslint/naming-convention
const CreateCourse = () => {
    return (
        <div className="create-container">
            <form>
                <h2 className="create-header">Create Course</h2>
                <div className="course-input">
                    <label className="label">Course name</label>
                    <input className="input" name="courseName" placeholder="Course name" required />
                </div>
                <div className="course-input">
                    <label className="label">Course description</label>
                    <input className="input" name="courseDescription" placeholder="Course description" />
                </div>
                <div className="course-input">
                    <label className="label">Password</label>
                    <input className="input" type="password" name="password" required />
                </div>
                <div className="course-input">
                    <label className="label">Confirm password</label>
                    <input className="input" type="password" name="passwordConfirmed" required />
                </div>
                <button>Create Course</button>
            </form>
        </div>
    );
};
export default CreateCourse;