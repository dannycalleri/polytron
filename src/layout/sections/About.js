import React from 'react';

export default function About() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-xs-10 col-xs-push-1 col-md-6 col-md-push-3">
          <p>
            Polytron Museum is a project by&nbsp;
            <a className="polytron-link" href="http://dannycalleri.com">Danny Calleri</a> inspired by Phoboslab's <a className="polytron-link" href="http://phoboslab.org/log/2015/04/reverse-engineering-wipeout-psx">Reverse Engineering Wipeout for PSX</a>.<br/>
            Actually, it was just an attempt to render <strong>Resident Evil</strong> 3D models using <strong>JavaScript</strong> and <strong>client-side web technologies</strong>, 
            but since I'm pretty ambitious, I decided to go for a cooler name :) <br/>
          </p>
        </div>
      </div>
    </div>
  );
}