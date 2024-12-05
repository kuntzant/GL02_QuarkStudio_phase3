// SPEC2 Affichage pour obtenir la capacité maximale d'une salle

const readline = require('readline');

const colors = require('colors');
const { getRoomCapacity } = require('./logic/roomCapacityLogic');

// Fonction pour demander le numéro de la salle à l'utilisateur
async function promptRoomNumber(rl) {
    console.log("Capacité maximale des salles".inverse);
    const roomNumber = await promptUser("Veuillez entrer le numéro de la salle : ", rl);
    const capacity=getRoomCapacity(roomNumber);
    if (capacity > 0) {
        console.log(`La capacité maximale de la salle ${roomNumber.trim().toUpperCase().brightCyan} est de ${capacity.toString().brightGreen} personnes.`);
    } else {
        console.log("La salle est introuvable ou n'a pas de capacité enregistrée.".red);
    }
}
// Fonction pour poser une question à l'utilisateur et attendre sa réponse
function promptUser(question, rl) {
    return new Promise(resolve => {
        rl.question(question, (answer) => {
            resolve(answer);  
        });
    });
}

module.exports = { promptRoomNumber };