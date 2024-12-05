const { calculateOccupancyRateForAllRooms } = require('../src/logic/roomOccupancyRateLogic.js');

describe("Tests unitaires de roomOccupancyRate (SPEC7)", function () {
    
    // Données de test
    const testData = {
        "COURS1": {
            rooms: new Set(["A101"]),
            cours: [
                { category: "CM", room: "A101", day: "L", time: "08:00-10:00" },
                { category: "TD", room: "A101", day: "L", time: "10:00-12:00" }
            ]
        },
        "COURS2": {
            rooms: new Set(["A101"]),
            cours: [
                { category: "CM", room: "A101", day: "L", time: "09:00-11:00" }
            ]
        }
    };

    it("devrait calculer le taux d'occupation d'une salle spécifique (A101)", function () {
        const { conflicts, malformedSessions } = calculateOccupancyRateForAllRooms(testData);
        
        // L'heure totale par jour est de 720 minutes (8h à 20h)
        const expectedOccupancyRate = 25;  // 180 minutes occupées sur 720 minutes sur un jour
        const expectedCapacity = 50; // Supposons une capacité de 50 personnes pour A101
        
        expect(conflicts).toEqual([]);
        expect(malformedSessions).toEqual([]);
        expect(occupancyRate).toEqual([
            {
                room: 'A101',
                occupancyRate: expectedOccupancyRate,
                capacity: expectedCapacity
            }
        ]);
    });
});
