import {deleteRequest, getRequest, patchRequest, postRequest, putRequest} from "@/services/axios.service.js";

export async function getZones(){
    let response = null;
    try {
        response = await getZonesFromAPI();
    } catch (err){
        response = {error:1, status:404,data:'erreur réseau, impossible de récuperer les zones'}
    }
    return response;
}

async function getZonesFromAPI() {
    return getRequest("/zones","GET-ZONES")
}

export async function getMyZones(){
    let response = null;
    try {
        response = await getMyZonesFromAPI();
    } catch (err){
        response = {error:1, status:404,data:'erreur réseau, impossible de récuperer les zones de l\'utilisateur courant'}
    }
    return response;
}

async function getMyZonesFromAPI() {
    return getRequest("/zones/me","GET-MY-ZONES")
}

export async function createZone(data) {
    let response = null;
    try {
        response = await createZoneFromAPI(data);
    } catch (err){
        response = {error:1, status:404,data:'erreur réseau, impossible de créer la zone'}
    }
    return response;
}

async function createZoneFromAPI(data) {
    return postRequest("/zones", data,"CREATE-ZONE")
}

export async function deleteZone(idZone){
    let response = null;
    try {
        response = await deleteZoneFromAPI(idZone);
    } catch (err){
        response = {error:1, status:404,data:'erreur réseau, impossible de supprimer la zone'}
    }
    return response;
}

async function deleteZoneFromAPI(idZone) {
    return deleteRequest("/zones/"+idZone,"DELETE-ZONE")
}

export async function updateZone(idZone, data) {
    let response = null;
    try {
        response = await updateZoneFromAPI(idZone, data);
    } catch (err){
        response = {error:1, status:404,data:'erreur réseau, impossible de modifier la zone'}
    }
    return response;
}

async function updateZoneFromAPI(idZone, data) {
    return patchRequest("/zones/" + idZone, data,"UPDATE-ZONES")
}

export default {
    getZones,
    createZone,
    getMyZones,
    deleteZone,
    updateZone
}