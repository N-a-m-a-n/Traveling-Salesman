import React, { useContext,useState } from "react";
import {BoldLink, BoxContainer, FormContainer, Input, MutedLink, SubmitButton} from "./common";
import { Marginer } from "./marginer";
import { AccountContext } from "./accountContext";
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

const API = axios.create({baseURL: 'http://localhost:5000'});

export function SignupForm(props) {
  const { switchToSignin } = useContext(AccountContext);

  const [signupdetails, setSignupdetails] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  let navigate = useNavigate();

  function handleChange(event){
    const {name, value} = event.target;

    setSignupdetails(prevDetails => {
      return {
        ...prevDetails,
        [name]: value
      };
    });
  }

  async function Register(event){

    event.preventDefault();
    
    await API.post('/signup', signupdetails)
    .then((res) => {
        let token = res.data.token;
        console.log(token);
        localStorage.setItem("SavedToken", 'Bearer ' + token);
        navigate("../", {replace: true});
    })
    .catch((err) => {
      console.log("blah", err);
    })
  }

  return (
    <BoxContainer>
      <FormContainer>
        <Input type="text" placeholder="Full Name" name = "name" onChange = {handleChange} value = {signupdetails.name}/>
        <Input type="text" placeholder="Username" name = "username" onChange = {handleChange} value = {signupdetails.username}/>
        <Input type="email" placeholder="Email" name = "email" onChange = {handleChange} value = {signupdetails.email}/>
        <Input type="password" placeholder="Password" name = "password" onChange = {handleChange} value = {signupdetails.password}/>
        <Input type="password" placeholder="Confirm Password" />
      </FormContainer>
      <Marginer direction="vertical" margin={10} />
      <SubmitButton type="submit" onClick = {Register}>Signup</SubmitButton>
      <Marginer direction="vertical" margin="1em" />
      <MutedLink href="#">
        Already have an account?
        <BoldLink href="#" onClick={switchToSignin}>
          Signin
        </BoldLink>
      </MutedLink>
    </BoxContainer>
  );
}