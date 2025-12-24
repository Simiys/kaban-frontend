import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ProjectsSection from "../components/profile/ProjectsSection";
import ProfileInfoCard from "../components/profile/ProfileInfoCard";
import { useApi, type UserResponse } from "../hooks/useApi";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { getCurrentUser, logout } = useApi();

  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadUser = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getCurrentUser();
        if (!cancelled) {
          setUser(data);
        }
      } catch (err: any) {
        console.error("Failed to load current user", err);
        if (!cancelled) {
          if (err?.status === 401) {
            logout();
            navigate("/login");
          } else {
            setError(err?.message || "Не удалось загрузить профиль.");
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadUser();

    return () => {
      cancelled = true;
    };
  }, [getCurrentUser, logout, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#ffffff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !user) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#ffffff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: 3,
        }}
      >
        <Typography color="error">
          {error || "Не удалось загрузить профиль."}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#ffffff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "stretch",
          ml: "20vw",
          gap: "10vw",
        }}
      >
        <Box
          sx={{
            width: 360,
            height: "70vh",
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
            avatarUrl={user.avatar_url ?? undefined}
            onChangePassword={() => {}}
            onLogout={handleLogout}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
