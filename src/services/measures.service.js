import {deleteRequest, getRequest, postRequest, putRequest} from "@/services/axios.service.js";

export async function getMeasures(){
    let response = null;
    try {
        response = await getMeasuresFromAPI();
    } catch (err){
        response = {error:1, status:404,data:'erreur réseau, impossible de récupérer les mesures'}
    }
    return response;
}

async function getMeasuresFromAPI() {
    return getRequest("/measure/get","GET-MEASURES")
}

export async function getLatestMeasures(){
    let response = null;
    try {
        response = await getLatestMeasuresFromAPI();
    } catch (err){
        response = {error:1, status:404,data:'erreur réseau, impossible de récupérer les dernières mesures'}
    }
    return response;
}

async function getLatestMeasuresFromAPI() {
    return getRequest("/measure/getlatest","GET-LATEST-MEASURES")
}

export default {
    getMeasures,
    getLatestMeasures
}