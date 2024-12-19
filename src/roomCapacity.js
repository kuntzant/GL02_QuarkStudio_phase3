// SPEC2 Affichage pour obtenir la capacité maximale d'une salle

const readline = require('readline');

const colors = require('colors');
const { getRoomCapacity } = require('./logic/roomCapacityLogic');

// Fonction pour demander le numéro de la salle à l'utilisateur
async function promptRoomNumber(rl) {
    console.log("Capacité maximale des salles".inverse);
	console.log("Rooms' maximum capacity".inverse);
    const roomNumber = await promptUser("Veuillez entrer le numéro de la salle : \nPlease enter the room number : ", rl);
    const capacity=getRoomCapacity(roomNumber);
    if (capacity > 0) {
        console.log(`La capacité maximale de la salle ${roomNumber.trim().toUpperCase().brightCyan} est de ${capacity.toString().brightGreen} personnes.`);
		console.log(`The maximum capacity of room ${roomNumber.trim().toUpperCase().brightCyan} is of ${capacity.toString().brightGreen} people.`);
    } else {
        console.log("La salle est introuvable ou n'a pas de capacité enregistrée.".red);
		console.log("The room couldn't be found or has no registered capacity.".red);
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