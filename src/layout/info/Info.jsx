import React, {Component} from 'react';
import './Info.css'; 

export default function Info(props){
  return (
    <div className="info">
      {
        props.data.map((e) => {
          return (
            <div>
              <span className="info__element">
                {e.name} 
                { e.value ? `:${e.value}` : null }
              </span>
            </div>
          );
        })
      }
    </div>
  );
}