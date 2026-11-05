import {deleteRequest, getRequest, postRequest, putRequest} from "@/services/axios.service.js";

export async function getModules(){
    let response = null;
    try {
        response = await getModulesFromAPI();
    } catch (err){
        response = {error:1, status:404,data:'erreur réseau, impossible de récupérer les modules'}
    }
    return response;
}

async function getModulesFromAPI() {
    return getRequest("/module/get","GET-MODULES")
}

export default {
    getModules
}