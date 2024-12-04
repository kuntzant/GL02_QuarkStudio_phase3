// SPEC1 - Logique de recherche des salles associées à un cours (permet les tests unitaires)
const { processCruData } = require('../controller');
const path = require('path');

// Chemin racine des données et ajout des données CRU
const rootPath = path.resolve(__dirname, '../../data');
const summary = processCruData(rootPath);

// Fonction pour rechercher les salles associées à un cours donné
//ajout d'un deuxieme argument pr les test unitaires
function searchRoomsForCourse(courseCode, data = summary) {
    if (!summary[courseCode]) {
        // Cours introuvable
        return null;
    }

    const rooms = Array.from(summary[courseCode].rooms);

    // Si aucune salle n'est trouvée pour le cours
    if (rooms.length === 0) {
        return [];
    } else {
        return rooms;
    }
}

module.exports = { searchRoomsForCourse };