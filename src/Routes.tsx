import { Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';

export const ClientRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<div>404</div>} />
    </Routes>
  );
};
