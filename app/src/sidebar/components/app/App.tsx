import React from 'react';
import './App.css';
import { Route } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import CourseList from '../pages/CourseList';
import CreateCourse from '../pages/CreateCourse';
import Login from '../pages/Login';
import Profile from '../pages/Profile';
import CreateAssignment from '../pages/CreateAssignment';
import Assignment from '../pages/Assignment';
import Assignments from '../pages/Assignments';

export default class App extends React.Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Navbar />
          <Route path="/profile/:loading/:role?/:name?" component={Profile} />
          <Route exact path="/courselist/:accessToken" component={CourseList} />
          <Route exact path="/createcourse/:accessToken" component={CreateCourse} />
          <Route exact path="/assignments/:accessToken" component={Assignments} />
          <Route exact path="/createassignment/:accessToken" component={CreateAssignment} />
          <Route path="/assignment/:accessToken/:id/:name/:repository/:description" component={Assignment} />
          <Route exact path="/login" component={Login} />
        </BrowserRouter>
      </div>
    );
  }
}