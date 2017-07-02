import React from 'react';
import Navigation from '../navigation/Navigation';
import Overlay from '../overlay/Overlay';
import logo from '../../logo.png';
import './Header.css';

export default function Header(props) {
  return (
    <header className={props.classes}>
      <Overlay show={props.showOverlayMenu}>
        <Navigation modifier="mobile" onNavigationClick={props.onNavigationClick} />
      </Overlay>
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-6">
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
            <Navigation onNavigationClick={props.onNavigationClick} />
          </div>
        </div>
      </div>
    </header>
  );
}