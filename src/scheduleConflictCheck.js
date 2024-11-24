const { processCruData } = require('./controller');
const path = require('path');
const colors = require('colors');

// Charge les données summary
const rootPath = path.resolve(__dirname, '../data');
const summary = processCruData(rootPath);

// Convertis les horaires en minutes
function parseTimeRange(timeRange) {
    const [start, end] = timeRange.split('-').map(time => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    });
    return { start, end };
}

function detectConflicts(data) {
    const conflicts = [];
    const roomSchedules = {};

    for (const courseName in data) {
        const course = data[courseName];
        course.cours.forEach(session => {
            const { room, day, time } = session;

            // Ignorer les sessions avec des données manquantes (genre SD11 qui a pas de salle)
            if (!room || !day || !time) { 
                console.warn("Session mal formattée:", courseName, session);
                return; 
            }

            // Convertis les horaires en minutes
            const { start, end } = parseTimeRange(time);
            
             // Initialise les structures nécessaires pour la salle et le jour
            if (!roomSchedules[room]) {
                roomSchedules[room] = {}; // Initialise pour une nouvelle salle
            }
            if (!roomSchedules[room][day]) {
                roomSchedules[room][day] = []; // Initialise pour un nouveau jour d'une salle
            }
            
            // Vérifie les conflits avec les sessions existantes pour la salle et le jour
            roomSchedules[room][day].forEach(existing => {
                if (start < existing.end && end > existing.start) // Conflit détecté
                {
                    const conflict = {
                        room,
                        day,
                        conflict: [
                            { time: session.time, course: courseName },
                            { time: existing.time, course: existing.course }
                        ]
                    };
                    conflicts.push(conflict);
                }
            });

            // Ajoute la session actuelle pour la salle et le jour
            roomSchedules[room][day].push({ start, end, time, course: courseName });
        });
    }
    return conflicts;
}

function displayConflicts(conflicts) {
    if (conflicts.length === 0) {
        console.log("Aucun conflit détecté.".green);
    } else {
        console.log("Conflits détectés :".red);
        conflicts.forEach(({room, day, conflict }) => {
            console.log(`Conflit dans la salle ${room} le ${day} :`);
            conflict.forEach(({ time, course }) => {
                console.log(` - ${course} à ${time}`.green);
            });
        });
    }
    return;
}

const conflicts = detectConflicts(summary);
displayConflicts(conflicts);

