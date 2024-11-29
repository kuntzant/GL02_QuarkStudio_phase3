// SPEC2
const { processCruData } = require('./controller');
const readline = require('readline');
const path = require('path');
const colors = require('colors');

// Chemin racine des données et ajout des données CRU
const rootPath = path.resolve(__dirname, '../data');
const summary = processCruData(rootPath);

// Fonction pour obtenir la capacité maximale d'une salle
function getRoomCapacity(roomNumber) {
    let maxCapacity = 0;
    let roomFound = false;

    // On regarde juste le nombre d'élèves maximal qui a cours dans cette salle
    for (const courseName in summary) {
        const course = summary[courseName];
        course.cours.forEach(session => {
            if (session.room === roomNumber) {
                roomFound = true;
                maxCapacity = Math.max(maxCapacity, session.participants);
            }
        });
    }

    // Affichage du résultat ou message d'erreur si la salle n'est pas trouvée
    if (!roomFound) {
        console.log("La salle est introuvable. Veuillez vérifier le numéro de la salle.".red);
    } else {
        console.log("La salle " + roomNumber.brightCyan + " peut accueillir jusqu'à " + maxCapacity.toString().green + " personnes.");
    }
}

// Fonction pour demander le numéro de la salle à l'utilisateur
async function promptRoomNumber(rl) {
    console.log("Capacité maximale des salles".inverse);
    const roomNumber = await promptUser("Veuillez entrer le numéro de la salle : ", rl);
    getRoomCapacity(roomNumber.toUpperCase());
}

// Fonction pour poser une question à l'utilisateur et attendre sa réponse
function promptUser(question, rl) {
    return new Promise(resolve => {
        rl.question(question, (answer) => {
            resolve(answer);  
        });
    });
}

module.exports = { promptRoomNumber };