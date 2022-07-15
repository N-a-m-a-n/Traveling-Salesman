import React, { useState } from "react";
import AddIcon from '@material-ui/icons/Add';

export default function NotesDropdown({notes, setNotes, toggleAddNote, toggleShowNote, noteIndex, note, setNote}){

    function editNote(idx){
        console.log(idx);
        noteIndex.current = idx;
        // setNoteIndex(idx);
        console.log(notes[noteIndex.current], note);
        setNote({
            ...notes[noteIndex.current]}
            )
        // console.log(noteIndex.current);
        toggleShowNote();
    }

    return (
        <div className = "notes-box">
            <h2 className = "heading">Notes</h2>
            <AddIcon onClick = {() => {
                noteIndex.current = -1;
                // setNoteIndex(-1);
                toggleAddNote();
            }}/>

            {notes.map((note, index) => {
                return (
                    <div className = "note" key = {index} onClick = {() => {
                        // noteIndex.current = index;
                        editNote(index)
                    }}>
                        <h3>{note.title.substring(0, 20) + ((note.title.length > 20) ? "..." : "")}</h3>
                        <p>{note.content.substring(0, 30) + ((note.content.length > 30) ? "..." : "")}</p>
                        <p className = "note-date">Created at {note.date.getDate()}/{note.date.getMonth()+1}/{note.date.getFullYear()} @ {note.date.getHours()}:{note.date.getMinutes() < 10 && '0'}{note.date.getMinutes()}</p>
                    </div>
                )
            })}

        </div>
    );
}