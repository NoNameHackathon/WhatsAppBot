# Food Journey Frontend

A modern React application built with Vite and Tailwind CSS for the Food Journey collaborative cooking platform.

## 🍽️ Features

- **Invite Link Input**: Clean, centered input for users to enter their Food Journey invite links
- **Modern Design**: Beautiful gradient background with a clean white card design
- **Responsive Layout**: Works great on desktop and mobile devices
- **Interactive Elements**: Hover effects and smooth transitions
- **Feature Showcase**: Displays key features like dinner parties, road trips, group recipes, and fridge sharing

## 🚀 Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for utility-first styling
- **PostCSS** for CSS processing

## 🛠️ Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

## 📁 Project Structure

- `src/App.tsx` - Main application component with the invite form
- `src/index.css` - Tailwind CSS imports and base styles
- `tailwind.config.js` - Tailwind configuration with custom green color palette
- `postcss.config.js` - PostCSS configuration for Tailwind

## 🎯 Features Displayed

The landing page showcases the core features of the Food Journey platform:

- **🎉 Dinner Parties**: Collaborative dinner planning
- **🚗 Road Trips**: Food adventures on the go
- **🤝 Group Recipes**: Shared cooking experiences
- **📸 Fridge Sharing**: Smart ingredient coordination

## 🎨 Design Philosophy

The design emphasizes:
- Clean, modern aesthetics
- Food-focused color palette (warm oranges and fresh greens)
- Intuitive user experience
- Clear call-to-action with the green "Join Journey" button
- Visual hierarchy that guides users to the main action

## 🔧 Development Notes

- The submit button currently logs the invite link to the browser console for development purposes
- Custom primary color palette defined in Tailwind config for consistent branding
- Mobile-first responsive design that adapts beautifully to different screen sizes
- Form validation requires users to enter an invite link before submission

## 🏗️ Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

## 📝 Next Steps

- Connect the form submission to the backend API
- Add error handling and loading states
- Implement invite link validation
- Add animations and micro-interactions
