import React, { Component } from 'react';
import './App.css';
import { ImageCrop } from './components/imageCrop';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

class App extends Component {
  render() {
    return (
      <DragDropContextProvider backend={HTML5Backend}>
        <div className="App">
          <header className="App-header">
            <ImageCrop 
              title='Выберите фотографию'
              onClose={this.handleToggleButton}
              onErrorLoadingImage={this.handleErrorLoading}
            />
          </header>
        </div>
      </DragDropContextProvider>
    );
  }
}

export default App;
