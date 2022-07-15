import React from 'react';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

export default function ShowNotePopup({notes, setNotes, toggleAddNote, toggleShowNote, noteIndex, note, setNote}){

    function editToggle(){
        toggleShowNote();
        toggleAddNote();
    }

    function deleteNote(){
        // setTimeout(() => {
            setNotes(prevNotes => {
                return prevNotes.filter((noteItem, idx) => {
                  return idx !== noteIndex.current;
                });
            });
            noteIndex.current = -1;

            setNote({
                title : "", 
                content : ""
            })

            toggleShowNote();
        // }, 1000);
    }

    return (
        <div id = "popup-showNote">
            {noteIndex.current !== -1 && <p>{notes[noteIndex.current].title}</p>}
            {noteIndex.current !== -1 && <p>{notes[noteIndex.current].content}</p>}
            <CloseIcon onClick = {() => {
                console.log(noteIndex.current)
                noteIndex.current = -1;
                setNote({
                    title : "", 
                    content : ""
                })
                toggleShowNote();
            }}/>
            <EditIcon onClick = {editToggle}/>
            <DeleteIcon onClick = {deleteNote}/>
        </div>
    )
}