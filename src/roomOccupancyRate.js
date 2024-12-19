const readline = require('readline');
const colors = require('colors');
const { calculateOccupancyRateForAllRooms } = require('./logic/roomOccupancyRateLogic');

// Fonction pour demander à l'utilisateur s'il souhaite calculer le taux d'occupation des salles
async function promptRoomOccupancy(rl) {
    console.log("Analyse du taux d'occupation des salles".inverse);
	console.log("Rooms' occupancy rate analysis".inverse);
    const occupancyRates = calculateOccupancyRateForAllRooms();
    
    if (occupancyRates.error) {
        console.log(occupancyRates.error.red);
    } else {
        let sortChoice = '';
        do {
            sortChoice = (await promptUser("Voulez-vous trier par taux d'occupation ["+"1".grey+"] ou par capacité ["+"2".grey+"] ?  \n Do you want to sort by occupancy rate ["+"1".grey+"] or by capacity ["+"2".grey+"] ?", rl)).trim();
            if (sortChoice !== '1' && sortChoice !== '2') {
                console.log("Choix invalide. Veuillez choisir "+"1".grey+" pour trier par "+"taux d'occupation".red+" ou "+"2".grey+" pour trier "+"par capacité.".red);
				console.log("Invalid choice. Please choose "+"1".grey+" to sort by "+"occupancy rate".red+" or "+"2".grey+" to sort by "+"capacity.".red);
            }
        } while (sortChoice !== '1' && sortChoice !== '2');
        
        if (sortChoice === '1') {
            occupancyRates.sort((a, b) => b.occupancyRate - a.occupancyRate);
            console.log("Taux d'occupation des salles trié par taux d'occupation :".inverse);
			console.log("Rooms' occupancy rate sorted by occupancy rate :".inverse);
        } else if (sortChoice === '2') {
            occupancyRates.sort((a, b) => b.capacity - a.capacity);
            console.log("Taux d'occupation des salles trié par capacité :".inverse);
			console.log("Rooms' occupancy rate sorted by capacity :".inverse);
        } else {
            console.log("Choix invalide. Tri par taux d'occupation par défaut.".yellow);
			console.log("Invalid Choice. Sorting by occupancy rate by default.".yellow);
            occupancyRates.sort((a, b) => b.occupancyRate - a.occupancyRate);
        }

        console.log("Salle".padEnd(10) + "Taux d'occupation".padEnd(20) + "Capacité");
		console.log("Room".padEnd(10) + "Occupancy rate".padEnd(20) + "Capacity");
        console.log("-".repeat(60));
        occupancyRates.forEach(({ room, occupancyRate, capacity }) => {
            if (room.trim() !== "") {
                console.log(room.brightCyan.padEnd(20) + occupancyRate.toFixed(2).toString().brightGreen +"%".grey.padEnd(25)+ capacity.toString().brightGreen+" personnes/people".grey);
			}
        });
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
