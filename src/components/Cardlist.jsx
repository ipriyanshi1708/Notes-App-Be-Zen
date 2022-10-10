import React from 'react'
import Card from "./Card.jsx"


export default function Cardlist({notes,setPinId, setPinTriggered, pinTriggered}) {
    // console.log("current Notes", notes);
  return (
    <div className='card-list'>
      { notes.map(note =>{
                    return(  
                       <Card Note = {note} setPinId={setPinId} setPinTriggered={setPinTriggered} pinTriggered={pinTriggered}/>  
                    )
                
                })}
    </div>
  )
}
