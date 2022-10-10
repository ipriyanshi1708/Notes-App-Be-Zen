import { createContext, useState } from "react";

export const EditTriggeredContext = createContext({
    editTriggered:false,
    setEditTriggered: ()=>false,
    noteContent: {title:'', tagline:'',note:'',pin:false},
    setNoteContent:  ()=>{}
});

export const EditTriggeredProvider = ({children})=>{
    const [editTriggered, setEditTriggered] = useState(false);
    const [noteContent, setNoteContent]= useState({title:'', tagline:'',note:'',pin:false});
    const value =  {editTriggered, setEditTriggered, noteContent, setNoteContent}
    return(<EditTriggeredContext.Provider value={value}>{children}</EditTriggeredContext.Provider>)
}   