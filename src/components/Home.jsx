import React, { useContext, useState } from 'react'
import "antd/dist/antd.css"
import Cardlist from "./Cardlist.jsx";
import "./Style.css";
import Popup from './Popup.jsx';
import { doc, collection, getDocs, addDoc, updateDoc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from '../firebase.js';
import { useEffect } from 'react';
import { EditTriggeredContext } from '../contexts/EditTriggered.context';
import { Pagination, Alert } from 'antd';
import { async } from '@firebase/util';

// import Pagination from "./Pagination.js";

const Home = () => {
    const [addTrigger, setAddTrigger] = useState(false);
    const [title, setTitle] = useState("");
    const [tagline, setTagline] = useState("");
    const [note, setNote] = useState("");
    const [id, setId] = useState("");
    const [submitting, setSubmitting] = useState("Add");
    const [notes, setNotes] = useState([]);
    const [skipCount, setSkipCount] = useState(true);
    const [pinUpdated, setPinUpdated] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pinId, setPinId] = useState('');
    const [pinTriggered, setPinTriggered] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [edited, setEdited] = useState(false);
    const [added, setAdded] = useState(false);
    const [errAdding, setErrAdding] = useState(false);
    const [errEditing, setErrEditing] = useState(false);
    const [errPinUpdating, setErrPinUpdating] = useState(false);
    const [errLoading, setErrLoading] = useState(false);
    const { editTriggered, noteContent, setEditTriggered } = useContext(EditTriggeredContext);

    // console.log(pinTriggered);
    // Updating the value of pin in firestore
    useEffect(() => {
        try {
            const update = async () => {
                // console.log("updating pin")
                // console.log("pin", pinTriggered);
                setErrPinUpdating(false);
                setIsLoading(true);
                const docRef = doc(db, "notes", pinId);
                const docSnapshot = await getDoc(docRef);
                const docData = docSnapshot.data();
                // console.log("docpin", !docData.pin);
                await updateDoc(docRef, {
                    pin: !docData.pin
                });
                setPinId("");
                setPinUpdated(!pinUpdated);
            }
            if (pinId != "")
                update();
        } catch (err) {
            console.log(err.message);
            setErrPinUpdating(true);
        }
    }, [pinTriggered])

    //    Getting notes from firestore
    const getData = async () => {
        try {
            setErrLoading(false);
            setIsLoading(true);
            const querySnapshot = await getDocs(collection(db, "notes"));
            let arr = [];
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                arr.push({ id: doc.id, ...doc.data() });
                // console.log(doc.id, " => ", doc.data());
            });
            console.log(arr);
            let temp;
            arr.forEach((note, idx) => {
                // console.log("note.pin", note.pin);
                if (note.pin) {
                    // console.log("note id", note.id, idx)

                    temp = arr.splice(idx, 1);
                    arr.unshift(temp[0]);

                }
            })
            setNotes(arr);
            setIsLoading(false);
            if(arr.length===0){
                setErrLoading(true);
            }
        } catch (err) {
            console.log(err.message);
            setErrLoading(true);
        }

    }
    useEffect(() => {
        getData();
    }, [submitting, pinUpdated])
    // console.log("data fetched");
    console.log("errLoading", errLoading);
    console.log("errAdding", errAdding);
    //Showing a popup when clicking on edit note
    useEffect(() => {
        console.log(skipCount);
        console.log("editTriggered", editTriggered);
        if (skipCount) setSkipCount(false);

        if (!skipCount) {
            // console.log("inside editTriggered")
            setSubmitting("Update");
            setTitle(noteContent.title);
            setId(noteContent.id);
            setTagline(noteContent.tagline)
            setNote(noteContent.note)
            setAddTrigger(true)
        }


    }, [editTriggered])
    // console.log(editTriggered);
    // console.log(title);



    // Adding new notes and updating notes in firestore
    const handleSubmit = async (e) => {
        e.preventDefault();

        // console.log("handle submit triggered");
        // console.log(title);
        if (id == "") {
            try {
                setErrAdding(false);
                setSubmitting("Adding...")
                const docRef = await addDoc(collection(db, "notes"), {
                    title,
                    tagline,
                    note,
                    pin: false
                });

                setAdded(true);
                //   console.log("Document written with ID: ", docRef.id);
            } catch (e) {
                console.error("Error adding document: ", e);
                setErrAdding(true);
            }
        } else {

            try {
                // console.log("id", id);
                // console.log("note", note);
                // console.log("title", title);
                setErrEditing(false);
                setSubmitting('Updating...')
                const docRef = doc(db, "notes", id);
                await updateDoc(docRef, {
                    title,
                    tagline,
                    note,
                    pin: false
                });

                setEdited(true);
            } catch (e) {
                console.error("Error updating document", e);
                setErrEditing(true);
            }
        }
        setAddTrigger(false);
    }
    // console.log(notes);

    // Pagination
    const notesPerPage = 6;
    const indexOfLastNote = currentPage * notesPerPage;
    const indexOfFirstNote = indexOfLastNote - notesPerPage;
    const currentNotes = notes.slice(indexOfFirstNote, indexOfLastNote);
    // console.log("current Notes",currentNotes);

    return (
        <div className='container'>
            <div className='homepage'>
                <div id='headingDiv'>
                    <span id='heading'>Notes App</span>
                    {
                        added ? <Alert message="Note Added Successfully" type="success" closable afterClose={() => { setAdded(false) }} /> : null
                    }
                    {
                        edited ? <Alert message="Note Edited Successfully" type="success" closable afterClose={() => { setEdited(false) }} /> : null
                    }
                    {
                        errAdding? <Alert message="Error Adding Note" type="error" closable/> : null
                    }
                    {
                        errEditing? <Alert message="Error Editing Note" type="error" closable /> : null
                    }
                    <button className='btn' onClick={() => {
                        setAddTrigger(true);
                        setTitle("");
                        setTagline("");
                        setNote("");
                        setId("");
                        setSubmitting("Add");
                    }}>Add Note</button>
                </div>

                <div className="notes">
                    <Popup trigger={addTrigger} setTrigger={setAddTrigger}>
                        <div className='inputDiv'>
                            <form className='inputForm' onSubmit={handleSubmit} >
                                <input type="text" value={id} style={{ display: "none" }} />
                                <input type="text" placeholder='Title' value={title} onChange={(e) => { setTitle(e.target.value) }} className='inputTag' required />
                                <input type="text" placeholder='Tagline' className='inputTag' value={tagline} onChange={(e) => { setTagline(e.target.value) }} required />
                                <textarea type="text" placeholder='Add note...' className='addNoteInput' value={note} onChange={(e) => { setNote(e.target.value) }} required />
                                <input type="submit" className='btn inputTag addBtn' value={submitting} />
                            </form>
                        </div>
                    </Popup>
                    <div className='cardList-container'>
                        {isLoading ? <p className='loading'>Loading...</p> : errLoading ? <h1 className="oops">Oops! Something went wrong.</h1> : <Cardlist notes={currentNotes} setPinId={setPinId} setPinTriggered={setPinTriggered} pinTriggered={pinTriggered} />}

                    </div>
                    <Pagination size="small" total={notes.length} pageSize="6" onChange={(page, pageSize) => {
                        setCurrentPage(page);
                    }}  className="pagination" />
                </div>
            </div>
        </div>
    )
}

export default Home
