import React, { Component } from "react";
import {modal, modal_content} from "./popup.css";

const PopUp = (props) => {


  const handleClick = () => {
      props.toggle();
  }

  
  return (
  <>
   <div className="modal_popup">
     <div className="modal_content_popup">
     <span className="close" onClick={handleClick}>&times;    </span>
     <p className="text_popup">No modules were found by Domino for these input file... :(</p>
    </div>
   </div>
  </>
  );
 
}

export default PopUp;
