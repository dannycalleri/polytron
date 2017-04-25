import React, { Component } from 'react';
import Navigation from './layout/navigation/Navigation';
import Info from './layout/info/Info';

import logo from './logo.png';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import './App.css';

import PolytronScene from './scene/Scene.js';

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
              <div className="col-md-6">
                <h1 className="logo">
                  <span className="logo__pentagon">
                    <img src={logo} alt="Polytron Museum Logo"/>
                  </span>
                  <span className="logo__text">
                    Polytron
                    <span className="logo__text--black">
                      Museum
                    </span>
                  </span>
                </h1>
              </div>
              <div className="col-md-6">
                <Navigation />
              </div>
            </div>
          </div>
        </header>

        <div id="main" className={"container " + classes}>
          <div className="row">
            <Info data={[
              {name:'Resident Evil'},
              {name:'Shotgun'},
              {name:'Vertices', value: 1337},
              {name:'Faces', value: 1337}
            ]} />
          </div>
          
          <PolytronScene />
        </div>

        <footer>
        </footer>
      </div>
    );
  }
}

export default App;
