//SPEC 7
const { processCruData } = require('./controller');
const { getRoomCapacity } = require('./roomCapacityLogic');
const readline = require('readline');
const path = require('path');
const colors = require('colors');

// Chemin racine des données et ajout des données CRU
const rootPath = path.resolve(__dirname, '../data');
const summary = processCruData(rootPath);

// Fonction pour analyser une plage horaire
function parseTimeRange(timeRange) {
    const [start, end] = timeRange.split('-').map(time => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    });
    return { start, end };
}

// Fonction pour calculer le taux d'occupation pour toutes les salles
function calculateOccupancyRateForAllRooms() {
    const roomOccupancy = {};

    // On parcourt toutes les sessions pour remplir le dictionnaire roomOccupancy
    for (const courseName in summary) {
        const course = summary[courseName];
        course.cours.forEach(session => {
            const { room, day, time } = session;
            const { start, end } = parseTimeRange(time);

            if (!roomOccupancy[room]) {
                roomOccupancy[room] = {
                    L: new Set(),
                    MA: new Set(),
                    ME: new Set(),
                    J: new Set(),
                    V: new Set(),
                    S: new Set(),
                    D: new Set()
                };
            }

            // Ajout de la plage horaire au set correspondant pour le jour de la semaine
            roomOccupancy[room][day].add(`${start}-${end}`);
        });
    }
    
    if (Object.keys(roomOccupancy).length === 0) {
        return { error: "Aucune donnée de taux d'occupation n'est disponible." };
    }

    // Calcul du taux d'occupation pour chaque salle
    const openingTime = { start: 8 * 60, end: 20 * 60 }; // 08:00-20:00 en minutes (720 minutes)
    const totalTimePerDay = openingTime.end - openingTime.start;
    const weekOrder = ['L', 'MA', 'ME', 'J', 'V', 'S', 'D'];

    const occupancyRates = []; 

    for (const room in roomOccupancy) {
        let totalOccupiedTime = 0;

        // Pour chaque jour de la semaine, on calcule le temps occupé
        for (const day of weekOrder) {
            const slots = roomOccupancy[room][day];

            slots.forEach(slot => {
                const [start, end] = slot.split('-').map(Number);
                totalOccupiedTime += (end - start);
            });
        }

        // Calcul du taux d'occupation : (temps occupé / temps total) * 100
        const occupancyRate = ((totalOccupiedTime) / (totalTimePerDay * weekOrder.length)) * 100;
        const capacity = getRoomCapacity(room);
        occupancyRates.push({ room, occupancyRate, capacity});
    }

    // Tri par taux d'occupation décroissant
    occupancyRates.sort((a, b) => b.capacity - a.capacity);
    return occupancyRates

}

// Fonction pour demander à l'utilisateur s'il souhaite calculer le taux d'occupation des salles
async function promptRoomOccupancy(rl) {
    console.log("Calcul du taux d'occupation des salles".inverse);
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
