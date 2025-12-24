import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import ProjectPage from "./pages/ProjectPage";
import ProfilePage from "./pages/ProfilePage";
import ActivateAccountPage from "./pages/ActivateAccountPage";

const theme = createTheme({
  typography: {
    fontFamily: "Geologica, Arial, sans-serif",
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<LoginPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/project/:projectId" element={<ProjectPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/auth/activate" element={<ActivateAccountPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
