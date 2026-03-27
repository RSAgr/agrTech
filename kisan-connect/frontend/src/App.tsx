import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './app/routes';

import './i18n/config';

export const App: React.FC = () => {
  return (
    <BrowserRouter>

      <AppRoutes />
    </BrowserRouter>
  );
};
