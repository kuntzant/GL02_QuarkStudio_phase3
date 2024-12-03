//SPEC 3- Affichage pour obtenir la disponibilité d'une salle

const readline = require('readline');
const colors = require('colors');
const { getRoomAvailability } = require('./roomAvailabilityLogic');

// Fonction pour demander la disponibilité d'une salle à l'utilisateur
async function promptRoomAvailability(rl) {
    console.log("Disponibilités des salles".inverse);
    const roomNumber = await promptUser("Veuillez entrer le numéro de la salle : ", rl);
    const availability = getRoomAvailability(roomNumber);

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
        console.log(`Disponibilités pour la salle ${roomNumber.brightCyan} :`);
        weekOrder.forEach(day => {
            if (availability[day]) {
                console.log(`\n${letterForDay[day].brightYellow} :`);
                availability[day].forEach(slot => {
                    const startHour = String(Math.floor(slot.start / 60)).padStart(2, '0');
                    const startMinute = String(slot.start % 60).padStart(2, '0');
                    const endHour = String(Math.floor(slot.end / 60)).padStart(2, '0');
                    const endMinute = String(slot.end % 60).padStart(2, '0');
                    console.log(` - ${startHour}:${startMinute} - ${endHour}:${endMinute}`.brightGreen);
                });
            }
        });
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