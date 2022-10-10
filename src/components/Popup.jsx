import React from 'react';
import cross from "../images/cross.png"
import "./Style.css"

function Popup(props) {
  return props.trigger?(
    <div className='popUp'>
      <div className="popUpInner">
        <button className='closeBtn' onClick={()=>{props.setTrigger(false)}}><img src={cross} alt="close" className='cross'/></button>
        {props.children}
      </div>
    </div>
  ):""
}

export default Popup
