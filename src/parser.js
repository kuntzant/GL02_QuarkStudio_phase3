// parser
const fs = require('fs');
const path = require('path');

// Fonction pour analyser un fichier .cru
function parseCruFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8'); 
    const lines = content.split('\n').slice(8); // Diviser le contenu en lignes et ignorer les 8 premières lignes (lignes inutiles)
    const data = [];

    let currentCourse = null;

    lines.forEach(line => {
        line = line.trim();
        if (!line || line.includes('sec')) return; // Ignorer les lignes vides ou contenant 'sec' (dernières par exemple)

        if (line.startsWith('+')) {
            currentCourse = {
                name: line.slice(1).trim(), // Extraire le nom du cours
                sessions: []
            };
            data.push(currentCourse);
        } else if (currentCourse) {
            const parts = line.split(',');
            const session = {};

            parts.forEach(part => {
                const [key, value] = part.split('='); // Diviser chaque partie en clé et valeur
                if (value == null) { // Si la valeur est nulle (pas de '=' dans la partie analyser)
                    if (key.includes('F')) {
                        session["SubCategory"] = key.trim(); // Ajouter la sous-catégorie si la clé contient 'F'
                    } else if (['C', 'D', 'T'].some(char => key.includes(char))) {
                        session["Category"] = key.trim(); // Ajouter la catégorie si la clé contient 'C', 'D' ou 'T'
                    } else {
                        session[key.trim()] = value ? value.trim() : null; 
                    }
                } else {
                    session[key.trim()] = value ? value.trim() : null; 
                }
            });

            currentCourse.sessions.push(session); 
        }
    });
    return data; 
}

// Fonction pour obtenir les fichiers .cru dans un répertoire
function getCruFiles(directoryPath) {
    const files = fs.readdirSync(directoryPath);
    return files
        .filter(file => file.endsWith('.cru')) // Filtrer les fichiers avec l'extension .cru
        .map(file => path.join(directoryPath, file)); // Retourner les chemins complets des fichiers
}

// Fonction pour analyser tous les fichiers .cru dans un répertoire racine
function parseAllCruFiles(rootPath) {
    const folders = fs.readdirSync(rootPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory()) // Filtrer les dossiers
        .map(dirent => path.join(rootPath, dirent.name)); // Obtenir les chemins complets des dossiers

    let allData = [];
    folders.forEach(folder => {
        const cruFiles = getCruFiles(folder);
        cruFiles.forEach(file => {
            const data = parseCruFile(file);
            allData = allData.concat(data); // Ajouter les données analysées à la liste globale
        });
    });

    return allData; 
}

module.exports = { parseCruFile, getCruFiles, parseAllCruFiles };
