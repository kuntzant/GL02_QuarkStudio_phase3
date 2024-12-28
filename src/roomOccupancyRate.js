const readline = require('readline');
const colors = require('colors');
const { calculateOccupancyRateForAllRooms } = require('./logic/roomOccupancyRateLogic');
const vg = require('vega');
const vegalite = require('vega-lite');
const fs = require('fs');
const path = require('path');

// Fonction pour demander à l'utilisateur s'il souhaite calculer le taux d'occupation des salles
async function promptRoomOccupancy(rl) {
    console.log("Analyse du taux d'occupation des salles".inverse);
    console.log("Rooms' occupancy rate analysis".inverse);
    const occupancyRates = calculateOccupancyRateForAllRooms();
    
    if (occupancyRates.error) {
        console.log(occupancyRates.error.red);
    } else {
        let sortChoice = '';
        do {
            sortChoice = (await promptUser("Voulez-vous trier par taux d'occupation ["+"1".grey+"] ou par capacité ["+"2".grey+"] ?  \n Do you want to sort by occupancy rate ["+"1".grey+"] or by capacity ["+"2".grey+"] ?", rl)).trim();
            if (sortChoice !== '1' && sortChoice !== '2') {
                console.log("Choix invalide. Veuillez choisir "+"1".grey+" pour trier par "+"taux d'occupation".red+" ou "+"2".grey+" pour trier "+"par capacité.".red);
                console.log("Invalid choice. Please choose "+"1".grey+" to sort by "+"occupancy rate".red+" or "+"2".grey+" to sort by "+"capacity.".red);
            }
        } while (sortChoice !== '1' && sortChoice !== '2');
        
        if (sortChoice === '1') {
            occupancyRates.sort((a, b) => b.occupancyRate - a.occupancyRate);
            console.log("Taux d'occupation des salles trié par taux d'occupation :".inverse);
            console.log("Rooms' occupancy rate sorted by occupancy rate :".inverse);
        } else if (sortChoice === '2') {
            occupancyRates.sort((a, b) => b.capacity - a.capacity);
            console.log("Taux d'occupation des salles trié par capacité :".inverse);
            console.log("Rooms' occupancy rate sorted by capacity :".inverse);
        } else {
            console.log("Choix invalide. Tri par taux d'occupation par défaut.".yellow);
            console.log("Invalid Choice. Sorting by occupancy rate by default.".yellow);
            occupancyRates.sort((a, b) => b.occupancyRate - a.occupancyRate);
        }

        console.log("Salle".padEnd(10) + "Taux d'occupation".padEnd(20) + "Capacité");
        console.log("Room".padEnd(10) + "Occupancy rate".padEnd(20) + "Capacity");
        console.log("-".repeat(60));
        occupancyRates.forEach(({ room, occupancyRate, capacity }) => {
            if (room.trim() !== "") {
                console.log(room.brightCyan.padEnd(20) + occupancyRate.toFixed(2).toString().brightGreen +"%".grey.padEnd(25)+ capacity.toString().brightGreen+" personnes/people".grey);
            }
        });

        const outputFileName = path.join(__dirname, '../output/occupancyRateChart.svg');
        const data = occupancyRates.reduce((acc, { room, occupancyRate }) => {
            acc[room] = occupancyRate;
            return acc;
        }, {});

        const histogramData = Object.entries(data).map(([room, occupancyRate]) => ({
            Room: room,
            OccupancyRate: occupancyRate,
        }));

        const chartSpec = {
            data: { values: histogramData },
            mark: 'bar',
            encoding: {
                x: {
                    field: 'Room',
                    type: 'ordinal',
                    axis: { title: 'Salle / Room' },
                    sort: { field: 'OccupancyRate', order: 'descending' }
                },
                y: {
                    field: 'OccupancyRate',
                    type: 'quantitative',
                    axis: { title: 'Taux d\'occupation (%) / Occupancy Rate (%)' },
                },
                color: {
                    field: 'OccupancyRate',
                    type: 'quantitative',
                    scale: { scheme: 'blues' },
                    legend: { title: 'Taux d\'occupation / Occupancy Rate' }
                }
            },
            config: {
                axis: {
                    labelFontSize: 12,
                    titleFontSize: 14
                },
                legend: {
                    labelFontSize: 12,
                    titleFontSize: 14
                }
            }
        };

        const compiledChart = vegalite.compile(chartSpec).spec;
        const runtime = vg.parse(compiledChart);
        const view = new vg.View(runtime).renderer('svg').run();

        try {
            const svg = await view.toSVG();
            fs.writeFileSync(outputFileName, svg);
            view.finalize();
            console.log(`Graphique enregistré dans : ${outputFileName}`.green);
            console.log(`Chart saved in: ${outputFileName}`.green);
        } catch (error) {
            console.error(`Erreur lors de la création du graphique : ${error.message}`.red);
            console.error(`Error while creating the chart: ${error.message}`.red);
        }
    } 
}

// Fonction pour poser une question à l'utilisateur et attendre sa réponse
function promptUser(question, rl) {
    return new Promise(resolve => {
        rl.question(question, (answer) => {
            resolve(answer); 
        });
    });
}

module.exports = { promptRoomOccupancy };
