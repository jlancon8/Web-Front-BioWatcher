import {getRequest, postRequest} from "@/services/axios.service.js";

export async function login(credentials){
    let response = null;
    try {
        response = await loginFromAPI(credentials);
    } catch (err){
        response = {error:1, status:404,data:'erreur réseau, impossible de se connecter'}
    }
    return response;
}

async function loginFromAPI(credentials) {
    return postRequest("/auth/signin",credentials, 'LOGIN')
}

export async function logout(){
    let response = null;
    try {
        response = await logoutFromAPI();
    } catch (err){
        response = {error:1, status:404,data:'erreur réseau, impossible de se déconnecter'}
    }
    return response;
}

async function logoutFromAPI() {
    return postRequest("/auth/signout",{}, 'LOGOUT')
}

export async function getCurrentUser(){
    let response = null;
    try {
        response = await getCurrentUserFromAPI();
    } catch (err){
        response = {error:1, status:404,data:'erreur réseau, impossible de récupérer l\'utilisateur courant'}
    }
    return response;
}

async function getCurrentUserFromAPI() {
    return getRequest("/auth/currentuser", 'GET_CURRENT_USER')
}

export default {
    login,
    logout,
    getCurrentUser
}