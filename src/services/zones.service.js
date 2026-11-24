import {deleteRequest, getRequest, postRequest, putRequest} from "@/services/axios.service.js";

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

export default {
    getZones,
    createZone,
    getMyZones
}