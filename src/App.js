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
    console.log('\n');
    console.log("\n===============================".blue);
    console.log(" Menu Principal".bold);
    console.log("===============================".blue);
    console.log("1. Rechercher des salles associées à un cours");
    console.log("2. Afficher la capacité maximale des salles");
    console.log("3. Afficher la disponibilités des salles");
    console.log("4. Afficher les salles libres pour un créneau donné");
    console.log("5. Exporter des cours au format iCalendar");
    console.log("6. Vérifier des conflits d’emploi du temps");
    console.log("7. Analyser l’occupation des salles");
    console.log('\n');
    console.log("0. Arrêter le programme");
    console.log("===============================".blue);

    
    const choice = await promptUser("Veuillez choisir une option (0-7) : ");  // Utilisation de 'await' avec la fonction asynchrone
    await handleMenuChoice(choice);  // Attendre avant de redemander une option

}

// Fonction asynchrone pour traiter les choix du menu
async function handleMenuChoice(choice) {
    console.log('\n');
    switch (choice) {
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
            break;
    }

    // Demander à l'utilisateur s'il souhaite faire une autre action
    const continueChoice = await promptUser("\nSouhaitez-vous faire autre chose ?".brightWhite +" ("+ "O".green+ "/"+ "N".red+") : ");
    if (continueChoice.toUpperCase() === 'O' || continueChoice.toUpperCase() === 'OUI') {
        await displayMenu();  // Redemander une option après l'action
    } else {
        stopProgram();
    }
}

// Fonction d'arrêt du programme
function stopProgram() {
    console.log("Arrêt du programme...".yellow);
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
displayMenu();  
