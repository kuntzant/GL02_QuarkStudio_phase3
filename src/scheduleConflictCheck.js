const { processCruData } = require('./controller');
const readline = require('readline');
const path = require('path');
const colors = require('colors');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const rootPath = path.resolve(__dirname, '../data'); // Dossier contenant les sous-dossiers .cru
const summary = processCruData(rootPath);

function parseTimeRange(timeRange) {
    const [start, end] = timeRange.split('-').map(time => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes; // Convertir en minutes pour comparaison
    });
    return { start, end };
}


