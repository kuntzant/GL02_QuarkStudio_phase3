// SPEC2 - Logique pour obtenir la capacité maximale d'une salle
const { processCruData } = require('../controller');
const path = require('path');

// Chemin racine des données et ajout des données CRU
const rootPath = path.resolve(__dirname, '../../data');
const summary = processCruData(rootPath);

// Fonction pour obtenir la capacité maximale d'une salle
function getRoomCapacity(roomNumber) {
    let maxCapacity = 0;
    for (const courseName in summary) {
        const course = summary[courseName];
        course.cours.forEach(session => {
            if (session.room === roomNumber && session.participants > maxCapacity) {
                maxCapacity = session.participants;
            }
        });
    }
    return maxCapacity;
}

module.exports = { getRoomCapacity };