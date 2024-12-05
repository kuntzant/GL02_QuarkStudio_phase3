const { getRoomAvailability } = require('../src/logic/roomAvailabilityLogic');

describe("Tests unitaires de roomAvailability (SPEC3)", function() {

    // Données de test
    const testData = {
        "COURS1": {
            cours: [
                { room: "A101", day: "L", time: "08:00-10:00" },
                { room: "A101", day: "L", time: "10:00-12:00" },
                { room: "A102", day: "M", time: "14:00-16:00" }
            ]
        },
        "COURS2": {
            cours: [
                { room: "A101", day: "MA", time: "16:00-18:00" },
                { room: "B201", day: "V", time: "09:00-11:00" },
                { room: "C201", day: "S", time: "08:00-12:00" }
            ]
        },
        "COURS3": {
            cours: [
                { room: "C201", day: "J", time: "13:00-15:00" }
            ]
        }
    };

    it("devrait retourner les créneaux disponibles pour une salle existante avec plusieurs sessions de cours", function() {
        const roomNumber = "A101";
        const availability = getRoomAvailability(roomNumber, testData);
        const expected = {
            "L": ["12:00-20:00"],
            "MA": ["08:00-16:00", "18:00-20:00"],
            "ME": ["08:00-20:00"],
            "J": ["08:00-20:00"],
            "V": ["08:00-20:00"],
            "S": ["08:00-20:00"],
        };
        expect(availability).toEqual(expected);
    });

    it("devrait retourner les créneaux disponibles pour une salle existante avec une session de cours", function() {
        const roomNumber = "C201";
        const availability = getRoomAvailability(roomNumber, testData);
        const expected = {
            "L": ["08:00-20:00"],
            "MA": ["08:00-20:00"],
            "ME": ["08:00-20:00"],
            "J": ["08:00-13:00", "15:00-20:00"],
            "V": ["08:00-20:00"],
            "S": ["12:00-20:00"],
        };
        expect(availability).toEqual(expected);
    });

    it("devrait retourner un objet vide pour une salle sans sessions de cours", function() {
        const roomNumber = "D401";
        const availability = getRoomAvailability(roomNumber, testData);
        expect(availability).toEqual({});
    });

    it("devrait gérer les codes de salles sensibles à la casse", function() {
        const roomNumber = "  a101 "; // test en minuscules avec un espace
        const availability = getRoomAvailability(roomNumber, testData);
        const expected = {
            "L": ["12:00-20:00"],
            "MA": ["08:00-16:00", "18:00-20:00"],
            "ME": ["08:00-20:00"],
            "J": ["08:00-20:00"],
            "V": ["08:00-20:00"],
            "S": ["08:00-20:00"],
        };
        expect(availability).toEqual(expected);
    });

    it("devrait retourner un objet vide pour une salle inexistante", function() {
        const roomNumber = "Z999";
        const availability = getRoomAvailability(roomNumber, testData);
        expect(availability).toEqual({});
    });

});
