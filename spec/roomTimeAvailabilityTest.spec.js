const { getAvailableRooms, isValidDay, isValidTimeRange } = require('../src/logic/roomTimeAvailabilityLogic.js');

describe("Vérification des salles disponibles pour un créneau horaire donné (SPEC4)", function() {

    // Données de test
    const summary = {
        "COURSE1": {
            rooms: new Set(["A101", "A102"]),
            cours: [
                { room: "A101", day: "L", time: "08:00-10:00" },
                { room: "A102", day: "L", time: "10:00-12:00" }
            ]
        },
        "COURSE2": {
            rooms: new Set(["B201"]),
            cours: [
                { room: "B201", day: "MA", time: "14:00-16:00" }
            ]
        }
    };

    it("devrait retourner les salles disponibles pour un créneau horaire valide", function() {
        const day = "L";
        const timeRange = "09:00-11:00";
        const availableRooms = getAvailableRooms(day, timeRange, summary);

        expect(availableRooms).toEqual(["A102"]);
    });
});
