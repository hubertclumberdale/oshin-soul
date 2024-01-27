import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { CssBaseline, CssVarsProvider, GlobalStyles } from "@mui/joy";
import { theme } from "./theme";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <CssVarsProvider defaultMode="dark" theme={theme}>
      <GlobalStyles
        styles={{
          "*::-webkit-scrollbar": {
            width: "4px",
          },
          "*::-webkit-scrollbar-track": {
            background: "#222",
          },
          "*::-webkit-scrollbar-thumb": {
            background: "#414141",
            borderRadius: "8px",
          },
          "*::-webkit-scrollbar-thumb:hover": {
            background: "#555",
          },
          //set width to 4 if vertical and height to 4 if horizontal
          "*::-webkit-scrollbar:vertical": {
            width: "4px",
          },
          "*::-webkit-scrollbar:horizontal": {
            height: "4px",
          },
        }}
      />
      <CssBaseline />
    </CssVarsProvider>

    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
