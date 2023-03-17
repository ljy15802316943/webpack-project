import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from "react-dom";
// import App from '@pages/inbiz-Image-search-upload';
// import '../library-dist/main.css'
import { App } from '../library-dist/main';
console.log(App, 'App');

// // react18.x版本语法
// // const root = ReactDOM.createRoot(document.getElementById('root'));
// // root.render(<App />);

// // react17.x版本语法
ReactDOM.render(<App />, document.getElementById('root'))