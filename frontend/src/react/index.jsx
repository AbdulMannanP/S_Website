import React from 'react';
import { createRoot } from 'react-dom/client';
import MajlisCinematic from './Majlis';

const rootElement = document.getElementById('react-catalog-root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<MajlisCinematic />);
}
