import React from 'react'
import { Routes, Route, HashRouter } from 'react-router-dom'
import Home from './pages/Home'
import Blog from './pages/Blog'
import Post from './pages/Post'
import Portfolio from './pages/Portfolio'
import About from './pages/About'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  return (
    <HashRouter>
      <div className="app-layout">
        <Header />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/post/:slug" element={<Post />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  )
}

export default App
