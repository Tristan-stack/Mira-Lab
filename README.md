# 🌟 **Miralab - Modern Project Management System**

**Miralab** is a powerful tool for project management and team collaboration. It allows you to manage your projects efficiently with features such as interactive Kanban boards, real-time updates, team chat, detailed statistics, and integration Pusher and QuillJs.

[Test it here!](https://miralab.gerbert.etu.mmi-unistra.fr/)

![Miralab Home Page](/rdmImg/img1.png)

---

## 🚀 **Why Choose Miralab?**

- **📂 [Project Management](#-main-features)**  
  Organize your projects and track each task with precision.

- **📝 [Task Boards](#-main-features)**  
  Manage your tasks with drag-and-drop boards.  
  ![Task Boards](/rdmImg/board.png)

- **💬 [Team Chat](#-main-features)**  
  Chat in real-time with your collaborators and stay updated.  
  ![Team Chat](/rdmImg/chat.png)

- **📊 [Analysis and Statistics](#-main-features)**  
  Get charts and statistics to make informed decisions.  
  ![Analysis and Statistics](/rdmImg/analyse-statistiques.png)

---

## 🔑 **Main Features**

### 🌟 **Key Capabilities**

- **Project Creation and Management**  
  Create projects, manage members, and track their progress.

- **Kanban Boards with Drag-and-Drop**  
  Organize your tasks on visual and interactive boards.

- **Real-Time Updates**  
  Stay updated with instant notifications thanks to Pusher integration.

- **Team Chat**  
  Facilitate communication within your team with an integrated chat.

- **Statistics and Charts**  
  Visualize your project's progress with detailed charts.

---

## 🛠️ **Technologies Used**

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

### **Prerequisites**

Before starting the installation, ensure your environment meets the following requirements:

- [PHP](https://www.php.net/) >= 8.1
- [Composer](https://getcomposer.org/)
- [Node.js](https://nodejs.org/) and [NPM](https://www.npmjs.com/)
- [SQLite](https://sqlite.org/index.html)

### **Installation Steps**

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/Miralab.git
   ```

2. **Install Dependencies**

   - **Backend**

     ```bash
     composer install
     ```

   - **Frontend**

     ```bash
     npm install
     ```

3. **Configure Environment Variables**

   - Copy the `.env` file :

     ```bash
     cp .env.example .env
     ```

   - Configure the following keys in `.env` :

     - `PUSHER KEYS` o enable real-time updates on the boards (get them from [Pusher Dashboard](https://dashboard.pusher.com/)).

4. **Generate the Application Key**

   ```bash
   php artisan key:generate
   ```

5. **Run Migrations**

   ```bash
   php artisan migrate
   ```

6. **Start Development Servers**

   - Backend :

     ```bash
     php artisan serve
     ```

   - Frontend :

     ```bash
     npm run dev
     ```

---

## 🤝 **Contribute**

We encourage you to contribute to **Miralab** ! Here's how you can help:

1. Fork the repository.
2. Create a branch for your feature:

   ```bash
   git checkout -b nom-de-fonctionnalité
   ```

3. Commit your changes and submit a pull request!

---

## 🔐 ** Security Vulnerabilities**

If you discover a security vulnerability, please contact **me**. 

---

## 📜 **License**

Miralab is an **educational project** and is not licensed as open-source software..

---

🎉 **[Try Miralab now for optimized project management!](#-pourquoi-choisir-miralab)**
