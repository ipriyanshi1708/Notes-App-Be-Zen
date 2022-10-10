import React, {useContext} from 'react';
import { EditTriggeredContext } from '../contexts/EditTriggered.context';
import './Style.css'

import {
  EditOutlined,
  PushpinOutlined,
  PushpinFilled
} from '@ant-design/icons';

const Card = ({Note,setPinId, setPinTriggered, pinTriggered}) => {
  const {title, tagline, note, id, pin} = Note;
  const {setEditTriggered, setNoteContent, editTriggered} = useContext(EditTriggeredContext);

  const handleClick=(e)=>{
    e.preventDefault();
    // console.log("Edit clicked");
    setEditTriggered(!editTriggered);
    setNoteContent(Note);
    
  }
  const handlePinClick=(e)=>{
    e.preventDefault();
    console.log("Pin clicked")
    setPinId(id);
    setPinTriggered(!pinTriggered);
    console.log("pinTriggered", true);
  }
  return (
    <div className='card-container' key={id}>
      <div className="card" key={id}>
            <h2>{title}</h2>
            <span id ="tagline">{tagline}</span>
            <p>{note}</p>
            <div className="icons">
              <EditOutlined onClick={handleClick}/>
              {pin?<PushpinFilled onClick={handlePinClick} />:<PushpinOutlined onClick={handlePinClick} />}
              {/* <PushpinOutlined onClick={handlePinClick} /> */}
            </div>
      </div>
        </div>
  )
}

export default Card
