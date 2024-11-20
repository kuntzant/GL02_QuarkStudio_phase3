const { parseAllCruFiles } = require('./parser');
const fs = require('fs');
const path = require('path');

/**
 * Charge et traite les données des fichiers .cru d'un dossier racine
 * @param {string} rootPath - Chemin du dossier racine contenant les sous-dossiers
 * @returns {Object} - Résumé des données traitées
 */
/**
 * Charge et traite les données des fichiers .cru d'un dossier racine
 * @param {string} rootPath - Chemin du dossier racine contenant les sous-dossiers
 * @returns {Object} - Résumé des données traitées
 */
function processCruData(rootPath) {
    const allData = parseAllCruFiles(rootPath);

    const summary = {};

    allData.forEach(course => {
        const { name, sessions } = course;
        if (!summary[name]) {
            summary[name] = {
                totalSessions: 0,
                rooms: new Set(),
                cours: []
            };
        }

        summary[name].totalSessions += sessions.length;
        sessions.forEach(session => {
            if (session.P) {
                participants = parseInt(session.P, 10);
            }
            room = ' ';
            time = ' ';
            day = ' ';
            if (session.S) {
                summary[name].rooms.add(session.S.slice(0, -2));
                room = session.S.slice(0, -2);
            }
            if (session.S) {
                day = session.H.split(' ')[0];
                time = session.H.split(' ')[1];
            }
            summary[name].cours.push({
                category: session.C1,
                room : room,
                participants : participants,
                day: day,
                time: time,
                subCategory: session.F1
            });
        });
    });

    // Transform Set to Array for better JSON serialization
    for (const courseName in summary) {
        summary[courseName].rooms = Array.from(summary[courseName].rooms);
    }

    return summary;
}

/**
 * Sauvegarde un résumé des données dans un fichier JSON
 * @param {Object} summary - Données résumées
 * @param {string} outputFile - Chemin du fichier de sortie
 */
function saveSummaryToFile(summary, outputFile) {
    const summaryJson = JSON.stringify(summary, null, 2);
    fs.writeFileSync(outputFile, summaryJson, 'utf-8');
    console.log(`Résumé sauvegardé dans ${outputFile}`);
}

// Exemple d'utilisation
if (require.main === module) {
    const rootPath = path.resolve(__dirname, '../data'); // Dossier contenant les sous-dossiers .cru
    const outputFile = path.resolve(__dirname, '../output/summary.json');

    console.log('Traitement des données...');
    const summary = processCruData(rootPath);

    console.log('Sauvegarde du résumé...');
    saveSummaryToFile(summary, outputFile);

    console.log('Terminé !');
}

module.exports = { processCruData, saveSummaryToFile };
