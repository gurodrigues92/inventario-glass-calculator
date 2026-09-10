import { createRoot } from 'react-dom/client'
import App from './App.tsx'

// Global Styles - Imported here to ensure correct order and avoid CSS @import warnings
import './styles/variables.css';
import './index.css'; // Contains Tailwind directives
import './styles/base.css';
import './styles/components.css';
import './styles/typography.css';
import './styles/badges.css';
import './styles/buttons.css';
import './styles/animations.css';
import './styles/sections.css';
import './styles/responsive.css';
import './styles/mobile/typography.css';
import './styles/mobile/layout.css';
import './styles/mobile/forms.css';
import './styles/mobile/cards.css';
import './styles/mobile/touch.css';
import './styles/mobile/breakpoints.css';
import './styles/mobile/device-specific.css';

createRoot(document.getElementById("root")!).render(<App />);
