import React from 'react';
import logo from './logo.svg';
import './App.css';

// eslint-disable-next-line @typescript-eslint/naming-convention
function App() {
  function handleClick() {
    vscode.postMessage({type: 'onInfo', value: 'info message'});
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button type="button" onClick={handleClick}>React Button</button>
      </header>
    </div>
  );
}

export default App;
