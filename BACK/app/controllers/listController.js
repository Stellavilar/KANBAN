const { List } = require('../models');
const sanitizer = require('sanitizer');

const listController = {
  getAll: async (req, res) => {
    try {
      const lists = await List.findAll({
        include: {all:true, nested: true} // petite astuce pour inclure directement toutes les associations, sans avoir à les nommer !
      });
      res.send(lists);
    } catch (error) {
      console.trace(error);
      res.status(500).send(error);
    }
  },

  getOne: async (req, res, next) => {
    try {
      const listId = req.params.id;
      const list = await List.findByPk(listId, {
        include: {all: true, nested: true}
      });
      if (!list) {
        return next();
      }
      res.send(list);
    } catch (error) {
      console.trace(error);
      res.status(500).send(error);
    }
  },

  create: async (req, res) => {
    try {
      let {title, position} = req.body;

      // on échappe les caractères spéciaux
      title = sanitizer.escape(title);
      position = sanitizer.escape(position);

      let newList = new List({title, position});
      // tester des truc? pour quoi faire? Sequelize et la DB d'assure déjà que le titre est unique et non vide !!
      await newList.save();

      res.send(newList);

    } catch (error) {
      console.trace(error);
      res.status(500).send(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const listId  = req.params.id;
      /** Version alternative avec méthode statique */
      let result = await List.update(req.body, {
        where: {
          id: listId
        },
        returning: true
      });
      // result est un array qui contient toujours 2 choses :  le nombre d'instances touchées, et un liste des instances modifiées
      if( result[0] == 0) {
        // si aucune instance n'a été modifiée... c'est qu'on a pas trouvé l'instance !
        return next();
      }
      // sinon, on renvoie la première liste modfiée
      const modifiedObjets = result[1];
      res.send(modifiedObjets[0]);
      // let list = await List.findByPk(listId);

      // if (!list) {
      //   return next(); // pas de list => 404
      // }

      // await list.update(req.body);

      // res.send(list);

    } catch (error) {
      console.trace(error);
      res.status(500).send(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const listId = req.params.id;
      let list = await List.findByPk(listId);

      if (!list) {
        return next(); // pas de list => 404
      }

      await list.destroy();
      res.send('OK');

    } catch (error) {
      console.trace(error);
      res.status(500).send(error);
    }

  }

};

module.exports = listController;