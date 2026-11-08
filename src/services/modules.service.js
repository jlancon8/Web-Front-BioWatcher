import {deleteRequest, getRequest, patchRequest, postRequest, putRequest} from "@/services/axios.service.js";

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
    return getRequest("/modules","GET-MODULES")
}

export async function deleteModule(idModule){
    let response = null;
    try {
        response = await deleteModuleFromAPI(idModule);
    } catch (err){
        response = {error:1, status:404,data:'erreur réseau, impossible de supprimer le module'}
    }
    return response;
}

async function deleteModuleFromAPI(idModule) {
    return deleteRequest("/modules/"+idModule,"DELETE-MODULE")
}

export async function editModule(idModule, data){
    let response = null;
    try {
        response = await editModuleFromAPI(idModule, data);
    } catch (err){
        response = {error:1, status:404,data:'erreur réseau, impossible de modifier le module'}
    }
    return response;
}

async function editModuleFromAPI(idModule, data) {
    return patchRequest("/modules", {idModule, data}, "EDIT-MODULE")
}

export default {
    getModules,
    deleteModule,
    editModule
}