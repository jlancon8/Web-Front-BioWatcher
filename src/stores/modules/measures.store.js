import {ref} from 'vue'
import {defineStore} from 'pinia'
import measuresService from "@/services/measures.service.js"

export const useMeasuresStore = defineStore('measures', () => {
    // state
    const measures = ref([])
    const latestMeasures = ref([])
    const measuresStats = ref([])
    const measuresChartData = ref([])
    const measuresHistory = ref([])

    const setMeasuresState = (newMeasures) => {
        measures.value = newMeasures
    }

    const setMeasuresHistoryState = (newMeasuresHistory) => {
        measuresHistory.value = newMeasuresHistory
    }

    const setLatestMeasuresState = (newMeasures) => {
        latestMeasures.value = newMeasures
    }

    const setMeasuresStats = (newStats) => {
        measuresStats.value = newStats
    }

    const setMeasuresChartData = (newChartData) => {
        measuresChartData.value = newChartData
    }

    const getMeasures = async () => {
        try {
            const response = await measuresService.getMeasures();
            setMeasuresState(response.data)
        } catch (e) {
            console.error(e)
        }
    }

    const getMeasureById = (id) => {
        return measures.value.find(measure => String(measure._id) === String(id));
    }

    const getLatestMeasures = async () => {
        try {
            const response = await measuresService.getLatestMeasures();
            setLatestMeasuresState(response.data)
        } catch (e) {
            console.error(e)
        }
    }

    const getMeasuresHistory = async (moduleId, type, from, page = 1, limit = 5) => {
        try {
            const response = await measuresService.getMeasuresHistory(moduleId, type, from, page, limit);
            setMeasuresHistoryState(response.data)
            return response.data
        } catch (e) {
            console.error(e)
            return null
        }
    }

    const getMeasuresStats = async (moduleId, type, from, to) => {
        try {
            const response = await measuresService.getMeasuresStats(moduleId, type, from, to);
            setMeasuresStats(response.data)
        } catch (e) {
            console.error(e)
            return null
        }
    }

    const getMeasuresChartData = async (moduleId, type, from, to) => {
        try {
            const response = await measuresService.getMeasuresChartData(moduleId, type, from, to)
            console.log("response:", JSON.stringify(response.data));
            setMeasuresChartData(response.data)
        } catch (e) {
            console.error(e)
            measuresChartData.value = []
        }
    }

    return {
        getMeasures,
        getLatestMeasures,
        getMeasureById,
        getMeasuresStats,
        measuresStats,
        latestMeasures,
        measuresChartData,
        getMeasuresChartData,
        measures,
        measuresHistory,
        getMeasuresHistory
    }
})