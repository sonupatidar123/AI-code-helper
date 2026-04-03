import { useState, useEffect } from 'react'
import axios from 'axios'

// Editor & Syntax Highlighting
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import "prismjs/themes/prism-tomorrow.css" // Dark theme for editor
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-python"
import "prismjs/components/prism-css"

// Markdown Rendering
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github-dark.css" // Theme for AI response

import './App.css'

// API URL from Environment Variables
const API_BASE_URL = import.meta.env.VITE_CODE_REVIEW_API || 'http://localhost:8000';

function App() {
  const [code, setCode] = useState(`function sum() {\n  return 1 + 1\n}`)
  const [review, setReview] = useState(``)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(``)
  const [theme, setTheme] = useState('dark')

  // Prism highlighting setup
  useEffect(() => {
    prism.highlightAll()
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

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
    <div className="app-container" data-theme={theme}>
      {/* --- Navbar --- */}
      <header className="navbar">
        <div className="logo">CodeReviewer<span>.ai</span></div>
        <div className="actions">
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
          <button 
            className={`review-btn ${loading ? 'loading' : ''}`} 
            onClick={reviewCode}
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Review Code'}
          </button>
        </div>
      </header>

      {/* --- Main Content --- */}
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
    </div>
  )
}

export default App