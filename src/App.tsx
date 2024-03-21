import { useState } from 'react'
import './App.css'
import Nav from './components/Nav'
import { Route, Routes } from 'react-router-dom';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import Home from './components/Home';
import { getUserFromLocalStorage } from './utilities';
import { User } from './models/user';

function App() {

  const [user, setUser] = useState<User|null>(getUserFromLocalStorage());

  return (
    <>
      <Nav user={user} setUser={setUser} />

      <main className="mx-auto w-96">
        <Routes>
          <Route path='/registration' element={<RegistrationForm user={user} />} />
          <Route path='/login' element={<LoginForm user={user} setUser={setUser} />} />
          <Route path='/' element={<Home user={user} />} />
        </Routes>
      </main>
    </>
  )
}

export default App
