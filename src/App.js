import React, {useState, useCallback, useRef} from 'react';
import {GoogleMap, useLoadScript, Marker, InfoWindow} from '@react-google-maps/api';
import {geocodeByAddress,getLatLng} from 'react-places-autocomplete'
import {RemoveScrollBar} from 'react-remove-scroll-bar';
import DeleteIcon from '@material-ui/icons/Delete';
import { IconButton } from '@material-ui/core';
// import {row} from 'bootstrap';
import {Link} from 'react-router-dom';

import mapStyles from './styles/mapStyles';
import AddressBox from './components/AddressBox';
import InputBox from './components/InputBox';
import Compass from './components/Compass';
import Directions from './components/Directions';
import Notes from './components/Notes/Notes';
import User from './components/User/User';
import AddNotePopup from './components/Notes/AddNotePopup';
import ShowNotePopup from './components/Notes/ShowNotePopup';


require('dotenv').config();

const mapContainerStyle = {
    width : '100vw',
    height : '100vh'
}

const center = {
    lat : 28.6341,
    lng : 77.2025
}

const options = {
    styles : mapStyles,
    mapTypeControl : false,
}

export default function App() {

    const [libraries] = useState(["places"])

    const {isLoaded, loadError} = useLoadScript({
        googleMapsApiKey : process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    })

    const [markers, setMarkers] = useState([]);
    const [selected, setSelected] = useState(null);

    const [address, setAddress] = useState("");

    const [btn, setBtn] = useState(true);
    const [routeBox, setRouteBox] = useState(false);

    var stIdx = useRef(0)
    var polylines = useRef([]);

    var travMode = useRef(null);
    const [showTravMode, setShowTravMode] = useState(null);

    const [stshowIdx, setStshowIdx] = useState(0);

    const mapRef = useRef();

    const [notes, setNotes] = useState([]);

    var noteIndex = useRef(-1);
    // const [noteIndex, setNoteIndex] = useState(-1);



    const [note, setNote] = useState({
        title : "",
        content : "",
        date : ""
    });

    const onMapLoad = useCallback((map) => {
        mapRef.current = map;
    },[]);

    const clearDirections = () => {        
        setBtn(true);
        setRouteBox(false);
        setShowTravMode(null);
        stIdx.current = 0;
        setStshowIdx(stIdx.current);
        if(polylines.current.length !== 0){
            for(let i=0;i<polylines.current.length;i++){
                polylines.current[i].setMap(null)
            }
        }
    }

    const onMapClick = (event) => {
        console.log(event)
        const geocoder = new window.google.maps.Geocoder();
        const latLng = {
            lat : event.latLng.lat(),
            lng : event.latLng.lng(),
        }
        geocoder.geocode({location : latLng}, (results, status) => {
            if(status === "OK"){
                var address = "" + results[0].formatted_address;
                setMarkers(current => [...current, {
                    address : address,
                    lat : event.latLng.lat(),
                    lng : event.latLng.lng()
                }]);
            }else{
                window.alert("Geocoder failed due to: " + status);
                setMarkers(current => [...current, {
                    address : "",
                    lat : event.latLng.lat(),
                    lng : event.latLng.lng()
                }]);
            }
        })
        clearDirections()
    }

    const handleSelect = async value => {
        const results = await geocodeByAddress(value);
        const latlng = await getLatLng(results[0]);
        setAddress(value)
        mapRef.current.panTo({lat : latlng.lat, lng : latlng.lng})
        mapRef.current.setZoom(14)
    }

    function deletePoint(idx){
        clearDirections()

        setMarkers(current => {
            return current.filter((marker,index) => {
                return index !== idx;
            });
        });
    }

    const markerDrag = (e,idx) => {
        console.log(e,idx);
        setSelected(null);
        const geocoder = new window.google.maps.Geocoder();
        const latLng = {
            lat : e.latLng.lat(),
            lng : e.latLng.lng()
        }
        geocoder.geocode({location : latLng}, (results, status) => {
            if(status === "OK"){
                var address = "" + results[0].formatted_address;
                setMarkers(current => current.map((marker, index) => {
                    return index !== idx ? marker : {
                        address : address,
                        lat : e.latLng.lat(),
                        lng : e.latLng.lng()
                    }
                }))
            }else{
                window.alert("Geocoder failed due to: " + status);
                setMarkers(current => current.map((marker, index) => {
                    return index === idx ? marker : {
                        address : "",
                        lat : e.latLng.lat(),
                        lng : e.latLng.lng()
                    }
                }))
            }
        })
        clearDirections()
    }

    function toggleAddNote(){
        var blur = document.getElementById('app_element_id')
        blur.classList.toggle('active');
        var popupAddNote = document.getElementById('popup-addNote')
        popupAddNote.classList.toggle('active');
    }

    function toggleShowNote(){
        var blur = document.getElementById('app_element_id')
        blur.classList.toggle('active');
        // setNoteIndex(0);
        // noteIndex.current = 
        // console.log(noteIndex, notes[noteIndex]);
        // setNote(notes[noteIndex]);
        var popupShowNote = document.getElementById('popup-showNote')
        popupShowNote.classList.toggle('active');
    }

    if(loadError) return "Error Loading Maps! Please check your network connection. ";
    if(!isLoaded) return "Loading Maps";

  return (        

    <div>

<<<<<<< HEAD
        <div id = "app_element_id">
            
            <RemoveScrollBar/>

            <Compass mapRef = {mapRef} />

            <div className = "search-icons-container">
                <InputBox address = {address} setAddress = {setAddress} handleSelect = {handleSelect}/>
                <ul>
                    <li>
                        <Notes notes = {notes} setNotes = {setNotes} toggleAddNote = {toggleAddNote} toggleShowNote = {toggleShowNote} noteIndex = {noteIndex} note = {note} setNote = {setNote}/>
                    </li>
                    <li>
                        <User />
                    </li>

                    <li>
                        <Link to = "/auth">Auth</Link>
                    </li>    
                    {/* <li>
                        <Link to = "/signup">Signup</Link>
                    </li>     */}

                </ul>

            </div>


            <GoogleMap 
                className = "map"
                mapContainerStyle={mapContainerStyle} 
                zoom = {11} 
                center = {center}
                options = {options}
                onClick = {onMapClick}
                onLoad = {onMapLoad}
=======
        <InputBox address = {address} setAddress = {setAddress} handleSelect = {handleSelect}/>
        
        <Compass mapRef = {mapRef} />

        <GoogleMap 
            className = "map"
            mapContainerStyle={mapContainerStyle} 
            zoom = {8} 
            center = {center}
            options = {options}
            onClick = {onMapClick}
            onLoad = {onMapLoad}
        >
            {markers.map((marker, index) => (
                <Marker 
                    key = {index} 
                    position = {{lat : marker.lat, lng : marker.lng }}
                    icon = {{
                        url : './images/marker4.svg',
                        scaledSize : new window.google.maps.Size(30,30),
                        origin : new window.google.maps.Point(0,0),
                        anchor : new window.google.maps.Point(15,35),
                    }}
                    animation = {window.google.maps.Animation.DROP}
                    onClick = {() => {
                        setSelected({...marker, index});
                    }}
                    draggable = {true}
                    onDragEnd = {(e) => markerDrag(e,index)}
                />  
            ))}

            {selected && (<InfoWindow
                position = {{lat : selected.lat, lng : selected.lng}}
                // anchor = {new window.google.maps.Point(0,0)}
                options = {{pixelOffset : new window.google.maps.Size(0,-30)}}
                onCloseClick = {() => {
                    setSelected(null);                    
                }}
>>>>>>> fabedc78d452b43f67196ea93e9b015d6ae7e130
            >
                {markers.map((marker, index) => (
                    <Marker 
                        // className = "marker"
                        key = {index} 
                        position = {{lat : marker.lat, lng : marker.lng }}
                        icon = {{
                            url : './images/marker4.svg',
                            scaledSize : new window.google.maps.Size(30,30),
                            origin : new window.google.maps.Point(0,0),
                            anchor : new window.google.maps.Point(15,35),
                        }}
                        animation = {window.google.maps.Animation.DROP}
                        onClick = {() => {
                            setSelected({...marker, index});
                        }}
                        draggable = {true}
                        onDragEnd = {(e) => markerDrag(e,index)}
                    />  
                ))}

                {selected && (<InfoWindow
                    position = {{lat : selected.lat, lng : selected.lng}}
                    // anchor = {new window.google.maps.Point(0,0)}
                    options = {{pixelOffset : new window.google.maps.Size(0,-30)}}
                    onCloseClick = {() => {
                        setSelected(null);                    
                    }}
                >
                    <div className = "infowindow-content">
                        <p>{selected.address}</p>
                        <IconButton  aria-label="delete" onClick = {() => {
                            deletePoint(selected.index)
                            setSelected(null);
                        }}>
                            <DeleteIcon />
                        </IconButton>
                    </div>
                </InfoWindow>)}

                {markers.length && <div className = "addressContainer">
                    {markers.map((marker, index) => (
                        <AddressBox key = {index} marker = {marker} onDelete = {deletePoint} id = {index} setSelected = {setSelected}/>
                    ))}
                </div>}

                <Directions
                    mapRef = {mapRef}
                    markers = {markers}
                    clearDirections = {clearDirections}
                    polylines = {polylines.current}
                    btn = {btn}
                    setBtn = {setBtn}
                    routeBox = {routeBox}
                    setRouteBox = {setRouteBox}
                    stIdx = {stIdx}
                    travMode = {travMode}
                    showTravMode = {showTravMode}
                    setShowTravMode = {setShowTravMode}
                    setStshowIdx = {setStshowIdx}
                    stshowIdx = {stshowIdx}
                />
            </GoogleMap>
        </div>

        <AddNotePopup notes = {notes} setNotes = {setNotes} toggleAddNote = {toggleAddNote} noteIndex = {noteIndex} note = {note} setNote = {setNote}/>

        <ShowNotePopup notes = {notes} setNotes = {setNotes} toggleAddNote = {toggleAddNote} toggleShowNote = {toggleShowNote} noteIndex = {noteIndex} note = {note} setNote = {setNote}/>
        
    </div>
        
  );
}
