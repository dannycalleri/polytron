import React from 'react';
import Navigation from '../navigation/Navigation';
import logo from '../../logo.png';
import './Header.css';

export default function Header(props){
  return (
    <header className={props.classes}>
      <div className="container">
        <div className="row">
          <div className="col-md-6">
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
          <div className="col-md-6">
            <Navigation />
          </div>
        </div>
      </div>
    </header>
  );
}