import React from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import { IconButton } from '@material-ui/core';

export default function AddressBox({marker, onDelete, id, setSelected}){

    return (
        <div className = "addressBox">
            <div className = "d1">
                <p>{marker.address}</p>
            </div>
            <div className = "d2">
                <IconButton aria-label="delete" onClick = {
                    () => {
                        onDelete(id)
                        setSelected(null)
                    }
                }>
                    <DeleteIcon />
                </IconButton>
            </div>
        </div>
    )
}