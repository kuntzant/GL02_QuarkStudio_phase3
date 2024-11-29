// SPEC 5
const { processCruData } = require('./controller');
const fs = require('fs');
const path = require('path');
const colors = require('colors');

const rootPath = path.resolve(__dirname, '../data'); // Dossier contenant les sous-dossiers .cru
const summary = processCruData(rootPath);

function getRandomElements(arr) {
    // Mélanger les éléments pour les sélectionner aléatoirement
    return arr.sort(() => 0.5 - Math.random());
}

function createSchedule(data, numberOfSubjects = 6) {
    const subjects = Object.keys(data);
    const shuffledSubjects = getRandomElements(subjects);
    const selectedSubjects = [];
    const schedule = [];

    // Utilisé pour vérifier les conflits d'horaires
    const occupiedSlots = {};

    while (selectedSubjects.length < numberOfSubjects && shuffledSubjects.length > 0) {
        const subject = shuffledSubjects.shift(); // Prendre la première matière aléatoire
        const subjectData = data[subject];
        const courses = subjectData.cours;

        const cm = courses.find(c => c.category.startsWith('C'));
        const td = courses.find(c => c.category.startsWith('D'));
        const tp = courses.find(c => c.category.startsWith('T'));

        // Vérifier si un CM et un TD sont disponibles
        if (!cm || !td) {
            continue;
        }

        // Vérifier les conflits pour les créneaux
        if (!isSlotOccupied(occupiedSlots, cm) &&
            !isSlotOccupied(occupiedSlots, td) &&
            (!tp || !isSlotOccupied(occupiedSlots, tp))) {

            // Ajouter la matière et ses cours
            selectedSubjects.push(subject);
            schedule.push(formatCourse(subject, cm));
            schedule.push(formatCourse(subject, td));
            markSlotAsOccupied(occupiedSlots, cm);
            markSlotAsOccupied(occupiedSlots, td);

            if (tp) {
                schedule.push(formatCourse(subject, tp));
                markSlotAsOccupied(occupiedSlots, tp);
            }
        }
    }

    // Vérifier si le nombre de matières requis est atteint
    if (selectedSubjects.length < numberOfSubjects) {
        console.error(`Impossible de créer un emploi du temps avec ${numberOfSubjects} matières.`);
    }

    return schedule;
}

function isSlotOccupied(occupiedSlots, course) {
    const key = `${course.day}-${course.time}`;
    return occupiedSlots[key];
}

function markSlotAsOccupied(occupiedSlots, course) {
    const key = `${course.day}-${course.time}`;
    occupiedSlots[key] = true;
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
    firstLetter = category.charAt(0);
    const categories = { C: 'CM', D: 'TD', T: 'TP'};
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
    console.log(`Fichier ICalendar exporté dans : ${outputPath}`);
}

// Générer un emploi du temps et l'afficher


const schedule = createSchedule(summary, 6);
console.log('Emploi du temps généré');
exportToICalendar(schedule, 'schedule.ics');



