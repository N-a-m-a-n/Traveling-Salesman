import React, { useContext, useState } from "react";
import {BoldLink, BoxContainer, FormContainer, Input, MutedLink, SubmitButton} from "./common";
import { Marginer } from "./marginer";
import { AccountContext } from "./accountContext";
import axios from 'axios';

const API = axios.create({baseURL: 'http://localhost:5000'});


export function LoginForm(props) {
  const { switchToSignup } = useContext(AccountContext);

  const [logindetails, setLogindetails] = useState({
    email: "",
    password: ""
  });

  function handleChange(event){
    const {name, value} = event.target;

    setLogindetails(prevDetails => {
      return {
        ...prevDetails,
        [name]: value
      };
    });
  }

  async function signin(event){
    await API.post('login', logindetails)
    .then((res) => [

    ]).catch(err => {

    })
  }

  return (
    <BoxContainer>
      <FormContainer>
        <Input type="email" placeholder="Email" name = "email" onChange = {handleChange} value = {logindetails.email}/>
        <Input type="password" placeholder="Password" name = "password" onChange = {handleChange} value = {logindetails.password}/>
      </FormContainer>
      <Marginer direction="vertical" margin={10} />
      {/* <MutedLink href="#">Forget your password?</MutedLink> */}
      <Marginer direction="vertical" margin="1.6em" />
      <SubmitButton type="submit" onClick={signin}>Signin</SubmitButton>
      <Marginer direction="vertical" margin="1em" />
      <MutedLink href="#">
        Don't have an account?{" "}
        <BoldLink href="#" onClick={switchToSignup}>
          Signup
        </BoldLink>
      </MutedLink>
    </BoxContainer>
  );
}