import React from "react";
import { AppBar, Toolbar, Box, Button } from "@mui/material";
import kaban from "../assets/kaban.png";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#1E1E1E",
        boxShadow: "none",
        px: { xs: 2, md: 10 },
        py: 1.5,
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Логотип слева */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <img src={kaban} alt="Kaban X" style={{ height: 80 }} />
        </Box>

        {/* Кнопки справа */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* <Button
            variant="outlined"
            sx={{
              borderRadius: 5,
              borderColor: "#fff",
              color: "#fff",
              textTransform: "none",
              px: 3,
              "&:hover": {
                borderColor: "#fff",
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            Вход
          </Button> */}
          <Button
            variant="outlined"
            size="medium"
            sx={{
              backgroundColor: "#FFFFFF",
              color: "#1E1E1E",
              borderColor: "#1E1E1E",
              borderWidth: 2,
              fontSize: 24,
              fontWeight: "600",
              padding: "16px 48px",
              borderRadius: "8px",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#1E1E1E",
                color: "#FFFFFF",
                borderColor: "#fff",
              },
              "@media (max-width: 480px)": {
                fontSize: 20,
                padding: "12px 36px",
              },
            }}
            onClick={() => {
              navigate("/login");
            }}
          >
            Вход
          </Button>
          <Button
            variant="outlined"
            size="medium"
            sx={{
              backgroundColor: "#1E1E1E",
              color: "#fff",
              borderColor: "#1E1E1E",
              borderWidth: 2,
              fontSize: 24,
              fontWeight: "600",
              padding: "16px 48px",
              borderRadius: "8px",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#1E1E1E",
                color: "#FFFFFF",
                borderColor: "#fff",
              },
              "@media (max-width: 480px)": {
                fontSize: 20,
                padding: "12px 36px",
              },
            }}
            onClick={() => {
              navigate("/register");
            }}
          >
            Регистрация
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
