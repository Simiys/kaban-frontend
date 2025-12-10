import React from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

import ProjectHeader from "../components/projects/ProjectHeader";
import TicketGroup from "../components/tickets/TicketGroup";
import Header from "../components/Header";
import { ProjectProvider, useProject } from "../context/ProjectContext";
import CreateTaskModal from "../components/tickets/CreateTaskModal";
import CreateGroupModal from "../components/tickets/CreateGroupModal";

const MotionBox = motion(Box);

const ProjectPageInner: React.FC = () => {
  const { groups, openCreateGroupModal } = useProject();

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "left",
        mt: 4,
      }}
    >
      <ProjectHeader name="SoundCloudFM Team Project" />

      <Box
        sx={{
          width: "100%",
          overflowX: "auto",
          overflowY: "hidden",
          mt: 4,
          paddingBottom: 2,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            overflowX: "auto",
            width: "100vw",
            gap: 3,
            px: 4,
            height: "calc(100vh - 200px)",
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
                minWidth: "280px",
                height: "100%",
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
              minWidth: "250px",
              height: "100%",
              border: "2px dashed #aaa",
              borderRadius: "16px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              transition: "0.2s",
              "&:hover": {
                borderColor: "#fff",
                background: "rgba(255,255,255,0.05)",
              },
            }}
          >
            <Typography fontSize={40} fontWeight={300}>
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
  return (
    <>
      <Header />
      <ProjectProvider>
        <ProjectPageInner />
      </ProjectProvider>
    </>
  );
};

export default ProjectPage;
