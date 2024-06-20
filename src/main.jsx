import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Home from './page/Home.jsx'
import Login from './page/Login.jsx'
import Add from './page/Add.jsx'
import Edit from './page/Edit.jsx'
import ProtectedRoute from './auth/ProtectedRoute.jsx'

import 'bootstrap/dist/css/bootstrap.min.css'

import './index.css'
import { UserAuthContextProvider } from './context/UserAuthContext.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/home",
    element: <ProtectedRoute><Home /></ProtectedRoute>
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/add",
    element: <ProtectedRoute><Add /></ProtectedRoute>
  },
  {
    path: "/edit/:id",
    element: <ProtectedRoute><Edit /></ProtectedRoute>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserAuthContextProvider>
      <RouterProvider router={router} />
    </UserAuthContextProvider>
  </React.StrictMode>,
)
