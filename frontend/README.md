# Food Journey Frontend

A modern React landing page for the Food Journey WhatsApp community, built with **TypeScript**, **React**, and **Chakra UI**.

## Features

- 🍽️ Beautiful landing page with "Food Journey" branding
- 💬 WhatsApp invite link input with validation
- 🎨 Modern UI with Chakra UI components
- 📱 Responsive design
- ✅ Form validation and user feedback
- 🎯 Smooth animations and hover effects
- 🔒 **TypeScript** for type safety and better development experience

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## Technologies Used

- **React 18** with TypeScript
- **Chakra UI 2.8.2** - Modern component library
- **TypeScript 4.9.5** - Type safety and better DX
- **React Icons** - Beautiful icon library
- **Emotion** - CSS-in-JS styling
- **Framer Motion** - Smooth animations

## Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── App.tsx          # Main application component (TypeScript)
│   └── index.tsx        # Application entry point (TypeScript)
├── package.json
├── tsconfig.json        # TypeScript configuration
└── README.md
```

## TypeScript Features

- **Type Safety**: All components and functions are properly typed
- **Interface Definitions**: Clear type definitions for props and state
- **Event Handling**: Properly typed event handlers for forms and inputs
- **State Management**: Typed useState hooks for better development experience
- **Component Props**: TypeScript interfaces for component props

## Key TypeScript Implementations

```typescript
// Properly typed component
const App: React.FC = () => {
  const [whatsappLink, setWhatsappLink] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Typed event handler
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    // Implementation
  };
  
  // Typed input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWhatsappLink(e.target.value);
  };
};
```

## Features

- **Modern Design**: Clean, professional landing page with gradient text and smooth animations
- **Form Validation**: Validates WhatsApp invite links and provides user feedback
- **Responsive**: Works perfectly on desktop, tablet, and mobile devices
- **Accessibility**: Built with accessibility best practices using Chakra UI
- **User Experience**: Loading states, toast notifications, and smooth interactions
- **Type Safety**: Full TypeScript support for better development and maintenance

## Customization

The app uses a custom Chakra UI theme with:
- Brand colors in green shades
- Inter font family
- Custom hover effects and animations
- Responsive spacing and sizing

You can modify the theme in `src/index.tsx` to match your brand colors and preferences.

## Development Benefits with TypeScript

- **Better IDE Support**: Enhanced autocomplete and IntelliSense
- **Catch Errors Early**: Type checking during development
- **Improved Refactoring**: Safe refactoring with type checking
- **Better Documentation**: Types serve as inline documentation
- **Team Collaboration**: Clear interfaces and type definitions 