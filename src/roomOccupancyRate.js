//SPEC 7

const readline = require('readline');
const colors = require('colors');
const { calculateOccupancyRateForAllRooms } = require('./roomOccupancyRateLogic');


// Fonction pour demander à l'utilisateur s'il souhaite calculer le taux d'occupation des salles
async function promptRoomOccupancy(rl) {
    console.log("Analyse du taux d'occupation des salles".inverse);
    const answer = await promptUser("Souhaitez-vous calculer le taux d'occupation pour toutes les salles ("+ "O".green+ "/"+ "N".red+") ? ", rl);
    if (answer.toUpperCase() === 'O') {
        const occupancyRates = calculateOccupancyRateForAllRooms();

        if (occupancyRates.error) {
            console.log(occupancyRates.error.red);
        } else {
            console.log("Taux d'occupation des salles trié par nombre nombre de places".inverse);
            occupancyRates.forEach(({ room, occupancyRate, capacity }) => {
                if (room.trim() !== "") {
                    console.log(`Salle ${room.brightCyan} : Capacité de ${capacity.toString().brightGreen} personnes pour un taux d'occupation de ${occupancyRate.toFixed(2).toString().brightGreen + '%'.brightGreen}`);
                }
            });
        }
    } else {
        console.log("Opération annulée.".yellow);
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

module.exports = { promptRoomOccupancy };
