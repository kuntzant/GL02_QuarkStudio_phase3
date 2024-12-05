//SPEC 6
const readline = require('readline');
const colors = require('colors');
const { detectConflicts } = require('./logic/scheduleConflictCheckLogic');


// Fonction pour vérifier les conflits d'emploi du temps et afficher les résultats
async function promptScheduleConflictCheck(rl) {
    console.log("Vérification des conflits d'emploi du temps".inverse);
    const { conflicts, malformedSessions } = detectConflicts();
    const letterForDay = {
        "L": "Lundi",
        "MA": "Mardi",
        "ME": "Mercredi",
        "J": "Jeudi",
        "V": "Vendredi",
        "S": "Samedi",
        "D": "Dimanche"
    };

    if (conflicts.length === 0) {
        console.log("Aucun conflit détecté.".green);
    } else {
        if (malformedSessions.length !== 0) {
            malformedSessions.forEach(({ courseName, session }) => {
                console.warn("Session mal formattée:".yellow + '\n', courseName.cyan, session);
            });
        }
        console.log("Conflits détectés :".red);
        conflicts.forEach(({ room, day, conflict }) => {
            console.log(`Conflit dans la salle ${room.brightCyan} le ${letterForDay[day].brightYellow} :`);
            conflict.forEach(({ time, course }) => {
                console.log(` - ${course.cyan} à ${time.brightMagenta}`);
            });
        });
    }
}

module.exports = { promptScheduleConflictCheck };
