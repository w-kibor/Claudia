import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import App from './app/App.tsx';
import Home from './app/pages/Home.tsx';
import RecipeCollection from './app/pages/RecipeCollection.tsx';
import MyKitchen from './app/pages/MyKitchen.tsx';
import AskAI from './app/pages/AskAI.tsx';
import './styles/index.css';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="recipes" element={<RecipeCollection />} />
        <Route path="my-kitchen" element={<MyKitchen />} />
        <Route path="ask-ai" element={<AskAI />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
