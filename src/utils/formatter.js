const ROLES = [
    { label: 'Administrateur', value: 'admin' },
    { label: 'Gestionnaire', value: 'gestionnaire' },
    { label: 'Garde forestier', value: 'garde' },
    { label: 'Services de secours', value: 'sdis' },
    { label: 'Utilisateur', value: 'basic' }
]

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

const formatRole = (roles) => {
    if (!roles || roles.length === 0) {
        return 'Aucun rôle'
    }

    return roles.map(role => {
        const found = ROLES.find(r => r.value === role)
        return found ? found.label : role
    }).join(', ')
}

const DAY = 24 * 60 * 60 * 1000

export {
    formatDate,
    formatType,
    formatRole,
    DAY,
    ROLES
}