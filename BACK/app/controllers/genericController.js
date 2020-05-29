const models = require('../models');

const getModel = (className) => {
  //1. je veux passer de "list" à "List"
  // - prendre le premier caractère et le passer en majuscule
  // - prendre la chaine SANS le premier caractère
  // - concaténer le tout
  const modelName = className[0].toUpperCase() + className.slice(1);

  //2. renvoyer le model qui correspond à ce nom
  return models[modelName];
};

const genericController = {

  getAll: async (req, res, next) => {
    try {
      const entityName = req.params.entity;

      const options = {
        include: {all: true, nested: true}
      };
      // cas particulier : si l'entité est "list", on veut les ranger dans le bon ordre, et aussi les cartes inclues !
      if (entityName == 'list') {
        options.order = ['position', ['cards', 'position', 'ASC']];
      }

      const allEntities = await getModel(entityName).findAll(options);

      res.send(allEntities);
      
    } catch (error) {
      console.trace(error);
      res.status(500).send(error);
    }
  },

  getOne: async (req, res, next) => {
    try {
      const {entity, id} = req.params;

      const result = await getModel(entity).findByPk(id,{
        include: {all: true, nested: true}
      });

      if (!result) {
        return next();
      }

      res.send(result);
      
    } catch (error) {
      console.trace(error);
      res.status(500).send(error);
    }
  },

  create: async (req, res, next) => {
    try {
      // console.log("CREATE ::", req.body);
      const entityName = req.params.entity;
      const result = await getModel(entityName).create(req.body);
      
      res.send(result);
      
    } catch (error) {
      console.trace(error);
      res.status(500).send(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const {entity, id} = req.params;

      const target = await getModel(entity).findByPk(id);

      if(!target) {
        return next();
      }

      await target.update(req.body);

      res.send(target);

    } catch (error) {
      console.trace(error);
      res.status(500).send(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const {entity, id} = req.params;

      const target = await getModel(entity).findByPk(id);

      if(!target) {
        return next();
      }

      await target.destroy();

      res.send("OK");

    } catch (error) {
      console.trace(error);
      res.status(500).send(error);
    }
  }

};


module.exports = genericController;