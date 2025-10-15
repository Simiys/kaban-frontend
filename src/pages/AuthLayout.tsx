import React from "react";
import { Box, Typography, Button, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  sideTitle: string;
  sideSubtitle: string;
  sideButtonText: string;
  onSideButtonClick: () => void;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  sideTitle,
  sideSubtitle,
  sideButtonText,
  onSideButtonClick,
}) => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(-1);
  };

  const BackgroundSVG = () => (
    <svg
      width="1793"
      height="1941"
      viewBox="0 0 1793 1941"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
    >
      <rect x="-6" y="-1" width="1800" height="1941" fill="#242424" />
      <circle cx="16.5" cy="170.5" r="271.5" fill="black" />
      <rect
        x="287.871"
        y="659"
        width="168.502"
        height="168.502"
        transform="rotate(45.1445 287.871 659)"
        fill="black"
      />
      <rect
        x="1518.84"
        y="145.518"
        width="155.032"
        height="71.8272"
        transform="rotate(37.2585 1518.84 145.518)"
        fill="black"
      />
      <rect
        x="322.036"
        y="1819.26"
        width="131.687"
        height="45.5745"
        transform="rotate(-35.7664 322.036 1819.26)"
        fill="black"
      />
      <rect
        x="1838.26"
        y="126.38"
        width="1238.6"
        height="2463.83"
        transform="rotate(37.796 1838.26 126.38)"
        fill="black"
      />
      <circle cx="1729.5" cy="1729.5" r="428.5" fill="#242424" />
    </svg>
  );

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        fontFamily: '"Times New Roman", Times, serif',
        overflow: "hidden",
        "@media (max-width: 768px)": {
          flexDirection: "column",
        },
      }}
    >
      {/* Левая часть - форма */}
      <Box
        sx={{
          backgroundColor: "white",
          width: "57%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: "2vh",
          position: "relative",
          "@media (max-width: 768px)": {
            width: "100%",
            height: "70vh",
            order: 1,
          },
          "@media (max-width: 480px)": {
            height: "65vh",
            padding: "2vh",
          },
          "@media (max-width: 360px)": {
            height: "60vh",
          },
        }}
      >
        {/* Крестик закрытия */}
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: "3vh",
            left: "3vh",
            width: "5vh",
            height: "5vh",
            transition: "all 0.3s ease",
            zIndex: 10,
            "&:hover": {
              transform: "scale(1.3)",
            },
            "@media (max-width: 768px)": {
              top: "2vh",
              left: "2vh",
              width: "4.5vh",
              height: "4.5vh",
            },
            "@media (max-width: 480px)": {
              top: "1.5vh",
              left: "1.5vh",
              width: "4vh",
              height: "4vh",
            },
            "@media (max-width: 360px)": {
              width: "3.5vh",
              height: "3.5vh",
            },
          }}
        >
          <Close
            sx={{
              fontSize: "5vh",
              color: "#242424",
              fontWeight: "bold",
              "@media (max-width: 768px)": {
                fontSize: "4.5vh",
              },
              "@media (max-width: 480px)": {
                fontSize: "4vh",
              },
              "@media (max-width: 360px)": {
                fontSize: "3.5vh",
              },
            }}
          />
        </IconButton>

        {/* Заголовок */}
        <Box sx={{ marginBottom: "3vh", textAlign: "center" }}>
          <Typography
            sx={{
              fontSize: {
                xs: "4vh",
                md: "4vh",
                lg: "6vh",
              },
              fontFamily: '"Times New Roman", Times, serif',
              color: "#242424",
              whiteSpace: "nowrap",
              "@media (max-width: 768px)": {
                fontSize: "5vh",
                whiteSpace: "normal",
                lineHeight: 1.3,
              },
              "@media (max-width: 480px)": {
                fontSize: "4.5vh",
              },
              "@media (max-width: 360px)": {
                fontSize: "4vh",
              },
            }}
          >
            {title}
          </Typography>
        </Box>

        {children}
      </Box>

      {/* Правая часть - приветствие */}
      <Box
        sx={{
          backgroundColor: "#242424",
          width: "43%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "2vh",
          gap: "4vh",
          position: "relative",
          overflow: "hidden",
          "@media (max-width: 768px)": {
            width: "100%",
            height: "30vh",
            order: 2,
            gap: "3vh",
            padding: "3vh",
          },
          "@media (max-width: 480px)": {
            height: "35vh",
          },
          "@media (max-width: 360px)": {
            height: "40vh",
          },
        }}
      >
        <BackgroundSVG />

        <Typography
          sx={{
            color: "white",
            fontSize: {
              xs: "4vh",
              md: "4vh",
              lg: "6vh",
            },
            fontFamily: '"Times New Roman", Times, serif',
            textAlign: "center",
            lineHeight: 1.3,
            position: "relative",
            zIndex: 2,
            "@media (max-width: 768px)": {
              fontSize: "5vh",
            },
            "@media (max-width: 480px)": {
              fontSize: "4.5vh",
            },
            "@media (max-width: 360px)": {
              fontSize: "4vh",
            },
          }}
        >
          {sideTitle}
        </Typography>

        <Typography
          sx={{
            color: "white",
            fontSize: {
              xs: "2.2vh",
              md: "2.2vh",
              lg: "2.2vh",
            },
            fontFamily: '"Times New Roman", Times, serif',
            textAlign: "center",
            lineHeight: 1.5,
            position: "relative",
            zIndex: 2,
            "@media (max-width: 768px)": {
              fontSize: "1.8vh",
              lineHeight: 1.4,
            },
            "@media (max-width: 480px)": {
              fontSize: "1.7vh",
            },
            "@media (max-width: 360px)": {
              fontSize: "1.8vh",
            },
          }}
        >
          {sideSubtitle}
        </Typography>

        <Button
          onClick={onSideButtonClick}
          variant="outlined"
          sx={{
            width: "30%",
            padding: {
              xs: "2vh 0",
              md: "2vh 0",
              lg: "3vh 0",
            },
            border: "3px solid white",
            borderRadius: {
              xs: "3vh",
              md: "3vh",
              lg: "4vh",
            },
            backgroundColor: "transparent",
            color: "white",
            fontSize: {
              xs: "2vh",
              md: "2vh",
              lg: "2.8vh",
            },
            fontFamily: '"Times New Roman", Times, serif',
            transition: "all 0.3s ease",
            position: "relative",
            zIndex: 2,
            "&:hover": {
              backgroundColor: "white",
              color: "black",
              border: "3px solid white",
            },
            "@media (max-width: 768px)": {
              width: "40%",
              padding: "2.5vh 0",
              fontSize: "2.5vh",
              borderWidth: "2px",
            },
            "@media (max-width: 480px)": {
              width: "45%",
              padding: "2.2vh 0",
              fontSize: "2.2vh",
              borderRadius: "2.5vh",
            },
            "@media (max-width: 360px)": {
              width: "50%",
              padding: "2vh 0",
              fontSize: "2vh",
            },
          }}
        >
          {sideButtonText}
        </Button>
      </Box>
    </Box>
  );
};

export default AuthLayout;
