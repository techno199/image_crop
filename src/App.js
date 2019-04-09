import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Modal } from './components/modal'

class App extends Component {
  state = {
    modalOpen: false
  }

  handleToggleButton = e => {
    this.setState(oldState => ({
      modalOpen: !oldState.modalOpen
    }))
  }

  render() {
    const { modalOpen } = this.state

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <button onClick={this.handleToggleButton}>
            Toggle modal
          </button>
          <Modal open={modalOpen} onOuterClick={this.handleToggleButton}>
            <span>Some content</span>
          </Modal>
        </header>
      </div>
    );
  }
}

export default App;
