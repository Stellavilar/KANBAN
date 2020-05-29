var app = {

    base_url: "http://localhost:5050",

    // fonction d'initialisation, lancée au chargement de la page
    init: function () {
      console.log('app.init !');
      app.addListenerToActions();
      app.getListsFromAPI();
    },
  
    addListenerToActions : () =>{
      //Ouvrir une fenêtre modale list:
      document.getElementById('addListButton').addEventListener('click', app.showAddListModal);
  
      //Fermer une fenêtre modale:
      var hideModal = document.querySelectorAll('.close');
      
      for (var button of hideModal){
        button.addEventListener('click', app.hideModals);
      };
  
      //Soumettre le formulaire 'ajouter une liste':
      document.querySelector('#addListModal form').addEventListener('submit', app.handleAddListForm);
  
      //Ouvrir une fenêtre modale card:
      const buttonForOpenCardModal = document.querySelectorAll('.add-card-btn');
      for (let button of buttonForOpenCardModal){
        button.addEventListener('click', app.showAddCardModal);
      };
  
      //Soumettre le formulaire 'ajouter une carte':
      document.querySelector('#addCardModal form').addEventListener('submit', app.handleAddCardForm);
  
    },
  
    //Ouvrir une modale pour ajouter une liste
    showAddListModal : () => {
      document.getElementById('addListModal').classList.add('is-active');
    },
  
    //Afficher une modale card:
    showAddCardModal : (event) => {
      //Récupérer l'id de la liste ciblée:
      const listElement = event.target.closest('.panel');
      const listId = listElement.getAttribute('list-id');
      //Insérer dans l'input , dans le formulaire , dans la modale 'addCardModal
      document.querySelector('#addCardModal input[name="list_id"]').value = listId;
      //Afficher la modale 'addCardModal'
      document.getElementById('addCardModal').classList.add('is-active');
    },
  
  
    //Fermer les modales
    hideModals : () => {
      
      var closeAllModals = document.querySelectorAll('.modal');
      //Pour toutes les modals actives, on retire la class 'is-active':
      for (var modal of closeAllModals) {
        modal.classList.remove('is-active');
      }
    },
  
    //Soumettre un form 'ajouter une liste':
    handleAddListForm : (event) => {
      //On empêche la page de se recharger:
      event.preventDefault();
      //On récupère les données (name) avec formData:
      var formData = new FormData(event.target);
      //On envoie les données (name) à la méthode suivante:
      app.makeListInDOM(formData.get('name'));
      //On ferme la modale:
      app.hideModals();
    },
  
  
    //Fabriquer une liste et l'ajouter au DOM:
    makeListInDOM : (listTitle, listId) => {
      alert(`Créer la liste ${listTitle}`)
      //Récupérer le template pour créer une liste:
      const template = document.getElementById('listTemplate');
      //Cloner ce template dans une variable:
      let newList = document.importNode(template.content, true);
      //Mettre à jour le nom de la liste:
      newList.querySelector('h2').textContent = listTitle;
      //Mettre à jour l'id de la nouvelle liste
      newList.querySelector('.panel').setAttribute('list-id', listId);
      //Ajouter des eventListener sur les éléments de la nouvelle liste:
      newList.querySelector('.add-card-btn').addEventListener('click', app.showAddCardModal);
      //Ajouter la nouvelle liste au DOM:
      document.getElementById('buttonsColumn').before(newList);
    },
  
    //Soumettre un form 'ajouter une carte'
    handleAddCardForm: (event) => {
      event.preventDefault();
      //Récupérer les valeurs du formulaire:
      var formData = new FormData(event.target);
      //Passer ces valeurs à mekeCardInDOM:
      app.makeCardInDOM(formData.get('title'), formData.get('list_id'));
      //Fermer la modale:
      app.hideModals();
    },
  
    //Fabriquer une carte:
    makeCardInDOM: (cardTitle, listId, cardId, cardColor) => {
      //1. récupérer le template
      const template = document.getElementById('cardTemplate');
      //2. cloner le template
      let newCard = document.importNode(template.content, true);
      //3. mettre à jour le titre de la carte
      newCard.querySelector('.card-title').textContent = cardTitle;
      // 3bis. Modifier aussi l'id de la carte, et son bgColor
      newCard.querySelector('.box').setAttribute('card-id', cardId);
      newCard.querySelector('.box').style.backgroundColor = cardColor;
      //4. ajouter la nouvelle carte dans la bonne liste
      document.querySelector(`[list-id="${listId}"] .panel-block`).appendChild(newCard);
    },

    /**
   *  Méthodes API 
   **/
  getListsFromAPI: async () => {
    try {
      // on récupères les données des listes depuis l'API
      let response = await fetch( app.base_url+'/list' );
      // on vérifie que l'API n'a pas répondu une erreur
      if (!response.ok) {
        alert('Impossible de récupérer les listes');
        return;
      }

      let lists = await response.json();
      console.log(lists);
      // pour chaq liste...
      for (let list of lists) {
        app.makeListInDOM(list.title, list.id);
        // ... puis, pour chaque carte de la liste...
        for (let card of list.cards) {
          // ...on crée la carte dans le DOM
          app.makeCardInDOM(card.title, list.id, card.id, card.color);
        }
      }      
    } catch (error) {
      console.error(error);
      alert('Impossible de récupérer les listes');
    }
  },
    
  };
  
  
  // on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
  document.addEventListener('DOMContentLoaded', app.init );