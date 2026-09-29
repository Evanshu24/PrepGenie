import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar.jsx'
import SignInPage from './Pages/SignIn.jsx'
import SignUp from './Pages/SignUp.jsx'
import Footer from './components/Footer.jsx'
import Dashboard from "./Pages/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import InterviewDetails from './Pages/InterviewDetails.jsx';
import Interview from './Pages/Interview.jsx';
import AllInterviews from './Pages/AllInterviews.jsx';
import InterviewReview from './Pages/InterviewReview.jsx';
import Terms from "./Pages/Terms.jsx";
import Privacy from "./Pages/Privacy.jsx"
import ScrollToTop from "./components/ScrollToTop.jsx";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
        <Routes>
              <Route path="/" element={
                <>
                  <ProtectedRoute>
                    <>
                      <Navbar/>
                      <Dashboard />
                      <Footer/>
                    </>
                  </ProtectedRoute>
                </>
              }
              />
              <Route path="/signin" element={
                <>
                  <Navbar showSignIn={true}/>
                  <SignInPage />
                </>
              }
              />
              <Route path="/signup" element={
                <>
                  <Navbar showSignIn={true}/>
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

            <Route path="/all-Interviews" element={
              <ProtectedRoute>
                  <AllInterviews/>
              </ProtectedRoute>
            }/>
            
            <Route
                path="/interview-review/:interviewId" element={
                  <ProtectedRoute>
                    <InterviewReview/>
                  </ProtectedRoute>
                }
            />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />   
        </Routes>
    </BrowserRouter>
  )
}

export default App
