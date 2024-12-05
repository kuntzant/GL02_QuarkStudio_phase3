const { createSchedule, exportToICalendar, checkForConflicts } = require('../src/logic/ICalExportLogic');
const fs = require('fs');
const path = require('path');

describe("Tests unitaires de ICalExport (SPEC5)", function () {
    // Données de test
    const testData = {
        "COURS1": {
            rooms: new Set(["A101", "A102", "B201"]),
            cours: [
                { category: "C", room: "A101", day: "L", time: "08:00-10:00" },
                { category: "D", room: "A102", day: "L", time: "10:00-12:00" },
                { category: "T", room: "B201", day: "ME", time: "14:00-16:00" },
            ],
        },
        "COURS2": {
            rooms: new Set(["A101", "B201"]),
            cours: [
                { category: "C", room: "A101", day: "J", time: "08:00-10:00" },
                { category: "T", room: "B201", day: "MA", time: "14:00-16:00" },
            ],
        },
        "COURS3": {
            rooms: new Set(["A101"]),
            cours: [
                { category: "C", room: "A101", day: "J", time: "08:00-10:00" }
            ],
        }
    };

    it("devrait créer un emploi du temps sans conflits", function () {
        const selectedSubjects = ["COURS1", "COURS2"];
        const schedule = createSchedule(selectedSubjects, testData);
        expect(schedule).toEqual([
            { subject: "COURS1", category: "C", room: "A101", day: "L", time: "08:00-10:00" },
            { subject: "COURS1", category: "D", room: "A102", day: "L", time: "10:00-12:00" },
            { subject: "COURS1", category: "T", room: "B201", day: "ME", time: "14:00-16:00" },
            { subject: "COURS2", category: "C", room: "A101", day: "J", time: "08:00-10:00" },
            { subject: "COURS2", category: "T", room: "B201", day: "MA", time: "14:00-16:00" }
        ]);
    });

    it("devrait renvoyer la matière qui crée le conflit", function () {
        const selectedSubjects = ["COURS_INVALIDE", "COURS2"];
        const schedule = createSchedule(selectedSubjects, testData);
        expect(schedule).toEqual("COURS_INVALIDE");
    });

    
    it("devrait détecter les conflits dans l'emploi du temps", function () {
        const selectedSubjects = ["COURS2", "COURS3"];
        const schedule = createSchedule(selectedSubjects, testData);
        const conflicts = checkForConflicts(schedule);
        expect(conflicts).toEqual([
            { subject1: "COURS2", subject2: "COURS3", day: "J", time: "08:00-10:00" },
        ]);
    });
    
    it("devrait détecter que l'emploi du temps est erroné (il manque la clé day) et renvoyé null", function () {
        const conflicts = checkForConflicts([
            { subject: "COURS1", category: "D", room: "A102", time: "08:00-10:00" },
            { subject: "COURS1", category: "D", room: "A102", day: "L", time: "10:00-12:00" }
        ]);
        expect(conflicts).toBeNull();
    });

    it("devrait détecter que l'emploi du temps est erroné (il n'y a aucun tableau de cours) et renvoyé null", function () {
        const conflicts = checkForConflicts();
        expect(conflicts).toBeNull();
    });
    
    it("devrait exporter un emploi du temps au format iCalendar", function () {
        const schedule = [
            { subject: "COURS1", category: "C", room: "A101", day: "L", time: "08:00-10:00" },
            { subject: "COURS1", category: "D", room: "A102", day: "L", time: "10:00-12:00" },
            { subject: "COURS1", category: "T", room: "B201", day: "ME", time: "14:00-16:00" },
            { subject: "COURS2", category: "C", room: "A101", day: "J", time: "08:00-10:00" },
            { subject: "COURS2", category: "T", room: "B201", day: "MA", time: "14:00-16:00" }
        ];
        const fileName = "test_schedule.ics";
        const filePath = exportToICalendar(schedule, fileName);
        expect(filePath).not.toBeNull();

        // Vérifier si le fichier a été créé
        const outputDir = path.resolve(__dirname, '../output');
        const expectedPath = path.join(outputDir, fileName);
        expect(fs.existsSync(expectedPath)).toBe(true);

        // Nettoyer le fichier de test
        fs.unlinkSync(expectedPath);
    });
    
    it("devrait retourner null si l'export échoue", function () {

        const invalidPath = '/invalid/path/to/output/test_schedule.ics';
        const schedule = [
            { subject: "COURSE1", category: "CM", room: "A101", day: "L", time: "08:00-10:00" }
        ];
        const filePath = exportToICalendar(schedule, invalidPath);
        expect(filePath).toBeNull();

    });
});
