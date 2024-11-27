//SPEC 3
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

function getRoomAvailability(roomNumber) {
    let roomFound = false;
    const availability = [];

    for (const courseName in summary) {
        const course = summary[courseName];
        course.cours.forEach(session => {
            if (session.room === roomNumber) {
                roomFound = true;
                availability.push(`${session.day} ${session.time}`);
            }
        });
    }

    if (!roomFound) {
        console.log("La salle est introuvable. Veuillez vérifier le numéro de la salle.".red);
    } else if (availability.length === 0) {
        console.log("La salle demandée n'est jamais libre.".yellow);
    } else {
        console.log("Disponibilités de la salle " + roomNumber.brightCyan + " :");
        console.log(availability.join('\n').brightCyan);
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