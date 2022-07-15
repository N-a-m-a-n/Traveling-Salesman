import React,{ useState } from 'react';
import onClickOutside from 'react-onclickoutside'

import NotesDropdown from './NotesDropdown';

function Notes({notes, setNotes, toggleAddNote, toggleShowNote, noteIndex, note, setNote}){

    const [open,setOpen] = useState(false);

    Notes.handleClickOutside = () => setOpen(false);

    return (
        <div className = "notesUser">

            <button onClick = {() => setOpen(!open)} className = "notesButton">
                <img src = "./images/notes.png" alt = "notes" width = "45" height = "45"></img>
            </button>

            <div className = "notes-content-box">
                {open && <NotesDropdown notes = {notes} setNotes = {setNotes} toggleAddNote = {toggleAddNote} toggleShowNote = {toggleShowNote} noteIndex = {noteIndex} note = {note} setNote = {setNote}/>}
            </div>         
        </div>
    );
}

const clickOutsideConfig = {
    handleClickOutside: () => Notes.handleClickOutside,
};

export default onClickOutside(Notes,clickOutsideConfig);
