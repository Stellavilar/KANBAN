//Function to convert hex format to a rgb color
function rgb2hex(rgb){
  rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
  return (rgb && rgb.length === 4) ? "#" +
   ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
   ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
   ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
 };


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

      /** Soumission du formulaire "éditer une carte" */
      document.querySelector('#editCardModal form').addEventListener('submit', app.handleEditCardForm);
  
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
  
    showEditListForm: (event) => {
      // l'event est "branché" sur le h2, donc event.target sera toujours le h2 qui nous interesse
      // rendre le h2 caché
      event.target.classList.add('is-hidden');
      // rendre le formulaire visible
      // pour cibler le formulaire : on "remonte" à div column, et on cherche le form dedans
      const theForm = event.target.closest('.column').querySelector('form');
      theForm.classList.remove('is-hidden');    
      // au passage, on préremplie l'input "title" avec le contenu du H2
      theForm.querySelector('input[name="title"]').value = event.target.textContent;
    },

    showEditCardModal: (event) => {
      // event.target représente l'icone stylo
      const cardElement = event.target.closest('.box');
      // 1. récupérer quelques infos sur la carte
      const cardId = cardElement.getAttribute('card-id');
      const cardTitle = cardElement.querySelector('.card-title').textContent;
      const cardColor = cardElement.style.backgroundColor;
  
      // 2. préremplir le formulaire avec ces infos
      const theForm = document.querySelector('#editCardModal form');
      theForm.querySelector('input[name="card_id"]').value = cardId;
      theForm.querySelector('input[name="title"]').value = cardTitle;
      // TODO: voir ce qui ne marche pas avec les couleurs....
      theForm.querySelector('input[name="color"]').value = rgb2hex(cardColor);
  
      // 3. montrer la modale
      document.querySelector('#editCardModal').classList.add('is-active');
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
    handleAddListForm : async (event) => {
      try {
        //Récupérer les valeurs du formulaire
        var formData = new FormData(event.target);
        //2. Envoyer les infos du formulaire à l'api (et attendre une réponse)
        let response = await fetch( app.base_url+'/list', {
          method: "POST",
          body: formData
        });
        if (!response.ok) {
          let error = await response.json();
          console.log(error);
          return alert('Impossible de créer la liste !\n' + error.errors[0].message);
        }
        let newList = await response.json();

        //3. utiliser la réponse de l'api, et passer les bonnes valeurs à makeListInDOM pour créer la liste dans le HTML
        app.makeListInDOM( newList.title, newList.id );
        //4. fermer la modale
        app.hideModals();

      } catch (error) {
        console.log(error);
        alert('Impossible de créer la liste !')
      }
    },

     /** Méthode pour gérer la soumission du formulaire "éditer une carte" */
  handleEditCardForm: async (event) => {
    try {
      event.preventDefault();
      // 1. récupérer les infos du formulaire
      const formData = new FormData(event.target);
      // 2. envoyer ces infos à l'API, et attendre une réponse
      const cardId = formData.get('card_id');
      let response = await fetch( app.base_url+'/card/'+cardId, {
        method: "PATCH",
        body: formData
      });
      if (!response.ok) {
        console.log(response);
        alert('Impossible de modifier la carte !');
      }
      // 3. mettre à jour la carte avec les nouvelles infos
      const modifiedCard = await response.json();
      let cardElement = document.querySelector(`[card-id="${cardId}"]`);
      cardElement.style.backgroundColor = modifiedCard.color;
      cardElement.querySelector('.card-title').textContent = modifiedCard.title;
      // 4. fermer la modale
      app.hideModals();
    } catch (error) {
      console.log(error);
      alert('Impossible de modifier la carte !');
    }

  },

  /** Méthode pour supprimer une carte */
  handleDeleteCard: async (event) => {
    try {
      event.preventDefault();
      // 0. confirmation utilisateur !
      if ( !confirm('Voulez-vous supprimer cette carte ?') ) {
        return;
      }

      // 1. récupérer l'id de la carte ciblée
      // event.target, c'est mon bouton...
      const cardElement = event.target.closest('.box');
      const cardId = cardElement.getAttribute('card-id');

      // 2. envoyer des infos à l'API => route DELETE /card/:id
      let response = await fetch(app.base_url+'/card/'+cardId,{
        method: 'DELETE'
      });

      // 3. supprimer la carte du DOM
      if (!response.ok) {
        return alert('Impossible de supprimer la carte !');
      }
      // on se fiche totalement du contenu de la réponse. Tant que "ok", on supprime la carte du DOM!
      cardElement.remove();

    } catch (error) {
      console.log(error);
      alert('Impossible de supprimer la carte !');
    }
  },

  
  
    //Fabriquer une liste et l'ajouter au DOM:
    makeListInDOM : (listTitle, listId) => {
    //1. récupérer le template
    const template = document.getElementById('listTemplate');
    //2. cloner le template => on récupère un element HTML "nouvelleListe"
    let newList = document.importNode(template.content, true);
    //3. mettre à jour le nom de la liste.
    newList.querySelector('h2').textContent = listTitle;

    //3.alt. mettre à jour l'id de la nouvelle liste
    newList.querySelector('.panel').setAttribute('list-id', listId);
    // on en profite pour préremplir l'input du formulaire "éditer la liste"
    newList.querySelector('input[name="list-id"]').value = listId;

    //3bis. ajouter des eventListener sur les éléments de la nouvelle liste !
    // - ajouter une carte
    newList.querySelector('.add-card-btn').addEventListener('click', app.showAddCardModal);
    // - modifier le titre => clic sur H2
    newList.querySelector('h2').addEventListener('dblclick', app.showEditListForm);
    // - modifier le titre => submit formulaire
    newList.querySelector('.edit-list-form').addEventListener('submit', app.handleEditListForm);
    // - supprimer la liste => clic sur la poubelle
    newList.querySelector('.delete-list-btn').addEventListener('click', app.handleDeleteList);

    //4. ajouter "nouvelleListe" au DOM, au bon endroit.
    // - 4.1 cibler "la colonne avec des boutons"
    // - 4.2 ajouter nouvelle liste juste avant "la colonne avec des boutons"
    document.getElementById('buttonsColumn').before(newList);
    },
  
    //Soumettre un form 'ajouter une carte'
    handleAddCardForm: async (event) => {
      try {
        event.preventDefault(); // on empêche la page de se recharger !
        //1. récupérer les valeurs du formulaire
        var formData = new FormData( event.target );
  
        //2. envoyer les infos à l'API, et attendre une réponse
        let response = await fetch( app.base_url+'/card', {
          method: "POST",
          body: formData
        });
        if( !response.ok) {
          return alert('Impossible de créer la carte !');
        }
        let newCard = await response.json();
  
        //3. utiliser la réponse pour créer la carte dans le DOM
        app.makeCardInDOM( newCard.title, newCard.list_id, newCard.id, newCard.color );
        //4. fermer la modale
        app.hideModals();
      } catch (error) {
        console.log(error);
        alert('Impossible de créer la carte !');
      }
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
      // - clic sur le stylo => modifier la carte
      newCard.querySelector('.edit-card-btn').addEventListener('click', app.showEditCardModal);
      // - clic sur la poubelle => supprimer la carte
    newCard.querySelector('.delete-card-btn').addEventListener('click', app.handleDeleteCard);
      //4. ajouter la nouvelle carte dans la bonne liste
      document.querySelector(`[list-id="${listId}"] .panel-block`).appendChild(newCard);
    },

      /** Méthode pour éditer une liste */
    handleEditListForm: async (event) => {
      try {
        event.preventDefault(); // on empeche le rechargement de la page

        //1. récupérer les infos du formulaire
        var formData = new FormData( event.target );
        const listId = formData.get('list-id');

        //2. transmettre les infos à l'API, et attendre la réponse
        let response = await fetch( app.base_url+'/list/'+listId, {
          method: 'PATCH',
          body: formData
        });

        //3. si tout va bien, mettre à jour le h2 dans le DOM
        if (response.ok) {
          let list = await response.json();
          event.target.closest('.column').querySelector('h2').textContent = list.title;

          // alternative : utiliser les infos de formData
          // event.target.closest('.column').querySelector('h2').textContent = formData.get('title');
        }

      } catch (error) {
        console.log(error);
      } finally {
        // dans tous les cas...  on réaffiche le titre, et on cache le formulaire
        event.target.classList.add('is-hidden');
        event.target.closest('.column').querySelector('h2').classList.remove('is-hidden');
      }
    },

    /** Méthode pour supprimer une liste */
  handleDeleteList: async (event) => {
    try {
      //1. récupérer l'élément liste (event.target, c'est mon bouton)
      const listElement = event.target.closest('.panel');
      //2. vérifier que la liste ne contient plus de cartes
      if( listElement.querySelectorAll('.box').length > 0) {
        return alert('Impossible de supprimer une liste non vide !');
      }
      //3. confirmation utilisateur
      if ( !confirm('Voulez-vous supprimer cette liste ?') ) {
        return;
      }
      //4. envoyer une requete à l'API
      const listId = listElement.getAttribute('list-id');
      let response = await fetch( app.base_url+'/list/'+listId, {
        method: "DELETE"
      });

      //5. si tout va bien, supprimer la liste du DOM
      if (response.ok) {
        listElement.remove();
      }

    } catch (error) {
      console.log(error);
      alert('Impossible de supprimer la liste !');
    }
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