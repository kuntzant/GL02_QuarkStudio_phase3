const { createSchedule, exportToICalendar, checkForConflicts } = require('../src/logic/ICalExportLogic');
const fs = require('fs');
const path = require('path');

describe("Exportation des cours au format iCalendar (SPEC5)", function () {
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

    /*
    it("devrait détecter les conflits dans l'emploi du temps", function () {
        const conflictingSchedule = [
            { subject: "COURS", category: "CM", room: "A101", day: "L", time: "08:00-10:00" },
            { subject: "COURSE", category: "TP", room: "B201", day: "L", time: "08:00-10:00" },
        ];
        const conflicts = checkForConflicts(conflictingSchedule);

        expect(conflicts).toEqual([
            { subject1: "COURS1", subject2: "COURSE2", day: "L", time: "08:00-10:00" },
        ]);
    });
    /*
    it("devrait exporter un emploi du temps au format iCalendar", function () {
        const schedule = [
            { subject: "COURS1", category: "CM", room: "A101", day: "L", time: "08:00-10:00" },
        ];
        const fileName = "test_schedule.ics";
        const filePath = exportToICalendar(schedule, fileName);

        expect(filePath).not.toBeNull();

        // Vérifier si le fichier a été créé
        const outputDir = path.resolve(__dirname, '../../output');
        const expectedPath = path.join(outputDir, fileName);
        expect(fs.existsSync(expectedPath)).toBe(true);

        // Nettoyer le fichier de test
        fs.unlinkSync(expectedPath);
    });

    it("devrait retourner null si l'export échoue", function () {
        // Forcer une erreur en redirigeant vers un chemin invalide
        jest.spyOn(fs, 'writeFileSync').mockImplementation(() => { throw new Error(); });

        const schedule = [
            { subject: "COURSE1", category: "CM", room: "A101", day: "L", time: "08:00-10:00" },
        ];
        const filePath = exportToICalendar(schedule, "test_schedule.ics");

        expect(filePath).toBeNull();

        // Restaurer le comportement de `fs.writeFileSync`
        jest.restoreAllMocks();
    });*/
});
