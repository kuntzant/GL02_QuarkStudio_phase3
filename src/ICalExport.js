// SPEC 5
const path = require('path');
const colors = require('colors');
const readline = require('readline');
const { createSchedule, exportToICalendar, checkForConflicts } = require('./logic/ICalExportLogic');


async function promptICalExport(rl) {
    console.log("Exportation des cours au format iCalendar".inverse);
    const courses = await promptUser("Veuillez entrer les codes des cours à exporter (séparés par des virgules) : ", rl);
    const selectedCourses = courses.toUpperCase().split(',').map(code => code.trim());
    console.log("Génération de l'emploi du temps...\n".green);

    let schedule = createSchedule(selectedCourses);
    let conflicts = checkForConflicts(schedule);

    // Tester 100000 emplois du temps pour voir s'il en existe sans conflits
    let attempts = 0;
    while (conflicts.length > 0 && attempts < 100000) {
        attempts++;
        schedule = createSchedule(selectedCourses);
        conflicts = checkForConflicts(schedule);
    }

    const letterForDay = {
        "L": "Lundi",
        "MA": "Mardi",
        "ME": "Mercredi",
        "J": "Jeudi",
        "V": "Vendredi",
        "S": "Samedi",
        "D": "Dimanche"
    };
    const categories = { C: 'CM', D: 'TD', T: 'TP' };

    
    if (conflicts.length > 0 ) {

        // Filtrer les conflits pour ne garder que ceux liés aux CM (vu que c'est aléatoire, il se peut que juste le dernier emploi du temps ait 2 TD/TP superposés)
        conflicts = conflicts.filter(conflict => {
            const course1 = schedule.find(course => course.subject === conflict.subject1 && course.day === conflict.day && course.time === conflict.time);
            const course2 = schedule.find(course => course.subject === conflict.subject2 && course.day === conflict.day && course.time === conflict.time);
            return course1 && course2 && course1.category.startsWith('C') && course2.category.startsWith('C');
        });

        console.warn('Les matières suivantes se superposent :'.yellow);
        conflicts.forEach(conflict => {
            console.warn(`${conflict.subject1.cyan} et ${conflict.subject2.cyan} le ${letterForDay[conflict.day].brightYellow} à ${conflict.time.brightMagenta}`);
        });
        console.warn("\nAucun emploi du temps sans conflits n'a pu être généré.".red);
    } else {
        if (schedule.length > 0) {
            console.log('\nEmploi du temps :'.grey);
            schedule.forEach(event => {
                console.log(`- ${event.subject.cyan} (${categories[event.category.charAt(0)]}) le ${letterForDay[event.day].brightYellow} à ${event.time.brightMagenta} en salle ${event.room.brightCyan}`);
            });
            console.log('\n');
            const exported_schedule_outputPath = exportToICalendar(schedule, 'schedule.ics');
            if (exported_schedule_outputPath != null) {
                console.log("Fichier ICalendar exporté dans : ".grey + exported_schedule_outputPath.underline.italic);
            }
            else {
                console.log("Le fichier ICalendar n'a pas pu être exporté, où le chemin d'accès est introuvable".red);
            }
        } else {
            console.log("\nAucun emploi du temps sans conflits n'a pu être généré.".red);
        }
    }
}


function promptUser(question, rl) {
    return new Promise(resolve => {
        rl.question(question, answer => {
            resolve(answer);
        });
    });
}

module.exports = { promptICalExport };
