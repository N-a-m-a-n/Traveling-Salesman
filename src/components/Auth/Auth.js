import "../../index.css";
import styled from "styled-components";
import AuthBox from "./AuthBox";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

function Auth() {
  return (
    <Container>
      <AuthBox/>
    </Container>
  );
}

export default Auth;