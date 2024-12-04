// SPEC3 - Logique pour obtenir la disponibilité d'une salle
const { processCruData } = require('../controller');
const path = require('path');

// Chemin racine des données et ajout des données CRU
const rootPath = path.resolve(__dirname, '../../data');
const summary = processCruData(rootPath);

// Fonction pour analyser une plage horaire
function parseTimeRange(timeRange) {
    const [start, end] = timeRange.split('-').map(time => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    });
    return { start, end };
}

// Fonction pour obtenir la disponibilité d'une salle
function getRoomAvailability(roomNumber) {
    const openingTime = { start: 8 * 60, end: 20 * 60 }; // 8h00 à 20h00 en minutes
    const occupiedSlots = {};
    const availability = {};

    for (const courseName in summary) {
        const course = summary[courseName];
        course.cours.forEach(session => {
            if (session.room === roomNumber) {
                const { start, end } = parseTimeRange(session.time);
                const day = session.day;
                if (!occupiedSlots[day]) {
                    occupiedSlots[day] = [];
                }
                occupiedSlots[day].push({ start, end });
            }
        });
    }

    // Si il n'y a pas de crénaux, la salle n'existe pas
    if (!Object.keys(occupiedSlots).length > 0) {
        return {};
    } else {

        // Si y a pas de cours le samedi la salle est libre toute la journée
        if (!occupiedSlots["S"]) {
            occupiedSlots["S"] = [];
        }

        for (const day in occupiedSlots) {
            let freeSlots = [{ start: openingTime.start, end: openingTime.end }];
            occupiedSlots[day].forEach(occupied => {
                freeSlots = freeSlots.flatMap(slot => {
                    if (occupied.end <= slot.start || occupied.start >= slot.end) {
                        return [slot]; // Pas de chevauchement
                    } else if (occupied.start <= slot.start && occupied.end >= slot.end) {
                        return []; // Le créneau occupé couvre entièrement le créneau libre
                    } else if (occupied.start > slot.start && occupied.end < slot.end) {
                        return [
                            { start: slot.start, end: occupied.start },
                            { start: occupied.end, end: slot.end }
                        ]; // Le créneau occupé est à l'intérieur du créneau libre
                    } else if (occupied.start <= slot.start && occupied.end < slot.end) {
                        return [{ start: occupied.end, end: slot.end }]; // Le créneau occupé commence avant et se termine pendant le créneau libre
                    } else if (occupied.start > slot.start && occupied.end >= slot.end) {
                        return [{ start: slot.start, end: occupied.start }]; // Le créneau occupé commence pendant et se termine après le créneau libre
                    }
                });
            });
            availability[day] = freeSlots;
        }

        return availability;
    }
}

module.exports = { getRoomAvailability };