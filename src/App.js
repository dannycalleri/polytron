import React, { Component } from 'react';
import logo from './logo.svg';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import './App.css';

import Scene from './scene/Scene.js';

class App extends Component {
  constructor() {
    super();
    this.state = {
      mainClasses: []
    };
  }

  componentWillMount() {
    setTimeout(() => {
      this.setState({
        mainClasses: ["unveil"]
      });
    }, 1000);
  }

  render() {
    var classesList = this.state.mainClasses;
    var classes = classesList.join(' ');

    return (
      <div className="App">
        <header className={classes}>
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <h1>polytron<span>museum</span></h1>
                <nav>
                  <ul>
                    <li><a href="#">home</a></li>
                    <li><a href="#">catalog</a></li>
                    <li><a href="#">about</a></li>
                    <li><a href="#">contribute</a></li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </header>

        <div id="main" className={"container " + classes}>
          <div className="row">
            <Scene />
            <div className="caption">
              <h2>shotgun</h2>
              <div className="game">
                Resident Evil 1
              </div>
            </div>
          </div>
        </div>

        <footer>
        </footer>
      </div>
    );
  }
}

export default App;
