
# **Mira Lab** 🧪  

Welcome to **Mira Lab**, your go-to **collaborative project management** app! Manage your projects efficiently with features like **real-time updates**, **customizable tasks**, and an integrated **chat system**. 🎯

---

## ✨ **Features at a Glance**

- **Team Boards** 🧑‍🤝‍🧑: Create project teams as boards.  
- **Lists & Tasks** 🗂️: Organize your tasks in lists.  
- **Task Dependencies** 🔗: Link tasks to manage workflows.  
- **Drag & Drop** ✋: Move tasks between lists seamlessly.  
- **Real-Time Collaboration** ⚡: Instant updates for everyone.  
- **Notifications** 🔔: Stay informed with real-time alerts.  
- **Built-In Chat** 💬: Communicate directly within the board.  

---

## 🚀 **Tech Stack**

- **Backend**: [Laravel 11](https://laravel.com/)  
- **Frontend**: [React](https://react.dev/) with [Inertia.js](https://inertiajs.com/)  
- **Real-Time Engine**: [Pusher](https://pusher.com/) & [Laravel Echo](https://laravel.com/docs/echo)  
- **Rich Text Editor**: [Quill.js](https://quilljs.com/)  
- **Calendar**: [React Big Calendar](https://github.com/jquense/react-big-calendar)  
- **UI Library**: [ShadCN](https://shadcn.dev/)  
- **Utilities**: [Aceternity](https://aceternity.com/)  

---

## 🛠️ **Installation Guide**

### **Prerequisites**  
Ensure you have the following installed:  
- PHP 8.1+  
- Node.js 18+  
- Composer 2+  
- SQLite or any Laravel-supported database  

### **Step-by-Step Installation**  

#### 1️⃣ **Clone the Repository**  
\`\`\`bash
git clone https://github.com/Tristan-stack/Mira-Lab.git
cd Mira-lab
\`\`\`

#### 2️⃣ **Install Dependencies**  

**Backend**  
\`\`\`bash
composer install
\`\`\`

**Frontend**  
\`\`\`bash
npm install
\`\`\`

#### 3️⃣ **Configure Environment Variables**  

Copy the `.env.example` file:  
\`\`\`bash
cp .env.example .env
\`\`\`

Update the following keys in your `.env` file:  
\`\`\`env
PUSHER_APP_ID=your_pusher_app_id
PUSHER_APP_KEY=your_pusher_app_key
PUSHER_APP_SECRET=your_pusher_app_secret
PUSHER_APP_CLUSTER=your_pusher_app_cluster
\`\`\`

#### 4️⃣ **Generate Application Key**  
\`\`\`bash
php artisan key:generate
\`\`\`

#### 5️⃣ **Run Migrations**  
\`\`\`bash
php artisan migrate
\`\`\`

#### 6️⃣ **Start Development Servers**  

**Backend**  
\`\`\`bash
php artisan serve
\`\`\`

**Frontend**  
\`\`\`bash
npm run dev
\`\`\`

---

## 🎨 **Screenshots**  

### **Dashboard**  
![Dashboard](/rdmImg/dash.png)  

### **Task Management**  
![Tasks](/rdmImg/img1.png)  

### **Real-Time Chat**  
![Chat](/rdmImg/chat.png)  

---

## 📚 **Usage**

1. **Sign Up and Log In** ✍️  
   Create an account or log in to access the dashboard.  

2. **Create Boards** 🛠️  
   Set up project boards for your team.  

3. **Add Lists & Tasks** 🗂️  
   Organize tasks within lists and link them with dependencies.  

4. **Collaborate in Real-Time** ⚡  
   Work together, communicate in the chat, and stay updated with notifications.  

---

## 🤝 **Contributing**  

We ❤️ contributions! Follow these steps to get started:  
1. Fork the repo and clone it locally.  
2. Create a new branch:  
   \`\`\`bash
   git checkout -b feature/your-feature-name
   \`\`\`  
3. Make your changes and commit them:  
   \`\`\`bash
