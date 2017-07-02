import React from 'react';
import './Navigation.css';

export default function Navigation(props){
  return (
    <nav className={`navigation${props.modifier ? '--'+props.modifier : ''}`}>
      <ul className="navigation__list">
        <li className="navigation__list-element">
          <a href="#" onClick={() => props.onNavigationClick('catalog')}>
            <span className="navigation__list-element-before"></span>
            <span className="navigation__list-element-text">catalog</span>
          </a>
        </li>
        <li className="navigation__list-element">
          <a href="#" onClick={() => props.onNavigationClick('about')}>
            <span className="navigation__list-element-before"></span>
            <span className="navigation__list-element-text">about</span>
          </a>
        </li>
        <li className="navigation__list-element">
          <a href="#" onClick={() => props.onNavigationClick('contribute')}> 
            <span className="navigation__list-element-before"></span>
            <span className="navigation__list-element-text">contribute</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}