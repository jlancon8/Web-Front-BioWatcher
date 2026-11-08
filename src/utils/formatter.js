const formatDate = (date) => {
    return new Date(date).toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const formatType = (value, type) => {
    const units = {
        temperature: '°C',
        humidity: '%',
        pm25: 'µg/m³'
    }

    if (type === null) {
        return `${Number(value).toFixed(2)}`
    }

    return `${Number(value).toFixed(2)} ${units[type] ?? ''}`
}

export {
    formatDate,
    formatType
}