import React, { Component } from 'react';

//css
import '../css/Control.css';

const Control = (props)=> {
  return(
    <div id='Control'>
      <button
        id='button-addNode'
        onMouseDown={props.addNode}
      >Add
      </button>
      <button
        id='button-deleteNode'
        onMouseDown={props.deleteNode}
      >Delete</button>
    </div>
  );
}

export default Control;
