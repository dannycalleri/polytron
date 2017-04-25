import React, {Component} from 'react';
import './Info.css'; 

export default function Info(props){
  return (
    <div className="info">
      {
        props.data.map((e) => {
          let string = e.name;
          if(e.value){
            string = `${e.name}: ${e.value}`;
          }

          return (
            <div>
              <span className="info__element" data-animation={string}>
                {string}
              </span>
            </div>
          );
        })
      }
    </div>
  );
}