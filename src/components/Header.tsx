import React from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  useTheme,
  useMediaQuery,
  Avatar,
  Typography,
} from "@mui/material";
import kaban from "../assets/kaban.png";
import { useNavigate, useLocation } from "react-router-dom";

interface HeaderProps {
  username?: string;
  avatarUrl?: string;
}

const Header: React.FC<HeaderProps> = ({
  username = "Username",
  avatarUrl,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  const handleProfileClick = () => {
    navigate("/profile");
  };

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

        {/* Правая часть: либо кнопки auth, либо профиль */}
        {isAuthPage ? (
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
        ) : (
          <Box
            onClick={handleProfileClick}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              px: isMobile ? 1.5 : 2,
              py: isMobile ? 0.75 : 1,
              borderRadius: "10px",
              border: "2px solid #FFFFFF",
              backgroundColor: "#000000",
              cursor: "pointer",
              transition: "0.2s ease",
              "&:hover": {
                backgroundColor: "#111111",
              },
            }}
          >
            <Avatar
              src={avatarUrl}
              sx={{
                width: isMobile ? 32 : 40,
                height: isMobile ? 32 : 40,
                bgcolor: avatarUrl ? undefined : "#424242",
              }}
            >
              {!avatarUrl && username.charAt(0).toUpperCase()}
            </Avatar>
            <Typography
              sx={{
                color: "#FFFFFF",
                fontSize: isMobile ? 14 : 18,
                fontWeight: 500,
                maxWidth: 160,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {username}
            </Typography>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
