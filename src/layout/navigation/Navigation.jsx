import React, {Component} from 'react';
import './Navigation.css';

export default function Navigation(){
  return (
    <nav className="navigation text-right">
      <ul className="navigation__list">
        <li className="navigation__list-element"><a href="#">home</a></li>
        <li className="navigation__list-element"><a href="#">catalog</a></li>
        <li className="navigation__list-element"><a href="#">about</a></li>
        <li className="navigation__list-element"><a href="#">contribute</a></li>
      </ul>
    </nav>
  );
}