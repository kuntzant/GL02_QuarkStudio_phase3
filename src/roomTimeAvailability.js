
// SPEC4 - Affichage pour obtenir les salles libres pour un créneau donné
const readline = require('readline');
const colors = require('colors');
const { getAvailableRooms, isValidDay, isValidTimeRange } = require('./roomTimeAvailabilityLogic');

// Fonction pour demander à l'utilisateur les informations nécessaires et afficher les salles disponibles
async function promptAvailableRooms(rl) {
    console.log("Salles libres pour un créneau donné".inverse);

    let day;
    do {
        day = await promptUser("Veuillez entrer le jour de la semaine (L,MA,ME,J,V,S,D) : ", rl);
        if (!isValidDay(day)) {
            console.log("Jour invalide. Veuillez entrer un jour valide.".red);
        }
    } while (!isValidDay(day));

    let timeRange;
    do {
        timeRange = await promptUser("Veuillez entrer la plage horaire (hh:mm-hh:mm) : ", rl);
        if (!isValidTimeRange(timeRange)) {
            console.log("Plage horaire invalide. Veuillez entrer une plage valide au format hh:mm-hh:mm.".red);
        }
    } while (!isValidTimeRange(timeRange));

    const availableRooms = getAvailableRooms(day.toUpperCase(), timeRange);
    if (availableRooms.length === 0) {
        console.log("Aucune salle libre n'a été trouvée pour ce créneau.".red);
    } else {
        availableRooms.sort();
        console.log("Salles libres pour le créneau spécifié :".green);
        console.log(availableRooms.join('\n').brightGreen);
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