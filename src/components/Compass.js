import React from 'react';

export default function Compass(props){

    function userLocate(){
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude
            const lng = position.coords.longitude
            props.mapRef.current.panTo({lat, lng})
            props.mapRef.current.setZoom(14)
        },() => null, {
            enableHighAccuracy : true
        });
    }

    return <button className = "compass" onClick = {userLocate}>
        <img src = "./images/compass.svg" alt = "Compass"/>
    </button>
}