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
        }else{
            let sortChoice='';
            do{
            sortChoice = await promptUser("Voulez-vous trier par taux d'occupation (1) ou par capacité (2) ? ", rl);
            if (sortChoice !== '1' && sortChoice !== '2') {
                console.log("Choix invalide. Veuillez choisir 1 pour trier par taux d'occupation ou 2 pour trier par capacité.".red);
            }
        }while(sortChoice !== '1' && sortChoice !== '2');
            if (sortChoice==='1'){
                occupancyRates.sort((a, b) => b.occupancyRate - a.occupancyRate);
                console.log("Taux d'occupation des salles trié par taux d'occupation :".inverse);
            } else if (sortChoice === '2') {
                occupancyRates.sort((a, b) => b.capacity - a.capacity);
                console.log("Taux d'occupation des salles trié par capacité :".inverse);
            } else {
                console.log("Choix invalide. Tri par taux d'occupation par défaut.".yellow);
                occupancyRates.sort((a, b) => b.occupancyRate - a.occupancyRate);
            }

            occupancyRates.forEach(({ room, occupancyRate, capacity }) => {
                if (room.trim() !== "") {
                    console.log(`Salle ${room.brightCyan} : ${occupancyRate.toFixed(2).toString().brightGreen +'%'.brightGreen} d'occupation et Capacité de ${capacity.toString().brightGreen} personnes`);
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
