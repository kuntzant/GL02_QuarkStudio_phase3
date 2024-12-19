//SPEC 6
const readline = require('readline');
const colors = require('colors');
const { detectConflicts } = require('./logic/scheduleConflictCheckLogic');


// Fonction pour vérifier les conflits d'emploi du temps et afficher les résultats
async function promptScheduleConflictCheck(rl) {
    console.log("Vérification des conflits d'emploi du temps".inverse);
	console.log("Checking schedule conflicts".inverse);
    const { conflicts, malformedSessions } = detectConflicts();
    const letterForDay = {
        "L": "Lundi",
        "MA": "Mardi",
        "ME": "Mercredi",
        "J": "Jeudi",
        "V": "Vendredi",
        "S": "Samedi"
    };
	const letterForDayE = {
		"L": "Monday",
		"MA": "Tuesday",
		"ME": "Wednesday",
		"J": "Thursday",
		"V": "Friday",
		"S": "Saturday"
	};

    if (conflicts.length === 0) {
        console.log("Aucun conflit détecté.".green);
		console.log("No conflict detected.".green);
    } else {
        if (malformedSessions.length !== 0) {
            malformedSessions.forEach(({ courseName, session }) => {
                console.warn("Session mal formattée:".yellow + "\nWrong session format:".yellow + "\n", courseName.cyan, session);
            });
        }
        console.log("Conflits détectés :".red);
		console.log("Conflicts detected :".red);
        conflicts.forEach(({ room, day, conflict }) => {
            console.log(`Conflit dans la salle ${room.brightCyan} le ${letterForDay[day].brightYellow} :`);
			console.log(`Conflict on room ${room.brightCyan} on ${letterForDayE[day].brightYellow} :`);
            conflict.forEach(({ time, course }) => {
                console.log(` - ${course.cyan} à ${time.brightMagenta}`);
            });
        });
    }
}

module.exports = { promptScheduleConflictCheck };
