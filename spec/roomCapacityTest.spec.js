const { getRoomCapacity } = require('../src/logic/roomCapacityLogic');

describe("Tests unitaires de roomCapacity (SPEC2)", function() {

    // Données de test
    const donneesTest = {
        "COURS1": {
            cours: [
                { room: "A101", participants: 30 },
                { room: "A102", participants: 25 }
            ]
        },
        "COURS2": {
            cours: [
                { room: "B201", participants: 40 },
                { room: "A101", participants: 35 }
            ]
        },
        "COURS3": {
            cours: [
                { room: "C201", participants: 20 }
            ]
        },
        "COURS4": { 
            cours: [{ room: "D901", participants: 0 }] 
        }
    };

    it("devrait retourner la capacité maximale pour une salle existante avec plusieurs sessions de cours", function() {
        const numeroSalle = "A101";
        const capacite = getRoomCapacity(numeroSalle, donneesTest);
        expect(capacite).toEqual(35);
    });

    it("devrait retourner la capacité maximale pour une salle existante avec une seule session de cours", function() {
        const numeroSalle = "C201";
        const capacite = getRoomCapacity(numeroSalle, donneesTest);
        expect(capacite).toEqual(20);
    });

    it("devrait retourner 0 pour une salle existante sans participants", function() {
        const numeroSalle = "D901";
        const capacite = getRoomCapacity(numeroSalle, donneesTest);
        expect(capacite).toEqual(0);
    });

    it("devrait retourner 0 pour une salle inexistante", function() {
        const numeroSalle = "JSP10";
        const capacite = getRoomCapacity(numeroSalle, donneesTest);
        expect(capacite).toEqual(0);
    });


});