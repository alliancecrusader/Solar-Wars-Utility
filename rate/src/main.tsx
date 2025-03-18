import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import Rater from './components/Rater';

import groundRate from './Raters/ground';
import shipRate from './Raters/ship';

const MainMenu = ({ onSelectRater, toggleTheme }: any) => (
  <div className="menu-container">
    <h1>Main Menu</h1>
    <button className="menu-button" onClick={() => onSelectRater('ground')}>Ground Rater</button>
    <button className="menu-button" onClick={() => onSelectRater('ship')}>Ship Rater</button>
    <button className="theme-toggle-button" onClick={toggleTheme}>Toggle Dark/Light Mode</button>
  </div>
);

const App = () => {
  const [currentRater, setCurrentRater] = useState(null);
  const [theme, setTheme] = useState('light-mode');

  // Use effect to apply the theme to the document element
  useEffect(() => {
    // Remove previous theme class and add the current one to document element
    document.documentElement.classList.remove('light-mode', 'dark-mode');
    document.documentElement.classList.add(theme);
  }, [theme]);

  const handleSelectRater = (rater: any) => {
    setCurrentRater(rater);
  };

  const handleGoBack = () => {
    setCurrentRater(null);
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light-mode' ? 'dark-mode' : 'light-mode'));
  };

  return (
    <div className={theme}>
      {currentRater === null ? (
        <MainMenu onSelectRater={handleSelectRater} toggleTheme={toggleTheme} />
      ) : currentRater === 'ground' ? (
        <Rater rate_name="Ground Rate" params={groundRate.params} computeCost={groundRate.rate} goBack={handleGoBack} />
      ) : (
        <Rater rate_name="Ship Rate" params={shipRate.params} computeCost={shipRate.rate} goBack={handleGoBack} />
      )}
    </div>
  );
};

function main() {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );

  document.title = 'Solar Wars Vehicle Rater';
}

main();
