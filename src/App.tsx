import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from './pages/login'
import RegisterForm from './pages/register';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<LoginForm />} />
          <Route path='/register' element={<RegisterForm />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
