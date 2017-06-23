import React, {Component} from 'react';
import './Navigation.css';

export default function Navigation(){
  return (
    <nav className="navigation">
      <ul className="navigation__list">
        <li className="navigation__list-element">
          <a href="#">
            <span className="navigation__list-element-before"></span>
            <span className="navigation__list-element-text">home</span>
          </a>
        </li>
        <li className="navigation__list-element">
          <a href="#">
            <span className="navigation__list-element-before"></span>
            <span className="navigation__list-element-text">catalog</span>
          </a>
        </li>
        <li className="navigation__list-element">
          <a href="#">
            <span className="navigation__list-element-before"></span>
            <span className="navigation__list-element-text">about</span>
          </a>
        </li>
        <li className="navigation__list-element">
          <a href="#">
            <span className="navigation__list-element-before"></span>
            <span className="navigation__list-element-text">contribute</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}