// SPEC 5
const { processCruData } = require('../controller');
const fs = require('fs');
const path = require('path');

// Chemin racine des données et ajout des données CRU
const rootPath = path.resolve(__dirname, '../../data');
const summary = processCruData(rootPath);

// Fonction pour créer un emploi du temps
function createSchedule(selectedSubjects) {
    const schedule = [];
    const data = summary;

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
    const outputDir = path.resolve(__dirname, '../../output');
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
    try {
        fs.writeFileSync(outputPath, icalContent);
        return outputPath;
    } catch {
        return null;
    }
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


module.exports = { createSchedule, exportToICalendar, checkForConflicts };