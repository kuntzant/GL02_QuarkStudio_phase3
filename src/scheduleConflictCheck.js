const { processCruData } = require('./controller');
const readline = require('readline');
const path = require('path');
const colors = require('colors');

/*const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});*/

const rootPath = path.resolve(__dirname, '../data'); // Dossier contenant les sous-dossiers .cru
const summary = processCruData(rootPath);

function parseTimeRange(timeRange) {
    const [start, end] = timeRange.split('-').map(time => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes; // Convertir en minutes pour comparaison
    });
    return { start, end };
}

function detectConflicts(summary) {
    const conflicts = [];

    for (const courseName in summary) {
        const course = summary[courseName];

        // Grouper par salle
        const roomSchedules = {};
        course.cours.forEach(session => {
            const { room, day, time } = session;
            const key = `${room}-${day}`;

            if (!roomSchedules[key]) {
                roomSchedules[key] = [];
            }
            roomSchedules[key].push({ time, courseName });
        });

        // Détecter les conflits dans chaque salle
        for (const roomDayKey in roomSchedules) {
            const sessions = roomSchedules[roomDayKey];
            const parsedSessions = sessions.map(session => ({
                ...session,
                ...parseTimeRange(session.time)
            }));
        
            // Vérifier les chevauchements
            for (let i = 0; i < parsedSessions.length; i++) {
                for (let j = i + 1; j < parsedSessions.length; j++) {
                    const session1 = parsedSessions[i];
                    const session2 = parsedSessions[j];

                    if (
                        (session1.start < session2.end && session1.end > session2.start) ||
                        (session2.start < session1.end && session2.end > session1.start)
                    ) {
                        conflicts.push({
                            room: roomDayKey.split('-')[0],
                            day: roomDayKey.split('-')[1],
                            sessions: [session1, session2]
                        });
                    }
                }
            }
        }
    }
    return conflicts;
}

function generateConflictReport(conflicts) {
    if (conflicts.length === 0) {
        console.log('Aucun conflit détecté.');
        return;
    }

    console.log('Conflits détectés :');
    conflicts.forEach(conflict => {
        console.log(`Salle : ${conflict.room}, Jour : ${conflict.day}`);
        conflict.sessions.forEach(session => {
            console.log(`  - Cours : ${session.courseName}, Horaire : ${session.time}`);
        });
        console.log('---');
    });
}

// Exécution principale
const conflicts = detectConflicts(summary);
generateConflictReport(conflicts);