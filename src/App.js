import React, { Component } from 'react';
import Header from './layout/header/Header';
import Info from './layout/info/Info';

import '../node_modules/bootstrap/dist/css/bootstrap.css';
import './App.css';

import PolytronScene from './scene/Scene.js';

class App extends Component {
  constructor() {
    super();

    const arr = ['models/I01V.tmd', 'models/I00V.tmd'];

    this.state = {
      modelPath: 'models/I02V.tmd'
    };
  }

  render() {
    return (
      <div className="App">
        <Header />

        <div id="main">
          <Info 
            alignLeft
            data={[
              {name:'Resident Evil'},
              {name:'Shotgun'},
            ]} 
          />
          <Info 
            alignRight
            data={[
              {name:'Vertices', value: 1337},
              {name:'Faces', value: 1337},
            ]} 
          />
          <PolytronScene
            model={this.state.modelPath}
          />
        </div>
      </div>
    );
  }
}

export default App;
