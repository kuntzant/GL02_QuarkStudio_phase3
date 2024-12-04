const { searchRoomsForCourse } = require('../src/logic/roomSearchLogic');

describe("Tests unitaires de roomSearch (SPEC1)", function() {

    // On crée des données de test
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
                { room: "B201", day: "MA", time: "14:00-16:00" }
            ]
        },
        "COURS3": {
            rooms: new Set([]),
            cours: []
        }
    };

    it("devrait retourner les salles pour un cours valide avec des salles", function() {
        const courseCode = "COURS1";
        const rooms = searchRoomsForCourse(courseCode, testData);
        expect(rooms).toEqual(["A101", "A102"]);
    });

    it("devrait retourner un tableau vide pour un cours valide sans salles", function() {
        const courseCode = "COURS3";
        const rooms = searchRoomsForCourse(courseCode, testData);
        expect(rooms).toEqual([]);
    });

    it("devrait retourner null pour un cours invalide", function() {
        const courseCode = "COURS_INVALIDE";
        const rooms = searchRoomsForCourse(courseCode, testData);
        expect(rooms).toBeNull();
    });

    it("devrait gérer les codes de cours sensibles à la casse", function() {
        const courseCode = "cours1"; //test en minuscuule
        const rooms = searchRoomsForCourse(courseCode.toUpperCase(), testData);
        expect(rooms).toEqual(["A101", "A102"]);
    });

});