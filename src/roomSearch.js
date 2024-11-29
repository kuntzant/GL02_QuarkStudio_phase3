// SPEC1
const { processCruData } = require('./controller');
const readline = require('readline');
const path = require('path');
const colors = require('colors');

// Chemin racine des données et ajout des données CRU
const rootPath = path.resolve(__dirname, '../data'); 
const summary = processCruData(rootPath);

// Fonction pour rechercher les salles associées à un cours donné
function searchRoomsForCourse(courseCode) {
    if (!summary[courseCode]) {
        // Cours est introuvable
        console.log("Le cours est introuvable. Veuillez vérifier le code du cours.".red);
        return;
    }

    const rooms = summary[courseCode].rooms;
    // Si aucune salle n'est trouvée pour le cours
    if (rooms.length === 0) {
        console.log("Aucune salle n'a pu être trouvée pour ce cours.".yellow);
    } else {
        // Affichage des salles trouvées
        console.log("Salles associées au cours " + courseCode.cyan + " :");
        console.log(rooms.join('\n').brightCyan);
    }
}

// Fonction pour demander le code du cours à l'utilisateur
async function promptCourseCode(rl) {
    console.log("Recherche des salles associées à un cours".inverse);
    const courseCode = await promptUser("Veuillez entrer le code du cours : ", rl);
    searchRoomsForCourse(courseCode.toUpperCase());
}

// Fonction pour poser une question à l'utilisateur et attendre sa réponse
function promptUser(question, rl) {
    return new Promise(resolve => {
        rl.question(question, (answer) => {
            resolve(answer);  
        });
    });
}

module.exports = { promptCourseCode };