//Variables d'environnement
require ('dotenv').config();

//Require les models
const { Card, List, Label } = require ('./BACK/app/models');

const testFunction = async () => {
    try {
        let allLists = await List.findAll({
            include: [{
                association: "cards",
                include: "labels"
            }]
        });

        for (let list of allLists) {
            console.log(`La liste ${list.title} contient les cartes :`);
            for (let card of list.cards) {
                console.log(`-${card.title}, de couleur ${card.color}, avec les labels: `);
                for (let label of card.labels) {
                    console.log(`-${label.title}, de couleur ${label.color}`)
                }
            }
        }
    } catch(error) {
        console.trace(error);
    }
};

testFunction();