# GL02_QuarkStudio

## Gestion des Salles de Cours - SRU

### Description

Application en ligne de commande développée pour l'université centrale de la république de Sealand (SRU) permettant de gérer l'occupation des salles de cours et l'organisation des emplois du temps.

### Fonctionnalités

#### Recherche des salles par cours (SPEC1)

- Permet de rechercher les salles associées à un cours donné
- Saisie du code du cours (ex: MC01)

#### Capacité des salles (SPEC2)

- Affiche la capacité maximale d'une salle spécifique
- Indique le nombre de places disponibles

#### Disponibilité des salles (SPEC3)

- Affiche les créneaux libres d'une salle donnée
- Format d'affichage : Jour: HH:MM-HH:MM

#### Salles libres par créneau (SPEC4)

- Recherche les salles disponibles pour un jour et un horaire donnés
- Format d'entrée : Jour (L,MA,ME,J,V,S,D) et plage horaire (HH:MM-HH:MM)

#### Export iCalendar (SPEC5)

- Génère un fichier iCalendar (.ics) pour des cours sélectionnés
- Compatible avec les logiciels d'agenda standards

#### Vérification des conflits (SPEC6)

- Détecte les conflits d'emploi du temps
- Vérifie le non-chevauchement des créneaux dans une même salle

#### Analyse d'occupation (SPEC7)

- Génère des statistiques sur l'utilisation des salles
- Permet de classer les salles par taux d'occupation ou capacité

### Installation

1. Cloner le dépôt
2. Installer les dépendances :

    ```bash
    npm install
    ```

### Utilisation

Lancer l'application :

```bash
node src/App.js
```

### Structure des données

Le programme utilise des fichiers au format `.cru` avec la structure suivante :

```
+CODE_COURS
INDEX,CATEGORIE,PARTICIPANTS,HORAIRE,GROUPE,SALLE//
```

Exemple :

```
+MT01
1,C1,P=24,H=J 10:00-12:00,F1,S=N101//
```

### Structure du projet

```
├── data/                # Fichiers .cru
├── output/              # Fichiers générés (ics, json)
└── src/                 # Code source
     ├── App.js          # Point d'entrée
     ├── roomSearch.js   # Exemple fichier de logique
     └── ...
```

### Technologies utilisées

- Node.js
- Colors (pour le formattage console)
- Filesystem (pour la manipulation de fichiers)

### Notes

- Les horaires sont considérés entre 8h00 et 20h00
- La salle "EXT1" est exclue des vérifications de conflits
- Les jours sont au format : L, MA, ME, J, V, S, D

### Auteurs

**QuarkStudio :**

- Julien Schieler
- Simon Gelbart
- Romain Goldenchtein

Université de Technologie de Troyes