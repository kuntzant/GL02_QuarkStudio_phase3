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

// COnverti le format minutes en plage horaire
function formatTimeSlot(slot) {
    const startHours = String(Math.floor(slot.start / 60)).padStart(2, '0');
    const startMinutes = String(slot.start % 60).padStart(2, '0');
    const endHours = String(Math.floor(slot.end / 60)).padStart(2, '0');
    const endMinutes = String(slot.end % 60).padStart(2, '0');
    return `${startHours}:${startMinutes}-${endHours}:${endMinutes}`;
}


// Fonction pour obtenir la disponibilité d'une salle
function getRoomAvailability(roomNumber0, data = summary) {
    const openingTime = { start: 8 * 60, end: 20 * 60 }; // 08:00 à 20:00 en minutes
    const roomNumber = roomNumber0.trim().toUpperCase();
    const occupiedSlots = {};

    // Parcours des sessions pour trouver les créneaux occupés
    for (const courseName in data) {
        const course = data[courseName];
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

    if (Object.keys(occupiedSlots).length === 0) {
        return {}; // La salle n'existe pas ou n'a pas de sessions
    }

    const weekDays = ['L', 'MA', 'ME', 'J', 'V', 'S'];
    const availability = {};

    weekDays.forEach(day => {
        let freeSlots = [{ start: openingTime.start, end: openingTime.end }];
        const occupied = occupiedSlots[day] || [];

        occupied.forEach(occupiedSlot => {
            freeSlots = freeSlots.flatMap(slot => {
                if (occupiedSlot.end <= slot.start || occupiedSlot.start >= slot.end) {
                    return [slot]; // Pas de chevauchement
                } else if (occupiedSlot.start <= slot.start && occupiedSlot.end >= slot.end) {
                    return []; // Le créneau occupé couvre entièrement le créneau libre
                } else if (occupiedSlot.start > slot.start && occupiedSlot.end < slot.end) {
                    return [
                        { start: slot.start, end: occupiedSlot.start },
                        { start: occupiedSlot.end, end: slot.end }
                    ];
                } else if (occupiedSlot.start <= slot.start && occupiedSlot.end < slot.end) {
                    return [{ start: occupiedSlot.end, end: slot.end }];
                } else if (occupiedSlot.start > slot.start && occupiedSlot.end >= slot.end) {
                    return [{ start: slot.start, end: occupiedSlot.start }];
                }
            });
        });

        if (freeSlots.length > 0) {
            availability[day] = freeSlots.map(slot => formatTimeSlot(slot));
        }
    });

    return availability;
}

module.exports = { getRoomAvailability };