const { calculateOccupancyRateForAllRooms } = require('../src/logic/roomOccupancyRateLogic.js');

describe("Tests unitaires de roomOccupancyRate (SPEC7)", function () {
    
    // Données de test
    const testData = {
        "COURS1": {
            rooms: new Set(["A101"]),
            cours: [
                {
                    "category": "D1",
                    "room": "A101",
                    "participants": 96,
                    "day": "L",
                    "time": "16:00-18:00",
                    "subCategory": "F1"
                },
                {
                    "category": "C1",
                    "room": "A101",
                    "participants": 96,
                    "day": "ME",
                    "time": "8:00-10:00",
                    "subCategory": "F1"
                }
            ]
        },
        "COURS2": {
            rooms: new Set(["A101"]),
            cours: [
                {
                    "category": "C1",
                    "room": "A101",
                    "participants": 96,
                    "day": "L",
                    "time": "8:00-10:00",
                    "subCategory": "F1"
                }
            ]
        }
    };

    it("devrait calculer le taux d'occupation d'une salle spécifique (A101)", function () {
        const occupancyRate = calculateOccupancyRateForAllRooms(testData);
        
        const expectedOccupancyRate = 8.333333333333332;  // pourcentage d'occupation pour 6h (en sachant 
                                                          // que l'on considère que les salles sont ouvertes 
                                                          // de 8h à 20h tous les jours de la semaine donc 84h)
        const expectedCapacity = 96; // Supposons une capacité de 96 personnes pour A101
        expect(occupancyRate).toEqual([
            {
                room: 'A101',
                occupancyRate: expectedOccupancyRate,
                capacity: expectedCapacity
            }
        ]);
    });

    it("devrait retourner un message d'erreur si aucune donnée d'occupation n'est disponible", function () {
        const testData = {};  // Données vides
        const occupancyRate = calculateOccupancyRateForAllRooms(testData);
        expect(occupancyRate).toEqual({ error: "Aucune donnée de taux d'occupation n'est disponible." });
    });

    it("devrait exclure les cours dont le nom de la salle, le nombre de participants, le jour ou l'heure"/
        " n'est pas indiqué (en l'occurence ici, affiche l'erreur 'Aucune donnée' puisque la liste vide)", function () {
        const testData = {"COURS1": {
            rooms: new Set(["A101"]),
            cours: [
                {
                    "category": "D1",
                    "room": "A101",
                    "participants": 96,
                    "day": "",
                    "time": "16:00-18:00",
                    "subCategory": "F1"
                }
            ]
        }};
        
        const occupancyRate = calculateOccupancyRateForAllRooms(testData);
        expect(occupancyRate).toEqual({ error: "Aucune donnée de taux d'occupation n'est disponible." });
    });

    it("devrait exclure les cours dont le taux d'occupation ou la capacité n'a pas pu être calculé"/
        " (en l'occurence ici, renvoie une liste vide)", function () {
        const testData = {"COURS1": {
            rooms: new Set(["A101"]),
            cours: [
                {
                    "category": "D1",
                    "room": "A101",
                    "participants": 96,
                    "day": "J",
                    "time": "16:00", // Heure incorrecte
                    "subCategory": "F1"
                }
            ]
        }};
        
        const occupancyRate = calculateOccupancyRateForAllRooms(testData);
        expect(occupancyRate).toEqual([]);
    });
});
