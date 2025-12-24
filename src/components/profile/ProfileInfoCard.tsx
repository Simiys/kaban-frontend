import React from "react";
import { Box, Avatar, Typography, Button, Divider } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

interface ProfileInfoCardProps {
  username: string;
  email: string;
  avatarUrl?: string;
  onChangePassword?: () => void;
  onLogout?: () => void;
}

const ProfileInfoCard: React.FC<ProfileInfoCardProps> = ({
  username,
  email,
  avatarUrl,
  onLogout,
}) => {
  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#f2f2f2",
        borderRadius: "16px",
        padding: 3,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Avatar
        src={avatarUrl}
        sx={{
          width: 96,
          height: 96,
          mb: 2,
          bgcolor: avatarUrl ? undefined : "#424242",
          fontSize: 32,
        }}
      >
        {!avatarUrl && username.charAt(0).toUpperCase()}
      </Avatar>

      <Typography
        fontSize={20}
        fontWeight={600}
        sx={{ mb: 0.5, textAlign: "center" }}
      >
        {username}
      </Typography>

      <Typography
        fontSize={14}
        color="text.secondary"
        sx={{ mb: 3, textAlign: "center" }}
      >
        {email}
      </Typography>

      <Box
        sx={{
          width: "100%",
          borderRadius: "12px",
          backgroundColor: "#ffffff",
          overflow: "hidden",
          mt: "auto",
        }}
      >
        <Divider />

        <Button
          fullWidth
          onClick={onLogout}
          sx={{
            borderRadius: 0,
            textTransform: "none",
            justifyContent: "flex-start",
            px: 2,
            py: 1.5,
            color: "#d32f2f",
            gap: 1,
          }}
        >
          <LogoutIcon fontSize="small" />
          Выйти
        </Button>
      </Box>
    </Box>
  );
};

export default ProfileInfoCard;
