import React from 'react';
import PDFUploader from './components/PDFUploader';
import './App.css'; // Optional: for styling

function App() {
  return (
      <div className="App">
        {/* Header */}
        <header className="app-header">
          <h1>ADHD-Friendly PDF Reader</h1>
          <p>Optimized for enhanced reading experience</p>
        </header>

        {/* Upload Section */}
        <main className="app-main">
          <PDFUploader />
        </main>

        {/* Footer */}
        <footer className="app-footer">
          Powered by Advanced Technology
        </footer>
      </div>
  );
}

export default App;
