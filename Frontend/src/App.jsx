import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar.jsx'
import SignInPage from './Pages/SignIn.jsx'
import SignUp from './Pages/SignUp.jsx'
import Footer from './components/Footer.jsx'
import Dashboard from "./Pages/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LoggedInNavbar from './components/loggedInNavbar.jsx';
import InterviewDetails from './Pages/InterviewDetails.jsx';
import Interview from './Pages/Interview.jsx';

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

        <Route path="/details" element={
          <ProtectedRoute>
            <InterviewDetails />
          </ProtectedRoute>
        }/>
      
      <Route path="/interview" element={
        <ProtectedRoute>
          <Interview />
        </ProtectedRoute>
      }/>

      </Routes>
    </BrowserRouter>
  )
}

export default App
