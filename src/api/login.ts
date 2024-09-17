
import axios, { isCancel, AxiosError, AxiosResponse } from "axios";
import { clear } from "console";

const APISERVER = import.meta.env.VITE_API_SERVER_URL+"/User";
function setJwt(jwt) {
    localStorage.setItem("jwt", jwt);
    console.log(getLocalJwt());

}

export function clearJwt() {
  localStorage.removeItem("jwt");
}

export function getLocalJwt() {
  return localStorage.getItem("jwt");
}

export async function verifyJwt() {
  const jwt = getLocalJwt();
  const verifyJwtUrl = `${APISERVER}/VerifyToken`
  try {
    const response  = await axios(verifyJwtUrl,{
      method:'Post',
      data:{
        accessToken: jwt,
      }
    });
    if (response.status == 201){ clearJwt();throw "Token Expired"};
    console.log("Verifed JWT")
    clientResponse.error = false;
    clientResponse.errorMsg = "";
    
    return true

  } catch (error) {
    clientResponse.error = true;
    clientResponse.errorMsg = error.message || 'An unexpected error occurred';
    console.error(`Error: ${error}`);
    console.warn("An error occurred while attempting to make a JWT Verify request to the API server. See above error message for more info.");
    if(error.message == "jwt expired"){clearJwt() }
    return false
  }
}


export async function Login(email: string, password: string) {
  const loginUrl = `${APISERVER}/Login`;
  try {
    const response = await axios.post(loginUrl, {

      email: email.toLowerCase(),
      password: password,
    });

    console.log("Logged in Successfully, Saving JWT");
    clientResponse.error = false;
    clientResponse.errorMsg = "";
    const token = response.data.accessToken;
    setJwt(token);

  } catch (error) {
    clientResponse.error = true;
    clientResponse.errorMsg = error.message || 'An unexpected error occurred';
    console.error(`Error: ${error}`);
    console.warn("An error occurred while attempting to make a Login request to the API server. See above error message for more info.");
  }

  return clientResponse

}
let clientResponse = { error: false, errorMsg: "" };

export async function Register(
  firstName: string,
  lastName: string,
  email: string,
  password: string
) {
    let registerurl = `${APISERVER}/Register`;
    try {
        const response = await axios.post(registerurl, {
          firstName: firstName,
          lastName: lastName,
          email: email.toLowerCase(),
          password: password,
        });
    
        console.log("Registered Successfully, Saving JWT");
        clientResponse.error = false;
        clientResponse.errorMsg = "";
        const token = response.data.accessToken;
        setJwt(token);
    
      } catch (error) {
        clientResponse.error = true;
        clientResponse.errorMsg = error.message || 'An unexpected error occurred';
        console.error(`Error: ${error}`);
        console.warn("An error occurred while attempting to make a Register request to the API server. See above error message for more info.");
      }
    
      return clientResponse

}
