
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './Components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import CaseStudy from './pages/CaseStudy'
import Contact from './pages/Contact'
import Footer from './components/Footer'
import Solutions from './pages/Solutions'



function App() {

  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/solutions' element={<Solutions />} />
          <Route path='/services' element={<Services />} />
          <Route path='/case studies' element={<CaseStudy />} />
          <Route path='/contact' element={<Contact />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  )
}

export default App
