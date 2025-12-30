import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    height: 100%;
    width: 100%;
  }

  body {
    font-family: 'Clear Sans', 'Helvetica Neue', Arial, sans-serif;
    background-color: #121213;
    color: white;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    min-height: 100vh;
  }

  button {
    font-family: inherit;
  }

  input {
    font-family: inherit;
  }
`;
