// Fichier principale du projet (Menu de l'application)
const readline = require('readline');
const { promptCourseCode } = require('./roomSearch');
const { promptRoomNumber } = require('./roomCapacity');
const { promptRoomAvailability } = require('./roomAvailability');
const { promptAvailableRooms } = require('./roomTimeAvailability');
const { promptICalExport } = require('./ICalExport');
const { promptScheduleConflictCheck } = require('./scheduleConflictCheck');
const { promptRoomOccupancy } = require('./roomOccupancyRate');

// Interface d'input unique à tous les fichiers pour éviter les erreurs de duplications de caractères
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Fonction asynchrone pour afficher le menu
async function displayMenu() {
    console.log("\n===============================".blue);
    console.log(" Menu Principal".bold);
	console.log(" Main Menu".bold);
    console.log("===============================".blue);
    console.log("[1] Rechercher des salles associées à un cours");
	console.log("[1] Search for rooms associated to a class");
    console.log("[2] Afficher la capacité maximale des salles");
	console.log("[2] Show the rooms' maximum capacity");
    console.log("[3] Afficher la disponibilités des salles");
	console.log("[3] Show the rooms' availability");
    console.log("[4] Afficher les salles libres pour un créneau donné");
	console.log("[4] Show the free rooms for a given time");
    console.log("[5] Exporter des cours au format iCalendar");
	console.log("[5] Export classes in iCalendar format");
    console.log("[6] Vérifier des conflits d’emploi du temps");
	console.log("[6] Check schedule conflicts");
    console.log("[7] Analyser l’occupation des salles");
	console.log("[7] Analyse the rooms' occupancy rate");
    console.log('\n');
    console.log("[0] Arrêter le programme");
	console.log("[0] Stop the program");
    console.log("===============================".blue);
    
    const choice = await promptUser("Veuillez choisir une option (0-7) : \nPlease choose an option (0-7) :");  // Utilisation de 'await' avec la fonction asynchrone
    await handleMenuChoice(choice);  // Attendre avant de redemander une option

}

// Fonction asynchrone pour traiter les choix du menu
async function handleMenuChoice(choice) {
    console.log('\n');
    switch (choice.trim()) {
        case '1':
            await promptCourseCode(rl);  // Attendre l'entrée dans cette fonction
            break;
        case '2':
            await promptRoomNumber(rl);  
            break;
        case '3':
            await promptRoomAvailability(rl); 
            break;
        case '4':
            await promptAvailableRooms(rl);
            break;
        case '5':
            await promptICalExport(rl);
            break;
        case '6':
            await promptScheduleConflictCheck(rl);
            break;
        case '7':
            await promptRoomOccupancy(rl); 
            break;
        case '0':
            stopProgram();  // Arrêter le programme
            return;
        default:
            console.log("Choix invalide. Veuillez choisir une option valide.".red);
			console.log("Invalid choice. Please choose a valid option.".red);
            displayMenu();
    }

    // Demander à l'utilisateur s'il souhaite faire une autre action
    let continueChoice;
    do {
        continueChoice = (await promptUser("\nSouhaitez-vous faire autre chose ?".brightWhite + " (" + "O / OUI".green + " ou " + "N / NON".red + ") : \nWould you like to do something else ?".brightWhite + " (" + "Y / YES".green + " ou " + "N / NO".red + ") : ")).trim().toUpperCase();
        
        if (continueChoice === 'O' || continueChoice === 'OUI' || continueChoice === 'YES' || continueChoice === 'Y') {
            await displayMenu();  // Redemander une option après l'action
            return;  // Sortir du traitement courant
        } else if (continueChoice === 'N' || continueChoice === 'NON' || continueChoice === 'NO') {
            stopProgram();
            return;  // Sortir du traitement courant
        } else {
            console.log("\nSaisie invalide. Veuillez entrer 'O' / 'OUI' ou 'N' / 'NON'.".red);
			console.log("\nInvlaid input. Please enter 'Y' / 'YES' or 'N' / 'NO'.".red);
        }
    } while (continueChoice !== 'O' && continueChoice !== 'N' && continueChoice !== 'NON' && continueChoice !== 'OUI' && continueChoice !== 'YES' && continueChoice !== 'Y' && continueChoice !== 'NO');  // Redemander tant que la saisie n'est pas correcte
}

// Fonction d'arrêt du programme
function stopProgram() {
    console.log("Arrêt du programme...".yellow);
	console.log("Program stopping...".yellow);
    rl.close();  // Ferme readline et termine le programme
}

// Fonction asynchrone pour gérer l'entrée utilisateur
function promptUser(question) {
    return new Promise(resolve => {
        rl.question(question, (answer) => {
            resolve(answer);  // Résoudre la promesse après la réponse de l'utilisateur
        });
    });
}

console.log("Bienvenue dans le programme de gestion des salles".bold.brightWhite);
console.log("Welcome to the room management program".bold.brightWhite);
displayMenu();  
