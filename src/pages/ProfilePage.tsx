import React from "react";
import { Box } from "@mui/material";
import ProjectsSection from "../components/profile/ProjectsSection";
import ProfileInfoCard from "../components/profile/ProfileInfoCard";

const ProfilePage: React.FC = () => {
  const user = {
    username: "Artsyom K.",
    email: "user@example.com",
    avatarUrl: "",
  };

  const handleChangePassword = () => {
    console.log("change password clicked");
  };

  const handleLogout = () => {
    console.log("logout clicked");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#ffffff",
        display: "flex",
        justifyContent: "center", // центр по горизонтали
        alignItems: "center", // центр по вертикали
        px: 3,
      }}
    >
      {/* Внутренний контейнер НЕ растягиваем на 100% */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "stretch",
          ml: "20vw",
          gap: "10vw", // тот самый промежуток между компонентами
        }}
      >
        <Box
          sx={{
            width: 360,
            height: "70vh", // фиксированная/понятная ширина карточки
          }}
        >
          <ProjectsSection />
        </Box>

        <Box
          sx={{
            width: 360,
            height: "70vh",
          }}
        >
          <ProfileInfoCard
            username={user.username}
            email={user.email}
            avatarUrl={user.avatarUrl}
            onChangePassword={handleChangePassword}
            onLogout={handleLogout}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
