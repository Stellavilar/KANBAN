const listModule = require ('./list');
const cardModule = require ('./card');
const utilModule = require ('./utils');

const Sortable = require ('sortablejs');


var app = {
    base_url: "http://localhost:5050",
  
    // fonction d'initialisation, lancée au chargement de la page
    init: function () {
      console.log('app.init !');
      // à l'initialisation, on transmet app.base_url à tous les modules qui en ont besoin
      listModule.base_url = app.base_url;
      cardModule.base_url = app.base_url;
  
      app.addListenertoActions();
      listModule.getListsFromAPI();

      // on active sortable sur le container des listes
      const container = document.getElementById('listContainer');
      new Sortable(container, {
        draggable: ".panel",
        onEnd: app.handleListDropped
    });
    },
  
    addListenertoActions: () => {
     
      document.getElementById('addListButton').addEventListener('click', listModule.showAddListModal);
  
      var hideModalsButtons = document.querySelectorAll('.close');
      for (var button of hideModalsButtons) {
        button.addEventListener('click', utilModule.hideModals);
      }
  
      /** Soumission du formulaire "ajouter une liste" */
      // on cible le formulaire et on écoute l'event submit => app.handleAddListForm
      document.querySelector('#addListModal form').addEventListener('submit', listModule.handleAddListForm);
  
      /** Boutons "+" : ajouter une carte */
      const addCardButtons = document.querySelectorAll('.add-card-btn');
      for (let button of addCardButtons) {
        button.addEventListener('click', cardModule.showAddCardModal);
      }
  
      /** Soumission du formulaire "ajouter une carte" */
      document.querySelector('#addCardModal form').addEventListener('submit', cardModule.handleAddCardForm);
  
      /** Soumission du formulaire "éditer une carte" */
      document.querySelector('#editCardModal form').addEventListener('submit', cardModule.handleEditCardForm);
    },

    handleListDropped: (event) => {
      // 1. récupérer toutes les listes dans l'ordre
      const allLists = document.querySelectorAll('.panel');
  
      // 2. mettre à jour la positions de chacune des listes
      let position = 0;
      for (let list of allLists) {
        let listId = list.getAttribute('list-id');
  
        let formData = new FormData();
        formData.set('position', position);
  
        fetch(app.base_url+'/list/'+ listId, {
          method: "PATCH",
          body: formData
        });
  
        position++;
      }
    }
  };

  document.addEventListener('DOMContentLoaded', app.init );