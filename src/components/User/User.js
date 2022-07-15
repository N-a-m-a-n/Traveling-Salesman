import React,{useState} from "react";
import onClickOutside from 'react-onclickoutside'
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import UserDropdown from './UserDropdown';
 
function User(){

    const [open,setOpen] = useState(false);

    User.handleClickOutside = () => setOpen(false);

    return (
        <div className = "notesUser">

            <AccountCircleIcon onClick = {() => setOpen(!open)} style = {{fontSize : 50, color : "#888888", cursor : "pointer"}} className = "userButton"/>

            <div className = "user-content-box">
                {open && <UserDropdown />}
            </div>
        </div>
    )
}

const clickOutsideConfig = {
    handleClickOutside: () => User.handleClickOutside,
};

export default onClickOutside(User,clickOutsideConfig);
