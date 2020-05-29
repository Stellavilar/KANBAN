const { Label } = require('../models');

const labelController = {

  getAll: async (req, res, next) => {
    try {
      const labels = await Label.findAll({
        include: {all: true, nested: true}
      });

      res.send(labels);

    } catch (error) {
      console.trace(error);
      res.status(500).send(error);
    }
  },

  getOne: async (req, res, next) => {
    try {
      const labelId = req.params.id;
      const label = await Label.findByPk(labelId, {
        include: {all: true, nested: true}
      });

      if (!label) {
        return next();
      }

      res.send(label);

    } catch (error) {
      console.trace(error);
      res.status(500).send(error);
    }
  },

  create: async (req, res, next) => {
    try {

      const label = await Label.create(req.body);
      res.send(label);

    } catch (error) {
      console.trace(error);
      res.status(500).send(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const labelId = req.params.id;
      const label = await Label.findByPk(labelId);

      if (!label) {
        return next();
      }

      await label.update(req.body);

      res.send(label);

    } catch (error) {
      console.trace(error);
      res.status(500).send(error);
    }
  },

  delete: async (req, res, next) => {
    try {

      const labelId = req.params.id;
      const label = await Label.findByPk(labelId);

      if (!label) {
        return next();
      }

      await label.destroy();

      res.send("OK");

    } catch (error) {
      console.trace(error);
      res.status(500).send(error);
    }
  }


};

module.exports = labelController; 