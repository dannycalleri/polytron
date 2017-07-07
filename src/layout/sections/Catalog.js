import React from 'react';

export default function Catalog(props) {
  return (
    <div>
      <p>catalog</p>
      {JSON.stringify(props.list)}
    </div>
  );
}