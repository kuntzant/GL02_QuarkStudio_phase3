const fs = require('fs');
const path = require('path');

/**
 * Parse un fichier .cru pour extraire les données structurées
 * @param {string} filePath - Chemin du fichier .cru
 * @returns {Array} - Données structurées du fichier
 */
function parseCruFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const data = [];

    let currentCourse = null;

    lines.forEach(line => {
        line = line.trim();
        if (!line) return;

        if (line.startsWith('+')) {
            currentCourse = {
                name: line.slice(1).trim(),
                sessions: []
            };
            data.push(currentCourse);
        } else if (currentCourse) {
            const parts = line.split(',');
            const session = {};

            parts.forEach(part => {
                const [key, value] = part.split('=');
                session[key.trim()] = value ? value.trim() : null;
            });

            currentCourse.sessions.push(session);
        }
    });

    return data;
}

/**
 * Récupère tous les fichiers .cru dans un dossier donné
 * @param {string} directoryPath - Chemin du dossier
 * @returns {Array} - Liste des fichiers .cru trouvés
 */
function getCruFiles(directoryPath) {
    const files = fs.readdirSync(directoryPath);
    return files
        .filter(file => file.endsWith('.cru'))
        .map(file => path.join(directoryPath, file));
}

/**
 * Parse tous les fichiers .cru dans un ensemble de dossiers
 * @param {string} rootPath - Chemin du dossier racine contenant les sous-dossiers
 * @returns {Array} - Données combinées de tous les fichiers
 */
function parseAllCruFiles(rootPath) {
    const folders = fs.readdirSync(rootPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => path.join(rootPath, dirent.name));

    let allData = [];
    folders.forEach(folder => {
        const cruFiles = getCruFiles(folder);
        cruFiles.forEach(file => {
            const data = parseCruFile(file);
            allData = allData.concat(data);
        });
    });

    return allData;
}

module.exports = { parseCruFile, getCruFiles, parseAllCruFiles };