import React from 'react';
import Navigation from '../navigation/Navigation';
import logo from '../../logo.png';
import './Header.css';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showMenu: false};
  }

  render(){
    return (
      <header className={this.props.classes}>
        <div className={`overlay overlay-scale ${this.state.showMenu ? 'open' : ''}`}>
          <button type="button" className="overlay-close" onClick={() => this.setState({showMenu: false})}>Close</button>
          <Navigation modifier="mobile" onNavigationClick={this.props.onNavigationClick} />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-6">
              <span className="burger-menu" onClick={() => this.setState({showMenu: true})}>
                <i className="fa fa-bars" aria-hidden="true"></i>
              </span>
              <a href=".">
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
              </a>
            </div>
            <div className="col-xs-12 col-md-6">
              <Navigation onNavigationClick={this.props.onNavigationClick} />
            </div>
          </div>
        </div>
      </header>
    );
  }
}