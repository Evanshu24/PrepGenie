import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar.jsx'
import SignInPage from './Pages/SignIn.jsx'
import SignUp from './Pages/SignUp.jsx'
import Home from './Pages/Home.jsx'
import Footer from './components/Footer.jsx'
import Dashboard from "./Pages/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LoggedInNavbar from './components/loggedInNavbar.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <>
            <ProtectedRoute>
              <>
                <LoggedInNavbar/>
                <Dashboard />
                <Footer/>
              </>
            </ProtectedRoute>
          </>
        }
        />
        <Route path="/signin" element={
          <>
            <Navbar ShowSignIn={false} />
            <SignInPage />
          </>
        }
        />
        <Route path="/signup" element={
          <>
            <Navbar ShowSignIn={false} />
            <SignUp />
          </>
        }
        />
        <Route path="/extra" element={
          <>
            <Navbar />

            <Footer />
          </>
        }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
