const { Card } = require('../models');

const cardController = {

  getAll: async (req, res, next) => {
    try {
      const cards = await Card.findAll({
        include: {all: true, nested: true}
      });

      res.send(cards);
    } catch (error) {
      console.trace(error);
      res.status(500).send(error);
    }
  },

  getOne: async (req, res, next) => {
    try {
      const cardId = req.params.id;
      const card = await Card.findByPk(cardId,{
        include: {all: true, nested: true}
      });

      if (!card) {
        return next();
      }

      res.send(card);

    } catch (error) {
      console.trace(error);
      res.status(500).send(error);
    }
  },

  create: async (req, res, next) => {
    try {
      /** Version méthode statique */
      // const card = await Card.create(req.body);

      /** Version avec une instance */
      const card = new Card(req.body);
      await card.save();

      res.send(card);

    } catch (error) {
      console.trace(error);
      res.status(500).send(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const cardId = req.params.id;
      const card = await Card.findByPk(cardId);
      if (!card) {
        return next();
      }

      /** Version avec instance et .save() */
      // card.title = req.body.title;
      // card.list_id = req.body.list_id;
      // await card.save();

      /** Version avec update */
      // Attention, c'est bien update sur une instance, et non Card.update
      await card.update(req.body);

      res.send(card);

    } catch (error) {
      console.trace(error);
      res.status(500).send(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const cardId = req.params.id;
      const card = await Card.findByPk(cardId);
      if (!card) {
        return next();
      }

      await card.destroy();

      res.send("OK");

    } catch (error) {
      console.trace(error);
      res.status(500).send(error);
    }
  }

};

module.exports = cardController;