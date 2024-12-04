// SPEC4 - Logique pour obtenir les salles libres pour un créneau donné
const { processCruData } = require('../controller');
const path = require('path');

// Chemin racine des données et ajout des données CRU
const rootPath = path.resolve(__dirname, '../../data'); 
const summary = processCruData(rootPath);

// Fonction pour analyser une plage horaire
function parseTimeRange(timeRange) {
    const [startTime, endTime] = timeRange.split('-').map(time => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    });
    return { start: startTime, end: endTime };
}

// Fonction pour valider le jour
function isValidDay(day) {
    const validDays = ['L', 'MA', 'ME', 'J', 'V', 'S', 'D'];
    return validDays.includes(day.toUpperCase());
}

// Fonction pour valider la plage horaire
function isValidTimeRange(timeRange) {
    const timeRegex = /^([01]?\d|2[0-3]):([0-5]\d)-([01]?\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(timeRange)) {
        return false;
    }
    const { start, end } = parseTimeRange(timeRange);
    return end > start;
}

// Fonction pour obtenir les salles disponibles pour un jour et une plage horaire donnés
function getAvailableRooms(day, timeRange) {
    const requestedSlot = parseTimeRange(timeRange);
    const occupiedRooms = new Set();

    for (const courseName in summary) {
        const course = summary[courseName];
        course.cours.forEach(session => {
            if (session.day === day) {
                const sessionSlot = parseTimeRange(session.time);
                // Vérifier le chevauchement des créneaux horaires
                if (requestedSlot.start < sessionSlot.end && requestedSlot.end > sessionSlot.start) {
                    occupiedRooms.add(session.room);
                }
            }
        });
    }

    // Obtenir la liste de toutes les salles
    const allRooms = new Set();
    for (const courseName in summary) {
        const course = summary[courseName];
        course.rooms.forEach(room => {
            allRooms.add(room);
        });
    }

    // Les salles disponibles sont celles qui ne sont pas occupées
    const availableRooms = Array.from(allRooms).filter(room => !occupiedRooms.has(room));

    return availableRooms;
}

module.exports = { getAvailableRooms, isValidDay, isValidTimeRange };