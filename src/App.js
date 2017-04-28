import React, { Component } from 'react';
import Header from './layout/header/Header';
import Info from './layout/info/Info';

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
        <Header className={classes} />

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
