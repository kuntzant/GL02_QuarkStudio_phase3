const { getAvailableRooms, isValidDay, isValidTimeRange } = require('../src/logic/roomTimeAvailabilityLogic.js');

describe("Tests unitaires de roomTimeAvailability (SPEC4)", function() {

    // Données de test
    const testData = {
        "COURS1": {
            rooms: new Set(["A101", "A102"]),
            cours: [
                { room: "A101", day: "L", time: "08:00-10:00" },
                { room: "A102", day: "L", time: "10:00-12:00" }
            ]
        },
        "COURS2": {
            rooms: new Set(["B201"]),
            cours: [
                { room: "B201", day: "L", time: "08:00-10:00" },
                { room: "B201", day: "MA", time: "14:00-16:00" }
            ]
        }
    };

    it("devrait retourner aucune salle puisque toutes les salles sont occupées à ce créneau", function() {
        const day = "L";
        const timeRange = "09:00-11:00";
        const availableRooms = getAvailableRooms(day, timeRange, testData);
        expect(availableRooms).toEqual([]);
    });

    it("devrait retourner toutes les salles du jeu de données", function() {
        const day = "MA";
        const timeRange = "12:00-14:00";
        const availableRooms = getAvailableRooms(day, timeRange, testData);
        expect(availableRooms).toEqual(["A101", "A102", "B201"]);
    });

    it("devrait retourner null car le jour n'est pas valide", function() {
        const day = "JOUR_INVALIDE";
        const timeRange = "10:00-12:00";
        const availableRooms = getAvailableRooms(day, timeRange, testData);
        expect(availableRooms).toEqual(null);
    });

    it("devrait retourner null car l'heure n'est pas valide", function() {
        const day = "L";
        const timeRange = "HEURE_INVALIDE";
        const availableRooms = getAvailableRooms(day, timeRange, testData);
        expect(availableRooms).toEqual(null);
    });

    it("devrait gérer les entrées avec des casses différentes", function() {
        const day = "  l "; // minuscule + espaces
        const timeRange = " 08:00-10:00  ";
        const availableRooms = getAvailableRooms(day, timeRange, testData);
        expect(availableRooms).toEqual(["A102"]);
    });

});
