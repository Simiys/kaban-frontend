import React from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { motion } from "framer-motion";

import ProjectHeader from "../components/projects/ProjectHeader";
import TicketGroup from "../components/tickets/TicketGroup";
import { ProjectProvider, useProject } from "../context/ProjectContext";
import CreateTaskModal from "../components/tickets/CreateTaskModal";
import CreateGroupModal from "../components/tickets/CreateGroupModal";
import { useParams } from "react-router-dom";

const MotionBox = motion(Box);

const ProjectPageInner: React.FC = () => {
  const { groups, openCreateGroupModal } = useProject();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const columnMinWidth = isMobile ? 260 : isTablet ? 280 : 300;
  const boardHeight = isMobile ? "calc(100vh - 140px)" : "calc(100vh - 200px)";

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        mt: isMobile ? 2 : 4,
      }}
    >
      <ProjectHeader name="SoundCloudFM Team Project" />

      <Box
        sx={{
          width: "100%",
          overflowX: "auto",
          overflowY: "hidden",
          mt: isMobile ? 2 : 4,
          pb: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: isMobile ? 2 : 3,
            px: isMobile ? 2 : 4,
            height: boardHeight,
            alignItems: "stretch",
          }}
        >
          {groups.map((group, index) => (
            <MotionBox
              key={group.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              sx={{
                minWidth: columnMinWidth,
                height: "100%",
                flexShrink: 0,
              }}
            >
              <TicketGroup
                groupId={group.id}
                title={group.title}
                items={group.items}
                index={index}
                totalGroups={groups.length}
              />
            </MotionBox>
          ))}

          {/* Кнопка создания новой группы */}
          <Box
            onClick={openCreateGroupModal}
            sx={{
              minWidth: columnMinWidth,
              height: "100%",
              border: "2px dashed #aaa",
              borderRadius: "16px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              flexShrink: 0,
              transition: "0.2s",

              "&:hover": {
                borderColor: "#fff",
                background: "rgba(255,255,255,0.05)",
              },

              "@media (hover: none)": {
                "&:hover": {
                  background: "transparent",
                },
              },
            }}
          >
            <Typography
              sx={{
                fontSize: isMobile ? 32 : 40,
                fontWeight: 300,
              }}
            >
              +
            </Typography>
          </Box>
        </Box>
      </Box>

      <CreateTaskModal />
      <CreateGroupModal />
    </Box>
  );
};

const ProjectPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  if (!projectId) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Проект не найден</Typography>
      </Box>
    );
  }

  return (
    <ProjectProvider projectId={Number(projectId)}>
      <ProjectPageInner />
    </ProjectProvider>
  );
};

export default ProjectPage;
