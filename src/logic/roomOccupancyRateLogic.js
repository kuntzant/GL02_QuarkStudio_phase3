// SPEC7 - Logique pour analyser l'occupation des locaux
const { processCruData } = require('../controller');
const { getRoomCapacity } = require('./roomCapacityLogic');
const path = require('path');


// Chemin racine des données et ajout des données CRU
const rootPath = path.resolve(__dirname, '../../data');
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
function calculateOccupancyRateForAllRooms(data = summary) {
    const roomOccupancy = {};

    // On parcourt toutes les sessions pour remplir le dictionnaire roomOccupancy
    for (const courseName in data) {
        const course = data[courseName];
        course.cours.forEach(session => {
            const { room, day, time } = session;

            // Ignorer les sessions mal formées
            if (!room || !day || !time) {
                return; // Passe à la session suivante
            }

            const { start, end } = parseTimeRange(time);

            if (!roomOccupancy[room]) {
                roomOccupancy[room] = {
                    L: new Set(),
                    MA: new Set(),
                    ME: new Set(),
                    J: new Set(),
                    V: new Set(),
                    S: new Set(),
                };
            }

            // Ajout de la plage horaire au set correspondant pour le jour de la semaine
            roomOccupancy[room][day].add(`${start}-${end}`);
        });
    }

    // Ne comptabilise pas les salles n'ayant pas de noms
    if (Object.keys(roomOccupancy).length === 0) {
        return { error: "Aucune donnée de taux d'occupation n'est disponible." };
    }

    const openingTime = { start: 8 * 60, end: 20 * 60 }; // 08:00-20:00 en minutes (720 minutes)
    const totalTimePerDay = openingTime.end - openingTime.start;
    const weekOrder = ['L', 'MA', 'ME', 'J', 'V', 'S'];

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
        const capacity = getRoomCapacity(room, data);
        // Ignorer les sessions mal formées
        if (occupancyRate && capacity) {
            occupancyRates.push({ room, occupancyRate, capacity });
        }
        
    }

    // Tri par capacité décroissante
    occupancyRates.sort((a, b) => b.capacity - a.capacity);

    return occupancyRates;
}




module.exports = { calculateOccupancyRateForAllRooms };