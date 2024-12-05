// SPEC2 - Logique pour obtenir la capacité maximale d'une salle
const { processCruData } = require('../controller');
const path = require('path');

// Chemin racine des données et ajout des données CRU
const rootPath = path.resolve(__dirname, '../../data');
const summary = processCruData(rootPath);

// Fonction pour obtenir la capacité maximale d'une salle
//ajout d'un argument pour les test unitaires
function getRoomCapacity(roomNumber0, data=summary) {
    let maxCapacity = 0;
    const roomNumber = roomNumber0.trim().toUpperCase();
    for (const courseName in data) {
        const course = data[courseName];
        course.cours.forEach(session => {
            if (session.room === roomNumber && session.participants > maxCapacity) {
                maxCapacity = session.participants;
            }
        });
    }
    return maxCapacity;
}

module.exports = { getRoomCapacity };