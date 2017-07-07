import React, { Component } from 'react';
import Header from './layout/header/Header';
import Info from './layout/info/Info';
import Overlay from './layout/overlay/Overlay';
import Section from './layout/section/Section';
import Catalog from './layout/sections/Catalog';

import '../node_modules/font-awesome/css/font-awesome.css';
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
      section: 'home',
      showOverlayMenu: false,
      model: models[0],
      vertices: '-',
      faces: '-',
    };

    this.handleLoadModel = this.handleLoadModel.bind(this);
    this.navigationClickHandler = this.navigationClickHandler.bind(this);
    this.renderSection = this.renderSection.bind(this);

    // test model change
    // setInterval(()=>{
    //   const model = models[Math.floor(Math.random()*models.length)];
    //   this.setState({model});
    // },3000)
  }

  navigationClickHandler(section){
    this.setState({section, showOverlayMenu: false});
  }

  createSection(Component, title, props){
    return (
      <Section
        modifier={title.toLowerCase()}
        title={title}
      >
        <Component {...props} />
      </Section>
    );
  }

  renderSection(){
    if(this.state.section === 'home'){
      return null;
    }

    const props = {
      list: [{title:'efojief'}, {title:'daneiel'}]
    };
    const section = this.createSection(
      Catalog,
      this.state.section,
      props,
    );

    return (
      <Overlay show={true}>
        {section}
      </Overlay>
    );
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
        <span className="burger-menu" onClick={() => this.setState({showOverlayMenu: true, section: 'home'})}>
          <i className="fa fa-bars" aria-hidden="true"></i>
        </span>
        <Header showOverlayMenu={this.state.showOverlayMenu} onNavigationClick={this.navigationClickHandler} />

        { this.renderSection() }

        <div id="main">
          <Info 
            alignTop
            data={[
              {name: this.state.model.game},
              {name: this.state.model.name},
            ]} 
          />
          <Info 
            alignBottom
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
