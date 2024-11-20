
# 🌟 **Miralab - Système de Gestion de Projets Moderne**

**Miralab** est un outil puissant pour la gestion de projets et la collaboration d’équipe. Il permet de gérer vos projets de manière efficace grâce à des fonctionnalités telles que des tableaux Kanban interactifs, des mises à jour en temps réel, un chat d’équipe, des statistiques détaillées, et l'intégration avec Google Agenda.

[Testez-le ici !](https://miralab.gerbert.etu.mmi-unistra.fr/)

![Page d'Accueil Miralab](/rdmImg/img1.png)

---

## 🚀 **Pourquoi Choisir Miralab ?**

- **📂 [Gestion de Projets](#-fonctionnalités-de-base)**  
  Organisez vos projets et suivez chaque tâche avec précision.

- **📝 [Tableaux de Tâches](#-fonctionnalités-de-base)**  
  Gérez vos tâches avec des tableaux, glisser-déposer.  
  ![Tableaux de Tâches](/rdmImg/board.png)

- **💬 [Chat d'Équipe](#-fonctionnalités-de-base)**  
  Discutez en temps réel avec vos collaborateurs et restez à jour.  
  ![Chat d'Équipe](/rdmImg/chat.png)

- **📊 [Analyse et Statistiques](#-fonctionnalités-de-base)**  
  Obtenez des graphiques et statistiques pour prendre des décisions éclairées.  
  ![Analyse et Statistiques](/rdmImg/analyse-statistiques.png)

---

## 🔑 **Fonctionnalités Principales**

### 🌟 **Capacités Clés**

- **Création et Gestion de Projets**  
  Créez des projets, gérez les membres et suivez leur progression.

- **Tableaux Kanban avec Glisser-Déposer**  
  Organisez vos tâches sur des tableaux visuels et interactifs.

- **Mises à Jour en Temps Réel**  
  Restez à jour avec des notifications instantanées grâce à l’intégration de Pusher.

- **Chat d’Équipe**  
  Facilitez la communication au sein de votre équipe avec un chat intégré.

- **Statistiques et Graphiques**  
  Visualisez la progression de vos projets avec des graphiques détaillés.

- **Intégration Google Agenda**  
  Synchronisez les dates d'échéance avec Google Agenda pour ne jamais oublier une tâche.

---

## 🛠️ **Technologies Utilisées**

| **Technologie**      | **Détails**                                                                |
|----------------------|----------------------------------------------------------------------------|
| **Backend**           | [Laravel 11](https://laravel.com/)                                          |
| **Frontend**          | [React](https://react.dev/) avec [Inertia.js](https://inertiajs.com/)      |
| **Mises à Jour en Temps Réel** | [Pusher](https://pusher.com/) + [Laravel Echo](https://laravel.com/docs/11.x/broadcasting) |
| **Composants UI**     | Shadcn Components, Aceternity, [Tailwind CSS](https://tailwindcss.com/)     |
| **Drag-and-Drop**     | [React Beautiful DnD](https://github.com/atlassian/react-beautiful-dnd)    |
| **Base de Données**   | [SQLite](https://sqlite.org/index.html)                                     |
| **Graphiques**        | Composants Shadcn pour la création de graphiques                           |
| **Calendrier**        | [React-Big-Calendar](https://github.com/jquense/react-big-calendar)                           |
| **Text éditeur riche**| [Quill](https://quilljs.com/)                           |

---

## ⚡ **Installation**

### **Prérequis**

Avant de commencer l'installation, assurez-vous que votre environnement remplit les conditions suivantes :

- [PHP](https://www.php.net/) >= 8.1
- [Composer](https://getcomposer.org/)
- [Node.js](https://nodejs.org/) et [NPM](https://www.npmjs.com/)
- [SQLite](https://sqlite.org/index.html)

### **Étapes d'Installation**

1. **Cloner le Référentiel**

   ```bash
   git clone https://github.com/votre-utilisateur/Miralab.git
   ```

2. **Installer les Dépendances**

   - **Backend**

     ```bash
     composer install
     ```

   - **Frontend**

     ```bash
     npm install
     ```

3. **Configurer les Variables d'Environnement**

   - Copiez le fichier `.env` :

     ```bash
     cp .env.example .env
     ```

   - Configurez les clés suivantes dans `.env` :

     - `PUSHER KEYS` pour activer les mises à jour en temps réel sur les tableaux (obtenez-les depuis [Pusher Dashboard](https://dashboard.pusher.com/)).
     - `GOOGLE KEYS` (optionnel), utilisés pour l’exportation des tâches vers Google Agenda (obtenez-les depuis [Google Cloud Console](https://console.cloud.google.com/)).

4. **Générer la Clé de l'Application**

   ```bash
   php artisan key:generate
   ```

5. **Exécuter les Migrations**

   ```bash
   php artisan migrate
   ```

6. **Démarrer les Serveurs de Développement**

   - Backend :

     ```bash
     php artisan serve
     ```

   - Frontend :

     ```bash
     npm run dev
     ```

---

## 🤝 **Contribuer**

Nous vous encourageons à contribuer à **Miralab** ! Voici comment vous pouvez aider :

1. Forkez le référentiel.
2. Créez une branche pour votre fonctionnalité :

   ```bash
   git checkout -b nom-de-fonctionnalité
   ```

3. Committez vos changements et soumettez une pull request !

---

## 🔐 **Vulnérabilités de Sécurité**

Si vous découvrez une faille de sécurité, contactez directement notre **équipe de sécurité**. Nous nous engageons à résoudre les problèmes rapidement et à protéger nos utilisateurs.

---

## 📜 **Licence**

Miralab est un **projet éducatif** et n'est pas licencié en tant que logiciel open-source.

---

🎉 **[Essayez dès maintenant Miralab pour une gestion de projet optimisée !](#-pourquoi-choisir-miralab)**
