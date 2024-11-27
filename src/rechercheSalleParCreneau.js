const { processCruData } = require('./controller');
const readline = require('readline');
const path = require('path');
const colors = require('colors');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const rootPath = path.resolve(__dirname, '../data'); 
const summary = processCruData(rootPath);

function parseTimeRange(timeRange) {
    const [start, end] = timeRange.split('-').map(time => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    });
    return { start, end };
}

function getAvailableRooms(day, timeRange) {
    const { start, end } = parseTimeRange(timeRange);
    const availableRooms = new Set();

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

    if (availableRooms.size === 0) {
        console.log("Aucune salle n'est libre lors de la période demandée.".yellow);
    } else {
        const sortedRooms = Array.from(availableRooms).sort(); // c'est pour trier les salles par ordre alphabétique
        console.log("Salles disponibles le " + day.brightMagenta + " de " + timeRange.brightMagenta + " :");
        console.log(sortedRooms.join('\n').brightMagenta);
    }
}

function promptAvailableRooms() {
    rl.question("Veuillez entrer le jour de la semaine (L,MA,ME,J,V,S,D) : ", (day) => {
        const validDays = ['L', 'MA', 'ME', 'J', 'V', 'S', 'D'];
        if (!validDays.includes(day.toUpperCase())) {
            console.log("Erreur : Le jour doit être l'un des suivants : L, MA, ME, J, V, S, D.".red);
            rl.close();
            return;
        }

        rl.question("Veuillez entrer la plage horaire (hh:mm-hh:mm) : ", (timeRange) => {
            const timeRangePattern = /^\d{2}:\d{2}-\d{2}:\d{2}$/;
            if (!timeRangePattern.test(timeRange)) {
                console.log("Erreur : La plage horaire doit être au format hh:mm-hh:mm. Exemple : 08:00-10:00.".red);
                rl.close();
                return;
            }

            getAvailableRooms(day.toUpperCase(), timeRange);
            rl.close();
        });
    });
}

console.log("Salles libres pour un créneau donné".inverse);
promptAvailableRooms();