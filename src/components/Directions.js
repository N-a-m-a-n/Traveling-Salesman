import React, {useRef, useState} from 'react';
import DropdownSteps from './DropdownSteps'

export default function Directions({mapRef, markers, polylines, clearDirections, btn, setBtn, routeBox, setRouteBox, stIdx, travMode, showTravMode, setShowTravMode, stshowIdx, setStshowIdx}){

    var latlngbounds = useRef();

    var path = useRef([]);
    var minTime = useRef(Number.MAX_VALUE);


    var [travDistAndTime, setTravDistAndTime] = useState({dist : "", time : ""});

    var dp = useRef();
    
    var coords = useRef([]);

    var [routeBuildResponse, setRouteBuildResponse] = useState([]);

    var directionsService = new window.google.maps.DirectionsService();

    function recenterMap(){

        latlngbounds.current = new window.google.maps.LatLngBounds();
        markers.forEach((marker) => {
            latlngbounds.current.extend({lat : marker.lat, lng : marker.lng});
        })
        mapRef.current.setCenter(latlngbounds.current.getCenter());
        mapRef.current.fitBounds(latlngbounds.current);
    }

    function mode(){

        if(travMode.current === 'DRIVING') return window.google.maps.TravelMode.DRIVING
        else if(travMode.current === 'WALKING') return window.google.maps.TravelMode.WALKING
        else if(travMode.current === 'TRANSIT') return window.google.maps.TravelMode.TRANSIT
        else if(travMode.current === 'BICYCLING') return window.google.maps.TravelMode.BICYCLING  
    }

    let TSP = function(timeMatrix, maskVal, currPos, checkMask){
        if(maskVal === checkMask){
            return {
                currTime : timeMatrix[currPos].elements[0].duration.value,
                currPath : [0]
            };
        }
        if(dp[currPos][maskVal] !== -1){
            return dp[currPos][maskVal];
        }

        let ansTime = Number.MAX_VALUE;
        let ansPath = [currPos];

        for(let i=0;i<timeMatrix.length;i++){
            if((maskVal&(1<<i)) === 0){
                let {currTime, currPath} = TSP(timeMatrix,maskVal|(1<<i),i,checkMask);
                currTime += timeMatrix[currPos].elements[i].duration.value;
                if(currTime < ansTime){
                    ansTime = currTime;
                    ansPath = [i, ...currPath];
                }
            }
        }
        return dp[currPos][maskVal] = {currTime : ansTime, currPath : ansPath}
    }

    
    function calMatrix(markerPoints, callback){

        const distanceMatrixService = new window.google.maps.DistanceMatrixService();

        distanceMatrixService.getDistanceMatrix({
            origins: markerPoints,
            destinations: markerPoints,
            travelMode: mode(),
        }, (res, status) => {
            if (status === "OK") {
                for(let i=0;i<res.rows.length;i++){
                    for(let j=0;j<res.rows[i].elements.length;j++){
                        if(res.rows[i].elements[j].status !== "OK"){
                            alert("No route available for the selected Mode at this moment.")       
                            setBtn(false);
                            setRouteBox(false);
                            return;
                        }
                    }
                }
                setBtn(true);
                setRouteBox(true);

                dp = new Array(markers.length);
                for(let i=0;i<dp.length;i++){
                    dp[i] = new Array(Math.pow(2, markers.length))
                    for(let j=0;j<dp[i].length;j++){
                        dp[i][j] = -1;
                    }
                }
                let {currTime, currPath} = TSP(res.rows, 1, 0, Math.pow(2, markers.length) - 1);
                path.current = [0,...currPath]
                minTime.current = currTime;
                callback();
            } else {
                alert(status);
            }
        })
    }
    
    function chooseMode(modeClicked){

        if(markers.length < 2){
            alert("Please Mark atleast two locations.")
            return;
        }

        clearDirections()
        travMode.current = modeClicked;
        setShowTravMode(travMode.current)
        recenterMap();
        showRoute();
    }

    function animatePath(map, pathCoords,idx) {

        let speed = 5000;
        
        polylines[idx] = new window.google.maps.Polyline({
            path: [],
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 3,
            editable: false,
            map: map
        });
    
        let chunk = Math.ceil(pathCoords.length / speed);
        let totalChunks = Math.ceil(pathCoords.length / chunk);
        let i = 1;
    
        function step() {
    
            polylines[idx].setPath(pathCoords.slice(0, i * chunk));
            i++;
            if (i <= totalChunks){
                window.requestAnimationFrame(step);
            }
        }
        window.requestAnimationFrame(step);
    }


    function showRoute(){

        let markerPoints = [];

        markers.map(marker => (
            markerPoints.push({
                lat : marker.lat,
                lng : marker.lng
            })
        ))
            
        function plot(){

            let requests = [];
            for(let i=0;i<path.current.length-1;i++){
                requests.push({
                    origin : markerPoints[path.current[i]],
                    destination : markerPoints[path.current[i+1]],
                    travelMode : mode(),
                })
            }

            function buildRoute(requests) {

                return Promise.all(requests.map((request) => {
                    return new Promise(function(resolve) {
                        directionsService.route(request, function(result, status) {
                            if (status === "OK") {
                                return resolve(result.routes[0].legs[0]);
                            }
                        });
                    });    
                }));
            }

            buildRoute(requests).then((results) => {

                setRouteBuildResponse(results);

                var dist = 0;
                var time = 0;
                results.forEach(result => {
                    dist += result.distance.value
                    time += result.duration.value
                })

                dist = (dist/1000).toFixed(2);
                time = (time/60).toFixed(0);
                setTravDistAndTime({dist : dist + " Km", time : time + " mins"});

                coords.current = results.map((result) => {
                    return result.steps.flatMap(step => step.path);
                });

                let allCoords = results.flatMap((result) => {
                    return result.steps.flatMap(step => step.path);
                });
            
                stIdx.current = 0;
                setStshowIdx(stIdx.current);
                animatePath(mapRef.current, allCoords, 0);
            });
        }
        calMatrix(markerPoints, plot)
    }
    
    const nextClick = () => {
        recenterMap();
        if(stIdx.current < coords.current.length){
            animatePath(mapRef.current, coords.current[stIdx.current], stIdx.current)
        }
        stIdx.current = stIdx.current + 1;
        setStshowIdx(stIdx.current);
        if(stIdx.current === coords.current.length + 1){
            setBtn(true);
        }
    }

    const stepRoute = () => {
        clearDirections();
        setRouteBox(true);
        setBtn(false);
        setShowTravMode(travMode.current)
        nextClick();
    }

    return (
        <div>
            <div className = "directions-choose-box">
                <p>Choose Mode of Traveling</p>
                <div className = "wrapper">
                    <button className = "travBtn" onClick = {() => chooseMode('DRIVING')}>Driving</button>
                    <button className = "travBtn" onClick = {() => chooseMode('WALKING')}>Walking</button>
                    <button className = "travBtn" onClick = {() => chooseMode('BICYCLING')}>Bicycling</button>
                    <button className = "travBtn" onClick = {() => chooseMode('TRANSIT')}>Transit</button>    
                </div>
                <p className = "directions-para">Mode : {showTravMode}</p>
                <button className = "travBtn remove-direction" onClick = {() => clearDirections()}>Remove Directions</button>
            </div>

            {routeBox && <div>
                {btn && <div className = "route-box">
                    <p>Directions</p>
                    <div className = "scroll-list">
                        {routeBuildResponse.map((route, index) => {
                            if(index === 0){
                                return <div key = {index}>
                                    <div className = "route-points">
                                        <div className = "route-list-div2">Start : </div>
                                        <div className = "route-list-div">{route.start_address}</div>
                                    </div>
                                    <div className = "route-points">
                                        <div className = "route-list-div2">{index+1}</div>
                                        <div className = "route-list-div">{route.end_address}</div> 
                                    </div>
                                </div>
                            }
                            if(index === routeBuildResponse.length - 1){
                                return (
                                    <div key = {index} className = "route-points">
                                        <div className = "route-list-div2">End : </div>
                                        <div className = "route-list-div">{route.end_address}</div>
                                    </div>
                                )
                            }
                            return (
                                <div key = {index} className = "route-points">
                                    <div className = "route-list-div2">{index+1}</div>
                                    <div className = "route-list-div">{route.end_address}</div>
                                </div>
                            )
                        })}
                    </div>
                    <div className = "distTime">
                        <span>Total Distance : {travDistAndTime.dist} </span>
                        <span>Time : {travDistAndTime.time}</span>                        
                    </div>
                    <button onClick = {() => stepRoute()}>Show By Step Directions</button>   
                </div>}

                {!btn && <div className = "stepDirectionsBox">
                    <p>Start Point : </p>
                    <div className = "startEnd">{routeBuildResponse[stshowIdx-1].start_address}</div>
                    <p>End Point : </p>
                    <div className = "startEnd">{routeBuildResponse[stshowIdx-1].end_address}</div>
                    <DropdownSteps
                        title = "Steps"
                        steps = {routeBuildResponse[stshowIdx-1].steps}
                    />
                    <div className = "nxtDirec">
                        <button onClick = {() => nextClick()}>Next Direction</button>
                    </div>
                </div>}
            </div>}
        </div>
    )
}