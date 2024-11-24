const { processCruData } = require('./controller');
const path = require('path');

// Charger les données summary
const rootPath = path.resolve(__dirname, '../data');
const summary = processCruData(rootPath);

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

            if (!room || !day || !time) {
                console.warn("Session mal formattée:", courseName, session);
                return; // Ignorer les sessions avec des données manquantes
            }

            const { start, end } = parseTimeRange(time);
            
            // Initialiser la structure pour une salle donnée si nécessaire
            /*if (!roomSchedules[room]) {
                roomSchedules[room] = {};
            }
            if (!roomSchedules[room][day]) {
                roomSchedules[room][day] = [];
            }*/
           
            // Vérifier les conflits avec les sessions existantes pour la salle et le jour
            roomSchedules[room][day].forEach(existing => {
                if (
                    (start < existing.end && end > existing.start) // Chevauchement détecté
                ) {
                    conflicts.push({
                        room,
                        day,
                        conflict: [
                            { time: session.time, course: courseName },
                            { time: existing.time, course: existing.course }
                        ]
                    });
                }
            });

            // Ajouter la session actuelle pour la salle et le jour
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
            console.log(
                `Conflit dans la salle ${room} le ${day} :`.brightCyan
            );
            conflict.forEach(({ time, course }) => {
                console.log(` - ${course} à ${time}`.yellow);
            });
        });
    }
    return;
}

const conflicts = detectConflicts(summary);
displayConflicts(conflicts);

