import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import axios from 'axios'

// Editor & Syntax Highlighting
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import "prismjs/themes/prism-tomorrow.css" // Dark theme for editor
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-python"
import "prismjs/components/prism-css"

import ReviewFunnel from './ReviewFunnel.jsx'
// Markdown Rendering
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github-dark.css" // Theme for AI response

import './App.css'

// API URL from Environment Variables
const API_BASE_URL = import.meta.env.VITE_CODE_REVIEW_API || 'https://ai-code-helper-l5rv.onrender.com';

// Code Reviewer Component
function CodeReviewer() {
  const [code, setCode] = useState(`function sum() {\n  return 1 + 1\n}`)
  const [review, setReview] = useState(``)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(``)

  // Prism highlighting setup
  useEffect(() => {
    prism.highlightAll()
  }, [])

  async function reviewCode() {
    if (loading) return
    if (!code.trim()) {
      setError("Please enter some code first!")
      return
    }

    setLoading(true)
    setError(``)
    setReview(``) // Clear previous review while loading

    try {
      const response = await axios.post(`${API_BASE_URL}/api/review/`, { 
        code: code 
      }, {
        headers: { 'Content-Type': 'application/json' }
      })

      setReview(response.data.review || "No feedback received from AI.")
    } catch (err) {
      console.error("API Error:", err)
      const errorMsg = err.response?.data?.error || err.message || "Failed to connect to server"
      setError(`⚠️ ${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="split-view">
      
      {/* Left Side: Code Editor */}
      <section className="pane editor-pane">
        <div className="pane-header">Input Code</div>
        <div className="editor-wrapper">
          <Editor
            value={code}
            onValueChange={code => setCode(code)}
            highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
            padding={20}
            className="code-editor"
            style={{
              fontFamily: '"Fira Code", "Fira Mono", monospace',
              fontSize: 14,
              minHeight: '100%',
            }}
          />
        </div>
      </section>

      {/* Right Side: AI Feedback */}
      <section className="pane output-pane">
        <div className="pane-header">AI Feedback</div>
        <div className="markdown-content">
          {error && (
            <div className="error-box">
              <strong>Error:</strong> {error}
            </div>
          )}
          
          {review ? (
            <Markdown rehypePlugins={[rehypeHighlight]}>
              {review}
            </Markdown>
          ) : (
            !loading && <div className="placeholder">Paste your code and click "Review" to get AI insights...</div>
          )}

          {loading && (
            <div className="placeholder">
              <div className="spinner"></div>
              Thinking...
            </div>
          )}
        </div>
      </section>

    </main>
  )
}

// Main App Component with Routing
function App() {
  const [theme, setTheme] = useState('dark')
  const location = useLocation()

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  const isReviewFunnelPage = location.pathname === '/review-funnel'

  return (
    <div className="app-container" data-theme={theme}>
      {/* --- Navbar (hidden on ReviewFunnel page) --- */}
      {!isReviewFunnelPage && (
        <header className="navbar">
          <div className="logo">CodeReviewer<span>.ai</span></div>
          <div className="nav-links">
            <Link to="/" className="nav-link">Code Review</Link>
            <Link to="/review-funnel" className="nav-link">Review Funnel</Link>
          </div>
          <div className="actions">
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>
            <button 
              className="review-btn"
              onClick={() => {
                const reviewBtn = document.querySelector('.review-btn');
                if (reviewBtn) reviewBtn.click();
              }}
            >
              Review Code
            </button>
          </div>
        </header>
      )}

      {/* --- Routes --- */}
      <Routes>
        <Route path="/" element={<CodeReviewer />} />
        <Route path="/review-funnel" element={<ReviewFunnel />} />
      </Routes>
    </div>
  )
}

export default App
