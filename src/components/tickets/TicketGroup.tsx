import React, { useState } from "react";
import { Box, Typography, Divider, Button, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { motion, AnimatePresence } from "framer-motion";

import TicketCard from "./TicketCard";
import { type Task, useProject } from "../../context/ProjectContext";

interface TicketGroupProps {
  groupId: number;
  title: string;
  items: Task[];
  index: number;
  totalGroups: number;
}

const MotionBox = motion(Box);

const TicketGroup: React.FC<TicketGroupProps> = ({
  groupId,
  title,
  items,
  index,
  totalGroups,
}) => {
  const { openCreateTaskModal, deleteGroup, moveTask } = useProject();

  const [isDragOver, setIsDragOver] = useState(false);

  const handleAddTask = () => {
    openCreateTaskModal(groupId);
  };

  const handleDeleteGroup = () => {
    if (totalGroups <= 2) return;
    deleteGroup(groupId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // нужно, чтобы drop сработал
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const raw = e.dataTransfer.getData("application/json");
    if (!raw) return;

    try {
      const { taskId, fromGroupId } = JSON.parse(raw) as {
        taskId: Task["id"];
        fromGroupId: number;
      };

      await moveTask(taskId, fromGroupId, groupId);
    } catch {
      // ignore malformed data
    }
  };

  return (
    <Box
      sx={{
        width: "25%",
        minWidth: "280px",
        background: "#000",
        borderRadius: "16px",
        padding: "16px",
        color: "#fff",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1,
        }}
      >
        <Typography fontSize={20} fontWeight={600}>
          {title}
        </Typography>

        {totalGroups > 2 && (
          <IconButton
            size="small"
            onClick={handleDeleteGroup}
            sx={{ color: "#f44336" }}
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ borderColor: "#fff", opacity: 0.4, mb: 2 }} />

      <Box
        sx={{
          flex: 1,
          height: "90%",
          overflowY: "auto",
          pr: 1,
          border: isDragOver ? "1px dashed #90caf9" : "1px solid transparent",
          borderRadius: "12px",
          transition: "border 0.15s ease",
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <AnimatePresence>
          {items.map((task) => (
            <MotionBox
              key={task.id}
              layout
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              sx={{ mb: 2 }}
            >
              <TicketCard {...task} groupId={groupId} />
            </MotionBox>
          ))}
        </AnimatePresence>

        {/* Кнопка "Создать" только в одной (первой) колонке */}
        {index === 0 && (
          <Button
            onClick={handleAddTask}
            startIcon={<AddIcon />}
            sx={{
              width: "80%",
              color: "#fff",
              textTransform: "none",
              fontWeight: 600,
              mt: 1,
              ml: 1,
              "&:hover": { border: "1px solid #eaeaea" },
            }}
          >
            Создать
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default TicketGroup;
