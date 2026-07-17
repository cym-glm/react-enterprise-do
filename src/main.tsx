import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { StyleProvider } from '@ant-design/cssinjs';
import router from '@/router';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StyleProvider>
      <Suspense fallback={<div>加载中...</div>}>
        <RouterProvider router={router} />
      </Suspense>
    </StyleProvider>
  </StrictMode>
);
