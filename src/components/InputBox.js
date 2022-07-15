import React from 'react';
import PlacesAutoComplete from 'react-places-autocomplete'

export default function inputBox(props){
    return (
        <PlacesAutoComplete value = {props.address} onChange = {props.setAddress} onSelect = {props.handleSelect}>
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div className = "searchBox">

                    <input className = "inputBox" {...getInputProps({placeholder : "Type Address"})}/>
                    <div className = "suggestionsBox">
                        {loading ? <div>...loading places</div> : null}
                        {suggestions.map((suggestion, index) => {
                            const style = {
                                backgroundColor : suggestion.active ? "rgba(8, 217, 214, 0.35)" : "#fff",
<<<<<<< HEAD
                               // width : "103%"
=======
                                width : "100%"
>>>>>>> fabedc78d452b43f67196ea93e9b015d6ae7e130
                            }
                            return (
                                <div key = {index} className = "suggestions" {...getSuggestionItemProps( suggestion, {style})}>
                                    {suggestion.description}
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </PlacesAutoComplete>
    )
}