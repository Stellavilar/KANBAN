const { Card, Label } = require('../models');

const cardToLabelController = {

  associate: async (req, res, next) => {
    try {
      // trouver les 2 entités qui nous interesse
      const cardId = req.params.id;
      const labelId = req.body.label_id;

      let card = await Card.findByPk(cardId);
      const label = await Label.findByPk(labelId);

      if (!card || !label) {
        return next();
      }

      // créer la liaison
      const result = await card.addLabel(label);
      // label.addCard(card);
      // card.add(Label, label);
      // card.add('Label', label);

      // renvoyer un réponse => problème, on récupère une instance DE L'ASSOCIATION !!
      // pas le choix, il faut refaire une requete !

      // console.log(result);
      // res.send(result);
      card = await Card.findByPk(cardId, {
        include: ["labels"]
      });

      res.send(card);



    } catch (error) {
      console.trace(error);
      res.status(500).send(error);
    }
  },

  dissociate: async (req, res, next) => {
    try {
      // trouver les 2 entités qui nous interesse
      const {card_id, label_id} = req.params;

      let card = await Card.findByPk(card_id);
      const label = await Label.findByPk(label_id);

      if (!card || !label) {
        return next();
      }

      await card.removeLabel(label);
      /**
       * label.removeCard(card)
       * card.remove(Label, label)
       * card.removeCard([card_id])
       */
      card = await Card.findByPk(card_id, {
        include: ["labels"]
      });

      res.send(card);

    } catch (error) {
      console.trace(error);
      res.status(500).send(error);
    }
  }

};

module.exports = cardToLabelController; 