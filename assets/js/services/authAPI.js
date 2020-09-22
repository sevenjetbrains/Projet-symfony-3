import axios from "axios";
import CustomersAPI from "./customersAPI";
import jwtDecode from "jwt-decode";
import { LOGIN_API } from "../Config";

function logout(){
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"];
   
}
function isAuthenticated(){
    const token = window.localStorage.getItem("authToken");
    if (token) {

        const { exp: expiration } = jwtDecode(token);
        if (expiration * 1000 > new Date().getTime()) {
            return true

        }
        return false;
    }
    return false;
}

function authenticate(credentials) {
    return axios.post(LOGIN_API, credentials).then(response => response.data.token).
        then(token => {
            window.localStorage.setItem("authToken", token);
 setAxiosToken(token);
          
        
        });



}
function setAxiosToken(token){
    axios.defaults.headers["Authorization"] = "Bearer " + token;
}
function setup(){
    //.1
    const token = window.localStorage.getItem("authToken");
    //.2
    if(token){

        const {exp : expiration}=jwtDecode(token);
        if( expiration * 1000 > new Date().getTime()){
            setAxiosToken(token);
            
        }
    };
    }


export default {
    authenticate,
    logout,
    setup,
    isAuthenticated
};