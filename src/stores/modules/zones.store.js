import {ref} from 'vue'
import {defineStore} from 'pinia'
import zonesService from "@/services/zones.service.js"
import {useNotificationStore} from "@/stores/modules/notifs.store.js";

export const useZonesStore = defineStore('zones', () => {

    const notificationsStore = useNotificationStore()

    // state
    const zones = ref([])
    const myZones = ref([])

    const setZonesState = (newZones) => {
        zones.value = newZones;
    }

    const setMyZonesState = (myNewZones) => {
        myZones.value = myNewZones;
    }

    const addZoneState = (newZone) => {
        zones.value.push(newZone);
    }

    const addMyZoneState = (myZone) => {
        myZones.value.push(myZone);
    }

    const deleteZoneState = (idZone) => {
        zones.value = zones.value.filter(zone => String(zone._id) !== String(idZone));
    }

    const updateZoneState = (updatedZone) => {
        const index = zones.value.findIndex(zone => String(zone._id) === String(updatedZone._id));
        if (index !== -1) {
            zones.value[index] = updatedZone;
        }
    }

    const getZones = async () => {
        try {
            const response = await zonesService.getZones();
            setZonesState(response.data)
            return response.data
        } catch (e) {
            console.error(e)
        }
    }

    const getMyZones = async () => {
        try {
            const response = await zonesService.getMyZones();
            setMyZonesState(response.data)
        } catch (e) {
            console.error(e)
        }
    }

    const createZone = async (data) => {
        try {
            const response = await zonesService.createZone(data);
            addMyZoneState(response.data)
            addZoneState(response.data)
            console.log("response: create" + JSON.stringify(response.data))
            notificationsStore.notify('Zone créée avec succès')
        } catch (e) {
            console.error(e)
            notificationsStore.notify('Échec de la mise à jour de l\'utilisateur', 'error')
        }
    }

    const updateZone = async (idZone, data) => {
        try {
            const response = await zonesService.updateZone(idZone, data);
            updateZoneState(response.data)
            console.log("response update: " + JSON.stringify(response.data))
            notificationsStore.notify('Zone mis à jour')
            return response.data
        } catch (e) {
            console.error(e)
            notificationsStore.notify('Échec de la mise à jour de la zone', 'error')
            return null
        }
    }

    const deleteZone = async (idZone) => {
        try {
            const response = await zonesService.deleteZone(idZone);
            console.log("response delete: " + JSON.stringify(response.data))
            deleteZoneState(response.data._id)
        } catch (e) {
            console.error(e)
        }
    }

    return {
        getZones,
        zones,
        myZones,
        getMyZones,
        createZone,
        updateZone,
        deleteZone
    }
})