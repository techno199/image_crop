import React, { Component } from 'react';
import './App.css';
import { ImageCrop } from './components/imageCrop';
import { Button } from './components/button';
import { Modal } from './components/modal';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

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
      <DragDropContextProvider backend={HTML5Backend}>
        <div className="App">
          <header className="App-header">
            <Button onClick={this.handleToggleButton}>
              Toggle modal
            </Button>
            <Modal 
              open={modalOpen}
              onOuterClick={this.handleToggleButton}
            >
              <ImageCrop 
                title='Выберите фотографию для вашей страницы'
              />
            </Modal>
          </header>
        </div>
      </DragDropContextProvider>
    );
  }
}

export default App;
