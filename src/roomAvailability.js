const { processCruData } = require('./controller');
const readline = require('readline');
const path = require('path');
const colors = require('colors');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const rootPath = path.resolve(__dirname, '../data'); 
const summary = processCruData(rootPath);

function parseTimeRange(timeRange) {
    const [start, end] = timeRange.split('-').map(time => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    });
    return { start, end };
}

function getRoomAvailability(roomNumber) {
    const openingTime = parseTimeRange("08:00-18:00"); 
    // On collecte quand la salle en question est occupé 
    const occupiedSlots = {};

    for (const courseName in summary) {
        const course = summary[courseName];
        course.cours.forEach(session => {
            if (session.room === roomNumber) {
                const day = session.day;
                const sessionTime = parseTimeRange(session.time);
                if (!occupiedSlots[day]) {
                    occupiedSlots[day] = [];
                }
                occupiedSlots[day].push(sessionTime);
            }
        });
    }

    // On soustrait les créneaux occupés au créneaux d'ouverture
    const availability = {};

    for (const day in occupiedSlots) {
        let freeSlots = [{ start: openingTime.start, end: openingTime.end }];
        occupiedSlots[day].forEach(occupied => {
            freeSlots = freeSlots.flatMap(slot => {
                if (occupied.start >= slot.end || occupied.end <= slot.start) {
                    return [slot];
                } else if (occupied.start <= slot.start && occupied.end >= slot.end) {
                    return [];
                } else if (occupied.start > slot.start && occupied.end < slot.end) {
                    return [
                        { start: slot.start, end: occupied.start },
                        { start: occupied.end, end: slot.end }
                    ];
                } else if (occupied.start <= slot.start) {
                    return [{ start: occupied.end, end: slot.end }];
                } else {
                    return [{ start: slot.start, end: occupied.start }];
                }
            });
        });
        availability[day] = freeSlots;
    }

    const weekOrder = ['L', 'MA', 'ME', 'J', 'V', 'S'];

    // Affichage en mode MA: 08:00-10:00, 12:00-14:00
    if (Object.keys(availability).length === 0) {
        console.log("La salle est introuvable ou n'a aucune disponibilité.".red);
    } else {
        console.log("Disponibilités de la salle " + roomNumber.brightCyan + " :");
        for (const day of weekOrder) {     // Pour parcourir dans l'ordre de la semaine
            if (availability[day]) { 
            const slots = availability[day].map(slot => {
                const startHours = String(Math.floor(slot.start / 60)).padStart(2, '0');
                const startMinutes = String(slot.start % 60).padStart(2, '0');
                const endHours = String(Math.floor(slot.end / 60)).padStart(2, '0');
                const endMinutes = String(slot.end % 60).padStart(2, '0');
                return `${startHours}:${startMinutes}-${endHours}:${endMinutes}`.magenta;
            });
            console.log(`${day.gray}: ${slots.join(', ')}`);
            }
        }
    }
}

function promptRoomAvailability() {
    rl.question("Veuillez entrer le numéro de la salle : ", (roomNumber) => {
        getRoomAvailability(roomNumber.toUpperCase());
        rl.close();
    });
}

console.log("Disponibilités des salles".inverse);
promptRoomAvailability();