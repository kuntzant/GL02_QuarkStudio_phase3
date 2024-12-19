// SPEC1

const readline = require('readline');
const colors = require('colors');
const { searchRoomsForCourse } = require('./logic/roomSearchLogic');

// Fonction pour demander le code du cours à l'utilisateur
async function promptCourseCode(rl) {
    console.log("Recherche des salles associées à un cours".inverse);
	console.log("Search of rooms associated to a class".inverse);
    const courseCode = await promptUser("Veuillez entrer le code du cours : \nPlease enter the class' code :", rl);
    const rooms=searchRoomsForCourse(courseCode);
    if (rooms === null) {
        console.log("Le cours est introuvable. Veuillez vérifier le code du cours.".red);
		console.log("The class cannot be found. Please enter the class' code".red);
    } else if (rooms.length === 0) {
        console.log("Aucune salle n'a pu être trouvée pour ce cours.".yellow);
		console.log("No room could be found for this class.".yellow);
    } else {
        // Affichage des salles trouvées
        console.log("Salles associées au cours " + courseCode.trim().toUpperCase().cyan + " :");
		console.log("Rooms associated to the class " + courseCode.trim().toUpperCase().cyan + " :");
        console.log(rooms.join('\n').brightCyan);
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

module.exports = { promptCourseCode };