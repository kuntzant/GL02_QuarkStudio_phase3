//SPEC 3- Affichage pour obtenir la disponibilité d'une salle

const readline = require('readline');
const colors = require('colors');
const { getRoomAvailability } = require('./logic/roomAvailabilityLogic');

// Fonction pour demander la disponibilité d'une salle à l'utilisateur
async function promptRoomAvailability(rl) {
    console.log("Disponibilités des salles".inverse);
    const roomNumber = await promptUser("Veuillez entrer le numéro de la salle : ", rl);
    const availability = getRoomAvailability(roomNumber.trim().toUpperCase());

    const weekOrder = ['L', 'MA', 'ME', 'J', 'V', 'S', 'D'];
    const letterForDay = { // Pour l'affichage
        "L": "Lundi",
        "MA": "Mardi",
        "ME": "Mercredi",
        "J": "Jeudi",
        "V": "Vendredi",
        "S": "Samedi",
        "D": "Dimanche"
    };

    if (Object.keys(availability).length === 0) {
        console.log("La salle est introuvable ou n'a aucune disponibilité.".red);
    } else {
        console.log("Disponibilités de la salle " + roomNumber.toUpperCase().brightCyan + " :");
        for (const day of weekOrder) {     // Pour parcourir dans l'ordre de la semaine
            if (availability[day]) { 
                const slots = availability[day].map(slot => slot.brightMagenta);
                console.log(`${letterForDay[day].brightYellow}: ${slots.join(', ')}`);
            }
        }
    }
}



// Fonction pour demander une entrée utilisateur
function promptUser(question, rl) {
    return new Promise(resolve => {
        rl.question(question, (answer) => {
            resolve(answer);  
        });
    });
}

module.exports = { promptRoomAvailability };