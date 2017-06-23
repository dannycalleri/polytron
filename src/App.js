import React, { Component } from 'react';
import Header from './layout/header/Header';
import Info from './layout/info/Info';

import '../node_modules/bootstrap/dist/css/bootstrap.css';
import './App.css';

import PolytronScene from './scene/Scene.js';

class App extends Component {
  constructor() {
    super();

    const models = [{
        game: 'Resident Evil',
        name: 'Shotgun',
        path: 'models/I02V.tmd',
      },
      {
        game: 'Resident Evil',
        name: 'Flame thrower',
        path: 'models/I01V.tmd', 
      },
      {
        game: 'Resident Evil',
        name: 'Gun',
        path: 'models/I00V.tmd',
      },
    ];

    this.state = {
      model: models[0],
      vertices: '-',
      faces: '-',
    };

    this.handleLoadModel = this.handleLoadModel.bind(this);

    // test model change
    // setInterval(()=>{
    //   const model = models[Math.floor(Math.random()*models.length)];
    //   this.setState({model});
    // },3000)
  }

  handleLoadModel(vertices, faces){
    this.setState({
      vertices,
      faces
    });
  }

  render() {
    return (
      <div className="App">
        <Header />

        <div id="main">
          <Info 
            alignLeft
            data={[
              {name: this.state.model.game},
              {name: this.state.model.name},
            ]} 
          />
          <Info 
            alignRight
            data={[
              {name:'Vertices', value: this.state.vertices},
              {name:'Faces', value: this.state.faces},
            ]} 
          />
          <PolytronScene
            model={this.state.model.path}
            onLoadModel={this.handleLoadModel}
          />
        </div>
      </div>
    );
  }
}

export default App;
