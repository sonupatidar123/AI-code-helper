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
  const [ count, setCount ] = useState(0)
  const [ code, setCode ] = useState(` function sum() {
  return 1 + 1
}`)

  const [ review, setReview ] = useState(``)
  const [ loading, setLoading ] = useState(false)
  const [ error, setError ] = useState(``)

  useEffect(() => {
    prism.highlightAll()
  }, [])

  async function reviewCode() {
    if (loading) return; // Prevent multiple clicks
    
    setLoading(true)
    setError(``)
    setReview(``)
    
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/review/', { code })
      
      if (response.data.review) {
        setReview(response.data.review)
        setError(``)
      } else {
        setError("No review received")
        setReview(``)
      }
    } catch (err) {
      console.error("Error:", err)
      const errorMessage = err.response?.data?.error || err.message || "Failed to review code"
      setError(errorMessage)
      setReview(``)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <main>
        <div className="left">
          <div className="code">
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
                border: "1px solid #ddd",
                borderRadius: "5px",
                height: "100%",
                width: "100%"
              }}
            />
          </div>
          <div
            onClick={reviewCode}
            disabled={loading}
            className="review"
            style={{ opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Reviewing...' : 'Review'}
          </div>
        </div>
        <div className="right">
          {error && (
            <div style={{ color: '#ff6b6b', padding: '10px', borderRadius: '5px', backgroundColor: '#ffe0e0' }}>
              <strong>Error:</strong> {error}
            </div>
          )}
          <Markdown
            rehypePlugins={[ rehypeHighlight ]}
          >{review}</Markdown>
        </div>
      </main>
    </>
  )
}



export default App
