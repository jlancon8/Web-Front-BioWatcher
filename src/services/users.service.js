import {deleteRequest, getRequest, patchRequest, postRequest, putRequest} from "@/services/axios.service.js";

export async function getUsers(){
    let response = null;
    try {
        response = await getUsersFromAPI();
    } catch (err){
        response = {error:1, status:404,data:'erreur réseau, impossible de récupérer les comptes'}
    }
    return response;
}

async function getUsersFromAPI() {
    return getRequest("/users","GET-USERS")
}

export async function updateUser(idUser, data) {
    let response = null;
    try {
        response = await updateUsersFromAPI(idUser, data);
    } catch (err){
        response = {error:1, status:404,data:'erreur réseau, impossible de modifier le compte'}
    }
    return response;
}

async function updateUsersFromAPI(idUser, data) {
    return patchRequest("/users", {idUser, data},"UPDATE-USERS")
}

export async function createUser(data) {
    let response = null;
    try {
        response = await createUserFromAPI(data);
    } catch (err){
        response = {error:1, status:404,data:'erreur réseau, impossible de créer le compte'}
    }
    return response;
}

async function createUserFromAPI(data) {
    return postRequest("/users", data,"CREATE-USER")
}

export async function deleteUser(idUser){
    let response = null;
    try {
        response = await deleteUserFromAPI(idUser);
    } catch (err){
        response = {error:1, status:404,data:'erreur réseau, impossible de supprimer le compte'}
    }
    return response;
}

async function deleteUserFromAPI(idUser) {
    return deleteRequest("/users/"+idUser,"DELETE-USER")
}

export default {
    getUsers,
    updateUser,
    createUser,
    deleteUser
}