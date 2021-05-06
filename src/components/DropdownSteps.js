import React,{ useState } from 'react';
import onClickOutside from 'react-onclickoutside'

function DropdownSteps({title, steps}){
    
    const [open,setOpen] = useState(false);

    DropdownSteps.handleClickOutside = () => setOpen(false);

    return (
        <div className = "dropup">
            <button onClick = {() => setOpen(!open)} className = "dropbtn">{title}</button>
            <div className = "dropup-content">
                {open && steps.map((item, index) => (
                    <li key = {index}>
                        <td dangerouslySetInnerHTML={{__html: item.instructions}} />
                        <p>Distance : {item.distance.text} </p>
                        <p>Duration : {item.duration.text}</p>
                    </li>
                ))}
            </div>
        </div>
    );
}

const clickOutsideConfig = {
    handleClickOutside: () => DropdownSteps.handleClickOutside,
};

export default onClickOutside(DropdownSteps,clickOutsideConfig);
