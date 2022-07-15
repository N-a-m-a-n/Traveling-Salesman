import React, { useState } from 'react';

import AddIcon from '@material-ui/icons/Add';

export default function AddNotePopup({notes, setNotes, toggleAddNote, noteIndex, note, setNote}){

    

    // const [note, setNote] = useState({
    //     title : "Ttl",
    //     content : "cnt",
    //     date : "dt"
    // });

    function handleChange(event) {
        const { name, value } = event.target;
        // console.log(event.target);
        event.preventDefault();
        setNote(prevNote => {
            return {
                ...prevNote,
                [name]: value,
                date : new Date()
            };
        });
    }

    function AddNote(event){
        event.preventDefault();
        
        if(noteIndex.current === -1){
            setNotes(prevNotes => {
                return [note, ...prevNotes];
            });
        }else{
            setNotes(prevNotes => {
                return prevNotes.map((currnote, index) => {
                    return index === noteIndex.current ? note : currnote;
                })
            })
        }
        setNote({
            title : "",
            content : "",
            date : ""
        })
        // event.preventDefault();
        // noteIndex.current = -1;
        toggleAddNote();
    }    

    return (
        <form id = "popup-addNote">
            <h3 className = "heading">{noteIndex.current === -1 ? "Add a note.." : "Edit Note.." } </h3>
            {/* {console.log(noteIndex.current)} */}
            <input name = "title" onChange = {handleChange} value = {note.title} placeholder = "Title"/>
            <textarea name = "content" onChange = {handleChange} value = {note.content} placeholder = "Take a note.."/>
            <AddIcon className = "popup-button" onClick = {(e) => AddNote(e)}/>
        </form>
    )
}