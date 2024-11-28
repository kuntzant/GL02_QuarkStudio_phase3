// SPEC2
const { processCruData } = require('./controller');
const readline = require('readline');
const path = require('path');
const colors = require('colors');


const rootPath = path.resolve(__dirname, '../data'); // Dossier contenant les sous-dossiers .cru
const summary = processCruData(rootPath);

function getRoomCapacity(roomNumber) {
    let maxCapacity = 0;
    let roomFound = false;

    for (const courseName in summary) {
        const course = summary[courseName];
        course.cours.forEach(session => {
            if (session.room === roomNumber) {
                roomFound = true;
                maxCapacity = Math.max(maxCapacity, session.participants);
            }
        });
    }

    if (!roomFound) {
        console.log("La salle est introuvable. Veuillez vérifier le numéro de la salle.".red);
    } else {
        console.log("La salle " + roomNumber.brightCyan + " peut accueillir jusqu'à " + maxCapacity.toString().green + " personnes.");
    }
}

async function promptRoomNumber(rl) {
    console.log("Capacité maximale des salles".inverse);
    const roomNumber = await promptUser("Veuillez entrer le numéro de la salle : ", rl);
    getRoomCapacity(roomNumber.toUpperCase());

}

function promptUser(question, rl) {
    return new Promise(resolve => {
        rl.question(question, (answer) => {
            resolve(answer);  // Résoudre la promesse après la réponse de l'utilisateur
        });
    });
}

module.exports = { promptRoomNumber };