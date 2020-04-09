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

Pour chaque route citée un exemple de requête curl sera fournie. Nous partons du principe que l'application est déployée sur Heroku.

* Route /signin permettant à un utilisateur de se connecter.
	```
	$ curl -X POST --header "Content-Type: application/json" --data "{\"username\":\"YOUR_USERNAME\", \"password\":\"YOUR_PASSWORD\"}" https://node-projectt.herokuapp.com/signin
	```
* Route /signup permettant à un utilisateur de s'inscrire.
	```
	$ curl -X POST --header "Content-Type: application/json" --data "{\"username\":\"YOUR_USERNAME\", \"password\":\"YOUR_PASSWORD\"}" https://node-projectt.herokuapp.com/signup
	```
* Route /notes permettant de :
	* Créer une note (put method).
		```
		$ curl -X PUT --header "Content-Type: application/json" -H "Authorization: YOUR_TOKEN" --data "{\"content\":\"Note content\"}" https://node-projectt.herokuapp.com/notes
		```
	* Récupérer toutes les notes (get method) à partir de l'utilisateur (/notes).
		```
		$ curl -X GET --header "Content-Type: application/json" -H "Authorization: YOUR_TOKEN" https://node-projectt.herokuapp.com/notes
		```
	* Modifier une note (patch method) depuis son ID (/notes/:id).
		```
		$ curl -X PATCH --header "Content-Type: application/json" -H "Authorization: YOUR_TOKEN" --data "{\"content\":\"Note content\"}" https://node-projectt.herokuapp.com/notes/(id_note)
		```
	* Supprimer une note (delete method) depuis son ID (/notes/:id).
		```
		$ curl -X DELETE --header "Content-Type: application/json" -H "Authorization: YOUR_TOKEN" https://node-projectt.herokuapp.com//notes/(id_note)
		```

# Sources

* [Express](https://expressjs.com/en/api.html) - The web framework used.
* [JsonWebToken](https://github.com/auth0/node-jsonwebtoken) - Token authentification.
* [Heroku](https://dashboard.heroku.com/apps) - Deploy.
* [MongoDB](https://www.mongodb.com) - Database NoSQL.

# Versions

Pour les versions disponibles, se référer [tags on this repository](https://github.com/dmytrolutsyk/Projet-node-ESGI/tags).

# Collaborateurs

* LUTSYK Dmytro.
* DENNOUN Mohamed.
* YU xuanbai.
* GOURGUE Henri.
