import React, { useState, type MouseEvent } from "react";
import { Box, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useProject } from "../../context/ProjectContext";

interface ProjectHeaderProps {
  name: string;
}

const mockFetchInviteLink = async (): Promise<string> => {
  await new Promise((r) => setTimeout(r, 150));
  return "https://app.example.com/project/invite/123";
};

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ name }) => {
  const { members } = useProject();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isCopying, setIsCopying] = useState(false);
  const [copied, setCopied] = useState(false);

  const openMembers = Boolean(anchorEl);

  const handleMembersClick = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMembersClose = () => {
    setAnchorEl(null);
  };

  const handleMemberSelect = (id: number | string) => {
    handleMembersClose();
    window.open(`/users/${id}`, "_blank");
  };

  const handleShareClick = async () => {
    if (isCopying) return;
    setIsCopying(true);
    setCopied(false);
    try {
      const link = await mockFetchInviteLink();
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(link);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = link;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Failed to copy invite link", e);
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <Box
      sx={{
        width: "1300px",
        height: "90px",
        background: "#000",
        borderRadius: "16px",
        paddingX: "20px",
        marginLeft: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        color: "#fff",
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
        }}
      >
        <Typography fontSize={24} fontWeight={600}>
          {name}
        </Typography>
        <IconButton
          size="small"
          onClick={handleMembersClick}
          sx={{ color: "#fff" }}
        >
          <ArrowDropDownIcon />
        </IconButton>
      </Box>

      {/* Кнопки справа */}
      <Box display="flex" alignItems="center" gap={1}>
        {copied && (
          <Typography fontSize={14} color="#90caf9">
            Ссылка скопирована
          </Typography>
        )}
        <IconButton
          sx={{ color: "#fff" }}
          onClick={handleShareClick}
          disabled={isCopying}
        >
          <ShareIcon />
        </IconButton>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={openMembers}
        onClose={handleMembersClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        {members.length === 0 && <MenuItem disabled>Нет участников</MenuItem>}
        {members.map((m) => (
          <MenuItem key={m.id} onClick={() => handleMemberSelect(m.id)}>
            {m.name}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default ProjectHeader;
