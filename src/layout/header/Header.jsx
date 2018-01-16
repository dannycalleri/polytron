import React from 'react';
import Navigation from '../navigation/Navigation';
import Overlay from '../overlay/Overlay';
import logo from '../../logo.svg';
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
                  {/*<img src={logo} alt="Polytron Museum Logo"/>*/}
                  <svg width="25px" height="25px" viewBox="0 0 36 37">
                    <title>Untitled@2x</title>
                    <desc>Created with Sketch.</desc>
                    <defs></defs>
                    <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> 
                      <polygon id="Polygon" stroke="#FFFFFF" strokeWidth="5" fill="#FFFFFF" points="18 4 32.2658477 14.3647451 26.8167788 31.1352549 9.18322122 31.1352549 3.73415226 14.3647451"></polygon>
                    </g>
                  </svg>
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