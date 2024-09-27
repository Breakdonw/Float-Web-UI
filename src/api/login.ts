
import axios, { isCancel, AxiosError, AxiosResponse } from "axios";
import { clear } from "console";

const APISERVER = import.meta.env.VITE_API_SERVER_URL+"/User";

/* The AuthService class handles user authentication by managing JWT tokens for login,
registration, and verification. */
export class AuthService {
  private jwt: string | null = null;

  constructor() {
    this.jwt = this.getLocalJwt();
  }

/**
 * The setJwt function stores a JWT token in the local storage and assigns it to the jwt property.
 * 
 * Args:
 *   token (string): The `token` parameter in the `setJwt` method is a string that represents the JSON
 * Web Token (JWT) that is being set and stored in the browser's `localStorage`.
 */
  private setJwt(token: string) {
    localStorage.setItem("jwt", token);
    this.jwt = token;
  }

/**
 * The function `getLocalJwt` retrieves a JWT token from the local storage.
 * 
 * Returns:
 *   The `getLocalJwt` method is returning a string value retrieved from the "jwt" key in the
 * localStorage. If the value is not found, it will return `null`.
 */
  public getLocalJwt(): string | null {
    return localStorage.getItem("jwt");
  }

/**
 * The clearJwt function removes the "jwt" item from localStorage and sets the jwt property to null.
 */
  public clearJwt() {
    localStorage.removeItem("jwt");
    this.jwt = null;
  }

/**
 * This function verifies a JWT token by sending it to a server for validation and handles token
 * expiration errors.
 * 
 * Returns:
 *   The `verifyJwt` function returns a Promise that resolves to a boolean value. If the JWT
 * verification is successful, it returns `true`. If there is an error during verification or the token
 * has expired, it returns `false`.
 */
  public async verifyJwt(): Promise<boolean> {
    const verifyJwtUrl = `${APISERVER}/VerifyToken`;
    try {
      const response = await axios.post(verifyJwtUrl, { accessToken: this.jwt });
      if (response.status === 201) {
        this.clearJwt();
        throw new Error("Token Expired");
      }
      console.log("Verified JWT");
      return true;
    } catch (error) {
      console.error(`Error: ${error}`);
      if (error.message === "jwt expired") {
        this.clearJwt();
      }
      return false;
    }
  }

/**
 * The `login` function sends a POST request to a login endpoint with email and password,
 * sets the JWT token upon successful login, and returns a boolean indicating login success.
 * 
 * Args:
 *   email (string): The `email` parameter in the `login` function is a string that represents the
 * email address of the user trying to log in.
 *   password (string): The `password` parameter in the `login` function is a string that represents
 * the user's password. It is used along with the `email` parameter to authenticate the user during the
 * login process.
 * 
 * Returns:
 *   The `login` function returns a Promise that resolves to a boolean value. If the login is
 * successful, it returns `true`, and if there is an error during the login process, it returns
 * `false`.
 */

  public async login(email: string, password: string): Promise<object | boolean> {
    const loginUrl = `${APISERVER}/Login`;
    try {
      const response = await axios.post(loginUrl, { email, password });
      this.setJwt(response.data.accessToken);
      console.log("Logged in Successfully");
      return true;
    } catch (error) {
      console.error(`Error: ${error}`);
      return {error:true, errorMsg: error};
    }
  }

/* The `register` method in the `AuthService` class is a public asynchronous function that handles user
registration. Here's a breakdown of what it does: */
  public async register(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Promise< object | boolean> {
    const registerUrl = `${APISERVER}/Register`;
    try {
      const response = await axios.post(registerUrl, {
        firstName,
        lastName,
        email,
        password,
      });
      await this.setJwt(response.data.accessToken);
      console.log("Registered Successfully");
      return true;
    } catch (error) {
      console.error(`Error: ${error}`);
      return {error:true, errorMsg: error};
    }
  }
}