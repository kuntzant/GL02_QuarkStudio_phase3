// SPEC 5
const path = require('path');
const colors = require('colors');
const readline = require('readline');
const { createSchedule, exportToICalendar, checkForConflicts } = require('./logic/ICalExportLogic');


async function promptICalExport(rl) {
    console.log("Exportation des cours au format iCalendar".inverse);
	console.log("Classes export under iCalendar format".inverse);
    const coursesInput = await promptUser("Veuillez entrer les codes des cours à exporter (séparés par des virgules) : \nPlease enter the classes to export's codes (separated by commas) :", rl);

    // Nettoyer et valider les cours
    const courses = coursesInput
        .split(",")                // Divise la chaîne en un tableau
        .map(course => course.trim()) // Nettoie chaque entrée
        .filter(course => course);    // Retire les entrées vides

    let schedule = createSchedule(courses);
    
    // Vérifie que les matières existent dans la base
    if (typeof schedule === "string") {
        console.warn("La matière ".yellow + schedule.red +" n'existe pas dans les données.".yellow+"\nThe class ".yellow + schedule.red +" doesn't exist within the data.".yellow);
    }
    else {
        let conflicts = checkForConflicts(schedule);

        if (conflicts === null) {
            console.log("l'emploi du temps est erroné !");
			console.log("there is something wrong with the schedule!");
        }
        else {
            // Tester 100000 emplois du temps pour voir s'il en existe sans conflits
            let attempts = 0;
            while (conflicts.length > 0 && attempts < 100000) {
                attempts++;
                schedule = createSchedule(courses);
                conflicts = checkForConflicts(schedule);
            }

            const letterForDay = {
                "L": "Lundi",
                "MA": "Mardi",
                "ME": "Mercredi",
                "J": "Jeudi",
                "V": "Vendredi",
                "S": "Samedi"
            };
			const letterForDayE = {
                "L": "Monday",
                "MA": "Tuesday",
                "ME": "Wednesday",
                "J": "Thursday",
                "V": "Friday",
                "S": "Saturday"
            };
            const categories = { C: 'CM', D: 'TD', T: 'TP' };

            
            if (conflicts.length > 0 ) {

                // Filtrer les conflits pour ne garder que ceux liés aux CM (vu que c'est aléatoire, il se peut que juste le dernier emploi du temps ait 2 TD/TP superposés)
                conflicts = conflicts.filter(conflict => {
                    const course1 = schedule.find(course => course.subject === conflict.subject1 && course.day === conflict.day && course.time === conflict.time);
                    const course2 = schedule.find(course => course.subject === conflict.subject2 && course.day === conflict.day && course.time === conflict.time);
                    return course1 && course2 && course1.category.startsWith('C') && course2.category.startsWith('C');
                });

                console.warn('Les matières suivantes se superposent :'.yellow+'\nThe following classes overlap with each other :'.yellow);
                conflicts.forEach(conflict => {
                    console.warn(`${conflict.subject1.cyan} et ${conflict.subject2.cyan} le ${letterForDay[conflict.day].brightYellow} à ${conflict.time.brightMagenta} \n${conflict.subject1.cyan} and ${conflict.subject2.cyan} on ${letterForDayE[conflict.day].brightYellow} at ${conflict.time.brightMagenta}`);
                });
                console.warn("\nAucun emploi du temps sans conflits n'a pu être généré.".red+"\nNo conflictless schedule couldn't be generated.".red);
            } else {
                if (schedule.length > 0) {
                    console.log("Génération de l'emploi du temps...\n".green);
					console.log("Générating schedule...\n".green);
                    console.log('\nEmploi du temps :'.grey);
					console.log('\nSchedule :'.grey);
                    schedule.forEach(event => {
                        console.log(`- ${event.subject.cyan} (${categories[event.category.charAt(0)]}) le ${letterForDay[event.day].brightYellow} à ${event.time.brightMagenta} en salle ${event.room.brightCyan}`);
						console.log(`- ${event.subject.cyan} (${categories[event.category.charAt(0)]}) on ${letterForDayE[event.day].brightYellow} at ${event.time.brightMagenta} in room ${event.room.brightCyan}`);
					});
                    console.log('\n');
                    const exported_schedule_outputPath = exportToICalendar(schedule, 'schedule.ics');
                    if (exported_schedule_outputPath != null) {
                        console.log("Fichier ICalendar exporté dans : ".grey + exported_schedule_outputPath.underline.italic);
						console.log("iCalendar file exported to : ".grey + exported_schedule_outputPath.underline.italic);
                    }
                    else {
                        console.log("Le fichier ICalendar n'a pas pu être exporté ou le chemin d'accès est introuvable".red);
						console.log("The iCalendar file couldn't be exported or the filepath cannot be found".red);
                    }
                } else {
                    console.log("\nAucun emploi du temps sans conflits n'a pu être généré.".red);
					console.log("No conflictless schedule could be generated.".red);
                }
            }
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
