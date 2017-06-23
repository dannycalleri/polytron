import React from 'react';
import './Info.css'; 

export default function Info(props){
  const classes = [];
  classes.push('info');
  if(props.alignLeft){
    classes.push('info--left');
  }

  if(props.alignRight){
    classes.push('info--right');
  }

  const stringClasses = classes.join(' ');

  return (
    <div className={stringClasses}>
      {
        props.data.map((e,i) => {
          let string = e.name;
          if(e.value){
            string = `${e.name}: ${e.value}`;
          }

          return (
            <div key={i}>
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