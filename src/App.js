import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Navbar from './components/layout/Navbar';
import home from './pages/home';

class App extends Component {
  render() {
    return (
      <Router>
        <Navbar />
          <div className="container">
            <Switch>
              <Route exact path="/" component={home} />
            </Switch>
        </div>
      </Router>
    );
  }
}

export default App;