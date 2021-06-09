import React from 'react';
import './App.css';
import { Route } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import CourseList from '../pages/CourseList';
import CreateCourse from '../pages/CreateCourse';
import Login from '../pages/Login';
import Profile from '../pages/Profile';
import Course from '../pages/Course';

export default class App extends React.Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Navbar />
          <Route path="/profile/:loading/:role?/:name?" component={Profile} />
          <Route path="/course/:accessToken/:id/:name/:role?" component={Course} />
          <Route exact path="/courselist/:accessToken" component={CourseList} />
          <Route exact path="/createcourse/:accessToken" component={CreateCourse} />
          <Route exact path="/login" component={Login} />
        </BrowserRouter>
      </div>
    );
  }
}