# Informations

Le serveur écoute sur le port 3000. Vous pouvez changer le port en modifiant la constante PORT.
Pour déployer sur Heroku et modifier son port, il faut modifier la variable d'environnement PORT.

# Prérequis

installer node
installer npm

# Pour récupérer le projet git : 
```
	$ git clone https://github.com/dmytrolutsyk/Projet-node-ESGI.git
```

# Pour installer les dépendances :
```
	$ npm install
```

# Pour lancer le projet :
```
	$ npm start
```

# Principe de l'application :

Notre projet est une API réalisée en NodeJS communiquant avec une base de données noSQL. Cette API représente le back-end d'une application mobile et web.

# Différentes routes :

* Route /signin permettant à un utilisateur de se connecter.
* Route /signup permettant à un utilisateur de s'inscrire.
* Route /notes permettant de :
	* Récupérer toutes les notes (get method) à partir de l'utilisateur (/notes).
	* Modifier une note (patch method) depuis son ID (/notes/:id).
	* Supprimer une note (delete method) depuis son ID (/notes/:id).

## Versions

Pour les versions disponibles, se référer [tags on this repository](https://github.com/dmytrolutsyk/Projet-node-ESGI/tags).

## Collaborateurs

* LUTSYK Dmytro
* DENNOUN Mohamed
* YU xuanbai
* GOURGUE Henri
