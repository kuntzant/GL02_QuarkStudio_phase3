// SPEC1
const { processCruData } = require('./controller');
const readline = require('readline');
const path = require('path');
const colors = require('colors');


const rootPath = path.resolve(__dirname, '../data'); // Dossier contenant les sous-dossiers .cru
const summary = processCruData(rootPath);

function searchRoomsForCourse(courseCode) {
    if (!summary[courseCode]) {
        console.log("Le cours est introuvable. Veuillez vérifier le code du cours.".red);
        return;
    }

    const rooms = summary[courseCode].rooms;
    if (rooms.length === 0) {
        console.log("Aucune salle n'a pu être trouvée pour ce cours.".yellow);
    } else {
        console.log("Salles associées au cours " + courseCode.cyan + " :");
        console.log(rooms.join('\n').brightCyan);
    }
}

async function promptCourseCode(rl) {
    console.log("Recherche des salles associées à un cours".inverse);
    const courseCode = await promptUser("Veuillez entrer le code du cours : ", rl);
    searchRoomsForCourse(courseCode.toUpperCase());

}

function promptUser(question, rl) {
    return new Promise(resolve => {
        rl.question(question, (answer) => {
            resolve(answer);  // Résoudre la promesse après la réponse de l'utilisateur
        });
    });
}

module.exports = { promptCourseCode };