declare const vscode: {
  postMessage: (param: {type: string} | {type: string, value: any}) => void;
};

declare const initialAccessToken: string;
declare const isSideBar: boolean;
declare const initCourseId: string;
declare const courseName: string;
declare const courseUserRole: "Student" | "Teacher" | "CourseAdmin" | "";