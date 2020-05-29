const express = require ('express');

const genericController = require ('./controllers/genericController');
const cardToLabelController = require('./controllers/cardToLabelController');

const router = express.Router();

/**Version factorisée */
router.get('/:entity', genericController.getAll );
router.get('/:entity/:id', genericController.getOne );
router.post('/:entity', genericController.create);
router.patch('/:entity/:id', genericController.update);
router.delete('/:entity/:id', genericController.delete);

router.post('/card/:id/label', cardToLabelController.associate);
router.delete('/card/:card_id/label/:label_id', cardToLabelController.dissociate);

//404
router.use((req,res) => {
    res.status(404).send("Not Found");
});

module.exports = router;