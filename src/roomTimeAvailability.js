
// SPEC4 - Affichage pour obtenir les salles libres pour un créneau donné
const readline = require('readline');
const colors = require('colors');
const { getAvailableRooms, isValidDay, isValidTimeRange } = require('./logic/roomTimeAvailabilityLogic');


const letterForDay = {
    "L": "Lundi",
    "MA": "Mardi",
    "ME": "Mercredi",
    "J": "Jeudi",
    "V": "Vendredi",
    "S": "Samedi"
};



// Fonction pour demander à l'utilisateur les informations nécessaires et afficher les salles disponibles
async function promptAvailableRooms(rl) {
    console.log("Salles libres pour un créneau donné".inverse);

    let day;
    do {
        day = await promptUser("Veuillez entrer le jour de la semaine (L,MA,ME,J,V,S) : ", rl);
        if (!isValidDay(day)) {
            console.log("Jour invalide. Veuillez entrer un jour valide.".red);
        }
    } while (!isValidDay(day));
    
    day = day.trim().toUpperCase();


    let timeRange;
    do {
        timeRange = await promptUser("Veuillez entrer la plage horaire (hh:mm-hh:mm ou hhhmm-hhhmm) : ", rl);
		console.log(isValidTimeRange(timeRange));
        if (!isValidTimeRange(timeRange)) {
            console.log("Plage horaire invalide. Veuillez entrer une plage valide au format hh:mm-hh:mm ou hhhmm-hhhmm.".red);
        }
    } while (!isValidTimeRange(timeRange));

    timeRange = timeRange.trim();

    const availableRooms = getAvailableRooms(day.toUpperCase(), timeRange);
    if (availableRooms.length === 0) {
        console.log("Aucune salle libre n'a été trouvée pour ce créneau.".yellow);
    } else {
        const sortedRooms = availableRooms.sort();
        // Grouper les salles par leur premier caractère
        const groupedRooms = {};
        for (const room of sortedRooms) {
            if (room.trim()!=="") {
                const firstChar = room[0].toUpperCase();
                if (!groupedRooms[firstChar]) {
                    groupedRooms[firstChar] = [];
                }
                groupedRooms[firstChar].push(room);
            }
        }
        console.log("Salles disponibles le " + letterForDay[day].brightYellow + " de " + timeRange.trim().brightMagenta + " :");

        // Afficher les salles groupées
        for (const [firstChar, rooms] of Object.entries(groupedRooms)) {
            console.log(`${firstChar.grey}: ${rooms.join(', ').brightCyan}`);
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

module.exports = { promptAvailableRooms };