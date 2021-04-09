import React from 'react';
import './App.css';
import { Route } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import CourseList from '../pages/CourseList';
import CreateCourse from '../pages/CreateCourse';

export default class App extends React.Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Navbar />
          <Route exact path="/" component={CourseList} />
          <Route exact path="/createcourse" component={CreateCourse} />
        </BrowserRouter>
      </div>
    );
  }
}