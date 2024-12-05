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


    // Les temps retorus sosont en minutes
    // 08:00 -> 480
    // 09:00 -> 540
    // 10:00 -> 600
    // 11:00 -> 660
    // 12:00 -> 720
    // 13:00 -> 780
    // 14:00 -> 840
    // 15:00 -> 900
    // 16:00 -> 960
    // 17:00 -> 1020
    // 18:00 -> 1080
    // 19:00 -> 1140
    // 20:00 -> 1200
    
    it("devrait retourner les créneaux disponibles pour une salle existante avec plusieurs sessions de cours", function() {
        const roomNumber = "A101";
        const availability = getRoomAvailability(roomNumber, testData);
        const expected = {
            "L": [{ start: 720, end: 1200 }],
            "MA": [{start: 480, end: 960},{start: 1080 ,end: 1200}],
            "ME": [{ start: 480, end: 1200 }],
            "J": [{ start: 480, end: 1200 }],
            "V": [{ start: 480, end: 1200 }],
            "S": [{ start: 480, end: 1200 }],
        };
        expect(availability).toEqual(expected);
    });

    it("devrait retourner les créneaux disponibles pour une salle existante avec une session de cours", function() {
        const roomNumber = "C201";
        const availability = getRoomAvailability(roomNumber, testData);
        const expected = {
            "L": [{ start: 480, end: 1200 }],
            "MA": [{start: 480, end: 1200}],
            "ME": [{ start: 480, end: 1200 }],
            "J": [{ start: 480, end: 780 }, { start: 900, end: 1200 }],
            "V": [{ start: 480, end: 1200 }],
            "S": [{ start: 720, end: 1200 }],
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
            "L": [{ start: 720, end: 1200 }],
            "MA": [{start: 480, end: 960},{start: 1080 ,end: 1200}],
            "ME": [{ start: 480, end: 1200 }],
            "J": [{ start: 480, end: 1200 }],
            "V": [{ start: 480, end: 1200 }],
            "S": [{ start: 480, end: 1200 }],
        };
        expect(availability).toEqual(expected);
    });

    it("devrait retourner un objet vide pour une salle inexistante", function() {
        const roomNumber = "Z999";
        const availability = getRoomAvailability(roomNumber, testData);
        expect(availability).toEqual({});
    });

});