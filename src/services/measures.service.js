import {deleteRequest, getRequest, postRequest, putRequest} from "@/services/axios.service.js";

export async function getMeasures() {
    let response = null;
    try {
        response = await getMeasuresFromAPI();
    } catch (err) {
        response = {error: 1, status: 404, data: 'erreur réseau, impossible de récupérer les mesures'}
    }
    return response;
}

async function getMeasuresFromAPI() {
    return getRequest("/measures", "GET-MEASURES")
}

export async function getMeasuresHistory(moduleId, type, from, page, limit) {
    let response = null;
    try {
        response = await getMeasuresHistoryFromAPI(moduleId, type, from, page, limit);
    } catch (err) {
        response = {error: 1, status: 404, data: 'erreur réseau, impossible de récupérer l\'historique des mesures'}
    }
    return response;
}

async function getMeasuresHistoryFromAPI(moduleId, type, from, page, limit) {
    return getRequest(
        `/measures/history?moduleId=${moduleId}&type=${type}&from=${from}&page=${page}&limit=${limit}`,
        "GET-MEASURES-HISTORY"
    )
}

export async function getLatestMeasures() {
    let response = null;
    try {
        response = await getLatestMeasuresFromAPI();
    } catch (err) {
        response = {error: 1, status: 404, data: 'erreur réseau, impossible de récupérer les dernières mesures'}
    }
    return response;
}

async function getLatestMeasuresFromAPI() {
    return getRequest("/measures/latest", "GET-LATEST-MEASURES")
}

export async function getMeasuresStats(moduleId, type, from, to) {
    let response = null;
    try {
        response = await getMeasuresStatsFromAPI(moduleId, type, from, to);
    } catch (err) {
        response = {error: 1, status: 404, data: 'erreur réseau, impossible de récupérer les statistiques'}
    }
    return response;
}

async function getMeasuresStatsFromAPI(moduleId, type, from, to) {
    return getRequest(`/measures/stats?module=${moduleId}&type=${type}&from=${from}&to=${to}`, "GET-MEASURES-STATS")
}

export async function getMeasuresChartData(moduleId, type, from, to) {
    let response = null;
    try {
        response = await getMeasuresChartDataFromAPI(moduleId, type, from, to);
    } catch (err) {
        response = {error: 1, status: 404, data: 'erreur réseau, impossible de récupérer les données du graphique'}
    }
    return response;
}

async function getMeasuresChartDataFromAPI(moduleId, type, from, to) {
    return getRequest(`/measures/chartdata?module=${moduleId}&type=${type}&from=${from}&to=${to}`, "GET-MEASURES-CHART-DATA")
}

export default {
    getMeasures,
    getLatestMeasures,
    getMeasuresStats,
    getMeasuresChartData,
    getMeasuresHistory
}