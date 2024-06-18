import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from './pages/login'
import RegisterForm from './pages/register';
import 'bootstrap/dist/css/bootstrap.min.css';
import Overview from './pages/protected/overview';
import ProtectedRoutes from './pages/protected';
import CreateTransaction from './pages/protected/create-transaction';


function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<LoginForm />} />
          <Route path='/register' element={<RegisterForm />} />
          <Route element={<ProtectedRoutes />}>
            <Route path='/dashboard/home' element={<Overview />} />
            <Route path='/dashboard/create-transaction' element={<CreateTransaction />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
