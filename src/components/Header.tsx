import React from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import kaban from "../assets/kaban.png";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#1E1E1E",
        boxShadow: "none",
        px: { xs: 2, sm: 4, md: 10 },
        py: { xs: 1, sm: 1.5 },
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          minHeight: isMobile ? 64 : 96,
        }}
      >
        {/* Логотип слева */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <img
            src={kaban}
            alt="Kaban X"
            style={{
              height: isMobile ? 50 : 80,
              transition: "0.2s ease",
            }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: isMobile ? 1 : 2,
          }}
        >
          <Button
            variant="outlined"
            size="small"
            sx={{
              backgroundColor: "#FFFFFF",
              color: "#1E1E1E",
              borderColor: "#1E1E1E",
              borderWidth: 2,
              fontSize: isMobile ? 16 : 24,
              fontWeight: 600,
              padding: isMobile ? "8px 24px" : "16px 48px",
              borderRadius: "8px",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#1E1E1E",
                color: "#FFFFFF",
                borderColor: "#fff",
              },
            }}
            onClick={() => navigate("/login")}
          >
            Вход
          </Button>

          <Button
            variant="outlined"
            size="small"
            sx={{
              backgroundColor: "#1E1E1E",
              color: "#fff",
              borderColor: "#1E1E1E",
              borderWidth: 2,
              fontSize: isMobile ? 16 : 24,
              fontWeight: 600,
              padding: isMobile ? "8px 24px" : "16px 48px",
              borderRadius: "8px",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#1E1E1E",
                color: "#FFFFFF",
                borderColor: "#fff",
              },
            }}
            onClick={() => navigate("/register")}
          >
            Регистрация
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
