const { detectConflicts } = require('../src/logic/scheduleConflictCheckLogic.js');
const colors = require('colors');



// Suite de tests
describe("Tests unitaires de scheduleConflictCheck (SPEC6)", function () {

    // Données de test
    const testData = {
        "COURS1": {
            rooms: new Set(["A101", "A102"]),
            cours: [
                { category: "CM", room: "A101", day: "L", time: "08:00-10:00" },
                { category: "TD", room: "A102", day: "L", time: "10:00-12:00" }
            ],
        },
        "COURS2": {
            rooms: new Set(["A101"]),
            cours: [
                { category: "CM", room: "A101", day: "L", time: "09:00-11:00" }
            ],
        },
        "COURS3": {
            rooms: new Set(["A102"]),
            cours: [
                { category: "CM", room: "A102", day: "L", time: "12:00-14:00" }
            ],
        },
        "COURS4": {
            rooms: new Set(["A101"]),
            cours: [
                { category: "TP", room: "A101", day: "MA", time: "08:30-10:30" } 
            ],
        }
    };

    it("devrait détecter un conflit entre deux cours dans la même salle sur le même jour", function () {
        const { conflicts, malformedSessions } = detectConflicts(testData);
        expect(conflicts).toEqual([{
            room: "A101",
            day: "L",
            conflict: [
                { time: "09:00-11:00", course: "COURS2" },
                { time: "08:00-10:00", course: "COURS1" }
            ]
        }]);
        expect(malformedSessions).toEqual([]);
    });
    
    it("ne devrait pas détecter de conflit entre des cours dans des salles différentes", function () {
        const testData2 = {
        "COURS2": {
            rooms: new Set(["A101"]),
            cours: [
                { category: "CM", room: "A101", day: "L", time: "09:00-11:00" }
            ],
        },
        "COURS3": {
            rooms: new Set(["A102"]),
            cours: [
                { category: "CM", room: "A102", day: "L", time: "10:00-12:00" }
            ],
        },
        "COURS4": {
            rooms: new Set(["A101"]),
            cours: [
                { category: "TP", room: "A101", day: "MA", time: "08:30-10:30" } 
            ],
        }};
        const { conflicts, malformedSessions } = detectConflicts(testData2);
        expect(conflicts).toEqual([]); // Aucun conflit
        expect(malformedSessions).toEqual([]);
    });

    it("devrait afficher les sessions mal formattées (sans salle, jour ou horaire)", function () {
        const testData3 = {
        "COURS5": {
            rooms: new Set(["A101"]),
            cours: [
                { category: "CM", room: null, day: "J", time: null }
            ]
        }};

        const { conflicts, malformedSessions } = detectConflicts(testData3);
        expect(conflicts).toEqual([]); // Aucun conflit
        expect(malformedSessions).toEqual([{courseName: 'COURS5', session: { category: 'CM', room: null, day: 'J', time: null }}]);
    });
});
