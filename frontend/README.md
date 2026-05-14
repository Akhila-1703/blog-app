# Blog App Frontend 🎨

The modern, responsive, and interactive user interface for the Blog Application. Built with **React** and **Vite**, it provides a seamless experience for readers, authors, and administrators.

---

## 🛠️ Tech Stack

- **Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management:** [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- **Routing:** [React Router 7](https://reactrouter.com/)
- **Forms:** [React Hook Form](https://react-hook-form.com/)
- **API Client:** [Axios](https://axios-http.com/)
- **Notifications:** [React Hot Toast](https://react-hot-toast.com/)

---

## ✨ Features

- **Responsive Design:** Optimized for mobile, tablet, and desktop views using Tailwind CSS.
- **Role-Based Routing:** Protected routes for Users, Authors, and Admins to ensure secure navigation.
- **Dynamic Content:** Real-time article fetching, detailed article views, and comment interactions.
- **Rich Forms:** Intuitive registration and login flows with client-side validation and image upload previews.
- **State Persistence:** Efficient global state management using Zustand for user sessions and app data.
- **Graceful Error Handling:** Integrated Error Boundaries and unauthorized access redirects.

---

## 📂 Project Structure

```text
frontend/
├── src/
│   ├── components/    # Reusable UI components (Header, Footer, Login, etc.)
│   ├── store/         # Zustand store for global state management
│   ├── config/        # API and environment configurations
│   ├── styles/        # Global CSS and Tailwind configurations
│   ├── App.jsx        # Main routing and application logic
│   └── main.jsx       # Application entry point
├── public/            # Static assets (favicon, logos)
├── index.html         # HTML template
├── vite.config.js     # Vite configuration
└── tailwind.config.js # Tailwind CSS customization
