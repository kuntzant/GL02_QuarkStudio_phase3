// SPEC2
const { processCruData } = require('./controller');
const readline = require('readline');
const path = require('path');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

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
        console.log("La salle est introuvable. Veuillez vérifier le numéro de la salle.");
    } else {
        console.log(`La salle ${roomNumber} peut accueillir jusqu'à ${maxCapacity} personnes.`);
    }
}

function promptRoomNumber() {
    rl.question("Veuillez entrer le numéro de la salle : ", (roomNumber) => {
        getRoomCapacity(roomNumber);
        rl.close();
    });
}

console.log("Capacité maximale des salles");
promptRoomNumber();