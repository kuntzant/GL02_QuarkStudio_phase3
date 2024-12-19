const { parseAllCruFiles } = require('./parser'); // Importer depuis le module parser
const fs = require('fs'); 
const path = require('path'); 

function processCruData(rootPath) {
    const allData = parseAllCruFiles(rootPath); // Analyser tous les fichiers CRU 

    // Pour regrouper toutes données et les organisées
    const summary = {}; 

    allData.forEach(course => {
        const { name, sessions } = course; // Déstructurer le code du cours et toutes les sessions de chaque cours
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
                participants = parseInt(session.P, 10); // Transformation en int (base 10)
            }
            room = ' ';
            time = ' ';
            day = ' ';
            if (session.S) {
                summary[name].rooms.add(session.S.slice(0, -2)); // Pour avoir l'ensemble des salles pour chaque un cours
                room = session.S.slice(0, -2);
            }
            if (session.S) {
                day = session.H.split(' ')[0]; // Extraire le jour de la session
                time = session.H.split(' ')[1]; // Extraire l'heure de la session
            }
            summary[name].cours.push({
                category: session["Category"],
                room : room,
                participants : participants,
                day: day,
                time: time,
                subCategory: session["SubCategory"]
            });
        });
    });

    // Transformer Set en Array pour une meilleure sérialisation JSON
    for (const courseName in summary) {
        summary[courseName].rooms = Array.from(summary[courseName].rooms);
    }

    return summary; 
}

function saveSummaryToFile(summary, outputFile) {
    const summaryJson = JSON.stringify(summary, null, 2); // Convertir l'objet résumé en chaîne JSON
    fs.writeFileSync(outputFile, summaryJson, 'utf-8'); // Écrire la chaîne JSON dans le fichier de sortie
    console.log(`Résumé sauvegardé dans ${outputFile}`); 
	onsole.log(`Summary saved in ${outputFile}`); 
}

// Exemple d'utilisation
if (require.main === module) {
    const rootPath = path.resolve(__dirname, '../data'); // Source
    const outputFile = path.resolve(__dirname, '../output/summary.json'); // Destination

    console.log('Traitement des données...'); 
	console.log('Data processing...'); 
    const summary = processCruData(rootPath); // Traiter les données CRU et obtenir le résumé

    console.log('Sauvegarde du résumé...'); 
	console.log('Saving the summary...'); 
    saveSummaryToFile(summary, outputFile); // Sauvegarder le résumé dans le fichier de destination

    console.log('Terminé !'); 
	console.log('Done !'); 
}

module.exports = { processCruData, saveSummaryToFile }; // Exporter les fonctions pour être utilisées dans les SPECs
