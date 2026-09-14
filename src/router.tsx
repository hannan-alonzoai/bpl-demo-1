import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './layouts/ProtectedRoute';
import { BoardPage } from './pages/BoardPage';
import { LoginPage } from './pages/LoginPage';
import { LayoutGalleryPage } from './pages/LayoutGalleryPage';
import { PatientFlowsPage } from './pages/PatientFlowsPage';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/board', element: <BoardPage /> },
      { path: '/layouts', element: <LayoutGalleryPage /> },
      { path: '/layouts/:layoutId', element: <LayoutGalleryPage /> },
      { path: '/ot/:roomId', element: <PatientFlowsPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/login" replace /> },
]);
