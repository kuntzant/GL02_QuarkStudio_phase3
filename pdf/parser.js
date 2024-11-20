const fs = require('fs');

/**
 * Fonction pour lire et analyser un fichier CRU
 * @param {string} filePath - Chemin du fichier CRU
 * @returns {object} - Données organisées
 */
function parseCRUFile(filePath) {
  const data = fs.readFileSync(filePath, 'utf8');
  const lines = data.split('\n');
  const result = { courses: {}, rooms: {} };
  let currentCourse = null;

  lines.forEach(line => {
    line = line.trim();
    if (line.startsWith('+')) {
      // Nouveau cours
      currentCourse = line.substring(1);
      result.courses[currentCourse] = [];
    } else if (line && currentCourse) {
      // Créneau d'enseignement
      const [index, type, capacity, time, subgroup, room] = line.split(',');
      const day = time.split('=')[1].split(' ')[0];
      const hours = time.split(' ')[1];
      const roomName = room.split('=')[1].replace('//', '');

      const entry = {
        type: type.split('=')[1],
        capacity: parseInt(capacity.split('=')[1], 10),
        day,
        time: hours,
        subgroup: subgroup.split('=')[1],
        room: roomName,
      };

      // Ajouter au cours
      result.courses[currentCourse].push(entry);

      // Ajouter à la salle
      if (!result.rooms[roomName]) {
        result.rooms[roomName] = {
          capacity: entry.capacity,
          schedule: [],
        };
      }
      result.rooms[roomName].schedule.push({ course: currentCourse, ...entry });
    }
  });

  return result;
}

// Exemple d'utilisation
const data = parseCRUFile('./data.cru'); // Remplacez par le chemin vers votre fichier
console.log(JSON.stringify(data, null, 2));
