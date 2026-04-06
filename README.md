# CyberPass 🛡️

CyberPass is a modern, cyber-themed password utility built with React and Vite. It provides a comprehensive suite of tools to generate secure passwords, analyze password strength, compare multiple passwords, and maintain a session-based history of your password activities. The project incorporates dynamic 3D elements and a sleek, responsive dark-mode UI.

## 🚀 Features

- **Password Generator**: Create strong, random passwords using customizable criteria (length, uppercase letters, lowercase letters, numbers, symbols).
- **Password Analyzer**: Analyze the strength and vulnerability of existing passwords and get real-time feedback and scores.
- **Password Comparison**: Compare two different passwords to see which is statistically stronger based on multiple security metrics.
- **Password History**: Maintains a timeline of recently generated or analyzed passwords (up to 20 recent entries) within your current session.
- **Interactive 3D Visuals**: Includes a sleek 3D Cyber Shield built with Three.js and React Three Fiber.
- **Responsive Design**: Modern, responsive interface optimized for all screen sizes featuring sophisticated glowing effects, built with Tailwind CSS.

## 💻 Tech Stack

- **Framework**: [React](https://reactjs.org/) 18 + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (powered by Radix UI)
- **3D Graphics**: [Three.js](https://threejs.org/) & [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🛠️ Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (or yarn / pnpm / bun)

### Installation

1. Clone the repository and navigate into the project directory:
   ```bash
   cd securepass-hub-main
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the address displayed in your terminal (usually `http://localhost:8080` or `http://localhost:5173`).

## 📦 Scripts

- `npm run dev` - Starts the Vite development server.
- `npm run build` - Compiles the application for production using TypeScript and Vite.
- `npm run preview` - Serves the production build locally to preview before deployment.
- `npm run lint` - Runs ESLint to check for code quality and syntax issues.
- `npm run test` - Runs the test suite via Vitest.

## 📂 Project Structure

```
src/
├── components/     # Reusable UI components (Generator, Analyzer, 3D Shield, UI elements)
├── hooks/          # Custom React hooks for functionality integration
├── lib/            # Utility functions (e.g., tailwind classes merge)
├── pages/          # Main application pages (Index, NotFound)
├── App.tsx         # Root component setting up routing and global providers
├── index.css       # Global styling and Tailwind CSS directive definitions
└── main.tsx        # React application entry point
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

## 📄 License

This project is open-source and available for anyone to use and modify.
