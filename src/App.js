import React, { Component } from 'react';
import Header from './layout/header/Header';
import Info from './layout/info/Info';
import Overlay from './layout/overlay/Overlay';
import Section from './layout/section/Section';
import Catalog from './layout/sections/Catalog';
import Contribute from './layout/sections/Contribute';
import About from './layout/sections/About';

import '../node_modules/font-awesome/css/font-awesome.css';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import './App.css';

import PolytronScene from './scene/Scene.js';

class App extends Component {
  constructor() {
    super();

    const models = [{
        id: 1,
        game: 'Resident Evil',
        name: 'Shotgun',
        path: 'models/I02V.tmd',
      },
      {
        id: 2,
        game: 'Resident Evil',
        name: 'Flame thrower',
        path: 'models/I01V.tmd', 
      },
      {
        id: 3,
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

    this.models = models;
    this.handleLoadModel = this.handleLoadModel.bind(this);
    this.navigationClickHandler = this.navigationClickHandler.bind(this);
    this.renderSection = this.renderSection.bind(this);
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

    let section = null;

    switch(this.state.section){
      case 'catalog': {
        const props = {
          list: this.models,
          onClick: (id) => {
            const model = this.models.find(m => m.id === id);
            this.setState({
              model,
              section: 'home'
            });
          }
        };
        section = this.createSection(
          Catalog,
          this.state.section,
          props,
        );
        break;
      }
      case 'contribute': {
        const props = {};
        section = this.createSection(
          Contribute,
          this.state.section,
          props,
        );
        break;
      }
      case 'about': {
        const props = {};
        section = this.createSection(
          About,
          this.state.section,
          props,
        );
        break;
      }
    }

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
