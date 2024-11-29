// SPEC4
const { processCruData } = require('./controller');
const readline = require('readline');
const path = require('path');
const colors = require('colors');

// Chemin racine des données et ajout des données CRU
const rootPath = path.resolve(__dirname, '../data'); 
const summary = processCruData(rootPath);

// Fonction pour analyser une plage horaire
function parseTimeRange(timeRange) {
    const [start, end] = timeRange.split('-').map(time => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    });
    return { start, end };
}

// Fonction pour obtenir les salles disponibles pour un jour et une plage horaire donnés
function getAvailableRooms(day, timeRange) {
    const { start, end } = parseTimeRange(timeRange);
    const availableRooms = new Set();

    const letterForDay = {
        "L": "Lundi",
        "MA": "Mardi",
        "ME": "Mercredi",
        "J": "Jeudi",
        "V": "Vendredi",
        "S": "Samedi",
        "D": "Dimanche"
    };

    // Ajouter toutes les salles à l'ensemble des salles disponibles
    for (const courseName in summary) {
        const course = summary[courseName];
        course.cours.forEach(session => {
            availableRooms.add(session.room);
        });
    }

    // Retirer les salles occupées pendant le créneau donné
    for (const courseName in summary) {
        const course = summary[courseName];
        course.cours.forEach(session => {
            if (session.day === day) {
                const sessionTime = parseTimeRange(session.time);
                if (start < sessionTime.end && end > sessionTime.start) {
                    availableRooms.delete(session.room);
                }
            }
        });
    }

    // Si aucune salle n'est libre
    if (availableRooms.size === 0) {
        console.log("Aucune salle n'est libre lors de la période demandée.".yellow);
    } else {
        const sortedRooms = Array.from(availableRooms).sort(); // Trier les salles par ordre alphabétique
        // Grouper les salles par leur premier caractère
        const groupedRooms = {};
        for (const room of sortedRooms) {
            if (room.trim()!=="") {
                const firstChar = room[0].toUpperCase();
                if (!groupedRooms[firstChar]) {
                    groupedRooms[firstChar] = [];
                }
                groupedRooms[firstChar].push(room);
            }
        }

        console.log("Salles disponibles le " + letterForDay[day].brightYellow + " de " + timeRange.brightMagenta + " :");

        // Afficher les salles groupées
        for (const [firstChar, rooms] of Object.entries(groupedRooms)) {
            console.log(`${firstChar.grey}: ${rooms.join(', ').brightCyan}`);
        }
    }
}

// Fonction pour demander à l'utilisateur les informations nécessaires et afficher les salles disponibles
async function promptAvailableRooms(rl) {
    console.log("Salles libres pour un créneau donné".inverse);
    const day = await promptUser("Veuillez entrer le jour de la semaine (L,MA,ME,J,V,S,D) : ", rl);
    const validDays = ['L', 'MA', 'ME', 'J', 'V', 'S', 'D'];
    if (!validDays.includes(day.toUpperCase())) {
        console.log("Erreur : Le jour doit être l'un des suivants : L, MA, ME, J, V, S, D.".red);
        return;
    }

    const timeRange = await promptUser("Veuillez entrer la plage horaire (hh:mm-hh:mm) : ", rl);
    const timeRangePattern = /^\d{2}:\d{2}-\d{2}:\d{2}$/;
    if (!timeRangePattern.test(timeRange)) {
        console.log("Erreur : La plage horaire doit être au format hh:mm-hh:mm. Exemple : 08:00-10:00.".red);
        return;
    }

    getAvailableRooms(day.toUpperCase(), timeRange);          
}

// Fonction pour demander une entrée utilisateur
function promptUser(question, rl) {
    return new Promise(resolve => {
        rl.question(question, (answer) => {
            resolve(answer); 
        });
    });
}

module.exports = { promptAvailableRooms };