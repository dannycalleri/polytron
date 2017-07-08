import React from 'react';

export default function Catalog({ list, onClick }) {
  return (
    <div className="container">
      <div className="row">
        <ul className="col-xs-10 col-xs-push-1 col-md-6 col-md-push-3">
          {
            list.map(g => (
              <li key={g.game+g.name} onClick={() => onClick(g.id)}>
                <i className="fa fa-gamepad" aria-hidden="true"></i>
                <span>{g.game} - {g.name}</span>
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  );
}