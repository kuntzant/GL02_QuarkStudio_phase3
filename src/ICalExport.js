// SPEC 5
const { processCruData } = require('./controller');
const fs = require('fs');
const path = require('path');
const colors = require('colors');
const readline = require('readline');

const rootPath = path.resolve(__dirname, '../data'); // Dossier contenant les sous-dossiers .cru
const summary = processCruData(rootPath);


function createSchedule(data, selectedSubjects) {
    const schedule = [];

    selectedSubjects.forEach(subject => {
        const subjectData = data[subject];
        if (!subjectData) {
            console.warn("La matière ".yellow + subject.cyan+" n'existe pas dans les données.".yellow);
            return;
        }
        const courses = subjectData.cours;

        const cm = courses.find(c => c.category.startsWith('C'));
        const td = courses.find(c => c.category.startsWith('D'));
        const tp = courses.find(c => c.category.startsWith('T'));

        const getRandomCourse = (courses, category) => {
            const filteredCourses = courses.filter(c => c.category.startsWith(category));
            return filteredCourses[Math.floor(Math.random() * filteredCourses.length)];
        };
    
        if (cm) {schedule.push(formatCourse(subject, getRandomCourse(courses, 'C')));}
        if (td) {schedule.push(formatCourse(subject, getRandomCourse(courses, 'D')));}
        if (tp) {schedule.push(formatCourse(subject, getRandomCourse(courses, 'T')));}
    });
    
    return schedule;
}

function formatCourse(subject, course) {
    return {
        subject, // Ajouter le nom de la matière
        category: course.category,
        room: course.room,
        day: course.day,
        time: course.time,
    };
}

function convertDayToICal(day) {
    const days = { L: 'MO', MA: 'TU', ME: 'WE', J: 'TH', V: 'FR', S: 'SA', D: 'SU' };
    return days[day] || 'MO';
}

function convertCategoryToICal(category) {
    const firstLetter = category.charAt(0);
    const categories = { C: 'CM', D: 'TD', T: 'TP' };
    return categories[firstLetter];
}

function formatTimeToICal(time) {
    const [start, end] = time.split('-');
    return {
        start: start.replace(':', '') + '00',
        end: end.replace(':', '') + '00',
    };
}

function exportToICalendar(schedule, fileName) {
    // Construire le chemin vers le dossier "output"
    const outputDir = path.resolve(__dirname, '../output');
    const outputPath = path.join(outputDir, fileName);

    // Contenu du fichier ICalendar
    let icalContent = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nCALSCALE:GREGORIAN\r\n`;

    schedule.forEach(course => {
        const { day, time, subject, category, room } = course;
        const { start, end } = formatTimeToICal(time);

        icalContent += `BEGIN:VEVENT\r\n`;
        icalContent += `SUMMARY:${subject} (${convertCategoryToICal(category)})\r\n`;
        icalContent += `LOCATION:${room}\r\n`;
        icalContent += `DTSTART;TZID=Europe/Paris:20231129T${start}\r\n`;
        icalContent += `DTEND;TZID=Europe/Paris:20231129T${end}\r\n`;
        icalContent += `RRULE:FREQ=WEEKLY;BYDAY=${convertDayToICal(day)}\r\n`;
        icalContent += `END:VEVENT\r\n`;
    });

    icalContent += `END:VCALENDAR\r\n`;

    // Écrire dans le fichier
    fs.writeFileSync(outputPath, icalContent);
    console.log("Fichier ICalendar exporté dans : ".grey + outputPath.underline.italic);
}

function checkForConflicts(schedule) {
    const conflicts = [];
    const slotMap = {};

    schedule.forEach(course => {
        const key = `${course.day}-${course.time}`;
        if (slotMap[key] && slotMap[key] !== course.subject) {
            conflicts.push({
                subject1: slotMap[key],
                subject2: course.subject,
                day: course.day,
                time: course.time,
            });
        } else {
            slotMap[key] = course.subject;
        }
    });

    return conflicts;
}




async function promptICalExport(rl) {
    console.log("Exportation des cours au format iCalendar".inverse);
    const courses = await promptUser("Veuillez entrer les codes des cours à exporter (séparés par des virgules) : ", rl);
    const selectedCourses = courses.toUpperCase().split(',').map(code => code.trim());
    console.log("Génération de l'emploi du temps...\n".green);

    let schedule = createSchedule(summary, selectedCourses);
    let conflicts = checkForConflicts(schedule);

    // Tester 100000 emplois du temps pour voir s'il en existe sans conflits
    let attempts = 0;
    while (conflicts.length > 0 && attempts < 100000) {
        attempts++;
        schedule = createSchedule(summary, selectedCourses);
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
            exportToICalendar(schedule, 'schedule.ics');
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
