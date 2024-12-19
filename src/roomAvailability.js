//SPEC 3- Affichage pour obtenir la disponibilité d'une salle

const readline = require('readline');
const colors = require('colors');
const { getRoomAvailability } = require('./logic/roomAvailabilityLogic');

// Fonction pour demander la disponibilité d'une salle à l'utilisateur
async function promptRoomAvailability(rl) {
    console.log("Disponibilités des salles".inverse);
	console.log("Rooms' availability".inverse);
    const roomNumber = await promptUser("Veuillez entrer le numéro de la salle : \nPlease enter the room number : ", rl);
    const availability = getRoomAvailability(roomNumber.trim().toUpperCase());

    const weekOrder = ['L', 'MA', 'ME', 'J', 'V', 'S'];
    const letterForDay = { // Pour l'affichage
        "L": "Lundi",
        "MA": "Mardi",
        "ME": "Mercredi",
        "J": "Jeudi",
        "V": "Vendredi",
        "S": "Samedi",
    };
	const letterForDayE = {
        "L": "Monday",
        "MA": "Tuesday",
		"ME": "Wednesday",
		"J": "Thursday",
		"V": "Friday",
		"S": "Saturday"
	};

    if (Object.keys(availability).length === 0) {
        console.log("La salle est introuvable ou n'a aucune disponibilité.".red);
		console.log("The room cannot be found or is unavailable.".red);
    } else {
        console.log("Disponibilités de la salle " + roomNumber.toUpperCase().brightCyan + " :");
		console.log("Room's availability " + roomNumber.toUpperCase().brightCyan + " :");
        for (const day of weekOrder) {     // Pour parcourir dans l'ordre de la semaine
            if (availability[day]) { 
                const slots = availability[day].map(slot => slot.brightMagenta);
                console.log(`${letterForDay[day].brightYellow}/${letterForDayE[day].brightYellow}: ${slots.join(', ')}`);
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