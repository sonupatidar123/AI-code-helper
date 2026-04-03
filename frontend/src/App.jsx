import { useState, useEffect } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios'
import './App.css'

function App() {
  const [code, setCode] = useState(`function sum() {\n  return 1 + 1\n}`)
  const [review, setReview] = useState(``)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(``)
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    prism.highlightAll()
  }, [])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  async function reviewCode() {
    if (loading) return
    setLoading(true)
    setError(``)
    try {
      const response = await axios.post('https://ai-code-helper-l5rv.onrender.com/api/review/', { code })
      setReview(response.data.review || "No review received")
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to review code")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-container" data-theme={theme}>
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

      <main className="split-view">
        <section className="pane editor-pane">
          <div className="pane-header">Input Code</div>
          <div className="editor-wrapper">
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
              padding={20}
              className="code-editor"
            />
          </div>
        </section>

        <section className="pane output-pane">
          <div className="pane-header">AI Feedback</div>
          <div className="markdown-content">
            {error && <div className="error-box"><strong>Error:</strong> {error}</div>}
            {review ? (
              <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
            ) : (
              <div className="placeholder">Your code review will appear here...</div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App