import React from 'react';
import './Section.css';

export default function Section(props){
  return (
    <section className={`section section--${props.modifier}`}>
      <h1>{props.title}</h1>
      {props.children}
    </section>
  );
}