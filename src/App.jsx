import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar.jsx'
import SignInPage from './Pages/SignInPage.jsx';
import Home from './Pages/Home.jsx'
import Footer from './components/Footer.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
            <>
              <Navbar />
              <Home/>
              <Footer/>
            </>
          } 
        />
        <Route path="/signin" element={
          <>
          <Navbar/>
          <SignInPage />
          </>
        } 
          />
        <Route path="/extra" element={
          <>
          <Navbar/>

          <Footer/>
          </>
        } 
          />
      </Routes>
    </BrowserRouter>
  )
}

export default App
