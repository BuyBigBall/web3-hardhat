import './App.css';
import React from 'react';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import MainPage from './components/main';

function App() {

  const getLibrary = provider => {
    const library = new Web3Provider(provider);
    library.pollingInterval = 12000;
    console.log("getLibrary");
    return library;
  }

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <MainPage/>
    </Web3ReactProvider>
  );
}

export default App;
