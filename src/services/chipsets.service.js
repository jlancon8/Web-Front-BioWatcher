import {deleteRequest, getRequest, postRequest, putRequest} from "@/services/axios.service.js";

export async function getChipsets(){
    let response = null;
    try {
        response = await getChipsetsFromAPI();
    } catch (err){
        response = {error:1, status:404,data:'erreur réseau, impossible de récupérer les chipsets'}
    }
    return response;
}

async function getChipsetsFromAPI() {
    return getRequest("/chipsets","GET-CHIPSETS")
}

export default {
    getChipsets
}