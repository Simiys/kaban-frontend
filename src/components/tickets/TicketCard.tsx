import React, { useState, type MouseEvent } from "react";
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AddIcon from "@mui/icons-material/Add";
import { motion, AnimatePresence } from "framer-motion";

import {
  type Priority,
  type Task,
  useProject,
} from "../../context/ProjectContext";

interface TicketCardProps extends Task {
  groupId: number;
  sx?: object;
}

const MotionBox = motion(Box);

const priorityConfig: Record<
  Priority,
  { label: string; Icon: typeof KeyboardArrowUpIcon; color: string }
> = {
  high: {
    label: "High priority",
    Icon: KeyboardArrowUpIcon,
    color: "#b71c1c",
  },
  default: {
    label: "Default priority",
    Icon: HorizontalRuleIcon,
    color: "#fbc02d",
  },
  low: {
    label: "Low priority",
    Icon: KeyboardArrowDownIcon,
    color: "#1976d2",
  },
};

const TicketCard: React.FC<TicketCardProps> = ({
  id,
  title,
  description,
  priority,
  assigneeId,
  groupId,
  sx,
}) => {
  const { members, deleteTask, updateTaskPriority, assignTask } = useProject();

  const [open, setOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [priorityMenuAnchor, setPriorityMenuAnchor] =
    useState<null | HTMLElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const normalizedPriority: Priority =
    priority && ["high", "default", "low"].includes(priority)
      ? (priority as Priority)
      : "default";

  const { Icon: PriorityIcon, color: priorityColor } =
    priorityConfig[normalizedPriority];

  const assignee = assigneeId
    ? members.find((m) => m.id === assigneeId) ?? null
    : null;

  const toggleOpen = () => setOpen((p) => !p);

  const handleCardClick = () => {
    if (isDragging) return;
    toggleOpen();
  };

  const handlePriorityIconClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setPriorityMenuAnchor(e.currentTarget);
  };

  const handlePriorityChange = async (newPriority: Priority) => {
    setPriorityMenuAnchor(null);
    await updateTaskPriority(groupId, id, newPriority);
  };

  const handlePriorityMenuClose = (e?: MouseEvent) => {
    e?.stopPropagation();
    setPriorityMenuAnchor(null);
  };

  const handleAvatarClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!assignee) {
      setAssignDialogOpen(true);
    } else {
      // далее можно заменить на роутер
      window.open(`/users/${assignee.id}`, "_blank");
    }
  };

  const handleAssignUser = async (memberId: number | string) => {
    await assignTask(groupId, id, memberId);
    setAssignDialogOpen(false);
  };

  const handleDeleteClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleteDialogOpen(false);
    await deleteTask(groupId, id);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({ taskId: id, fromGroupId: groupId })
    );
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <>
      <Box
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={handleCardClick}
        sx={{
          width: "100%",
          maxWidth: "250px",
          borderRadius: "8px",
          border: "2px solid #007bff40",
          padding: "8px",
          background: "#fff",
          cursor: "grab",
          userSelect: "none",
          color: "black",
          ...sx,
        }}
      >
        {/* Верхняя строка: заголовок + кнопка удаления */}
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography fontSize={18} fontWeight={600}>
            {title}
          </Typography>

          <IconButton onClick={handleDeleteClick}>
            <DeleteOutlineIcon sx={{ color: "#d32f2f" }} />
          </IconButton>
        </Box>

        {/* Task-id, аватарка исполнителя, приоритет */}
        <Box
          mt={2}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography fontSize={16} fontWeight={500}>
            Task-{id}
          </Typography>

          <Box display="flex" alignItems="center" gap={1}>
            {/* Аватарка исполнителя / плюсик */}
            <IconButton onClick={handleAvatarClick} sx={{ p: 0 }}>
              {assignee ? (
                <Avatar
                  src={assignee.avatarUrl}
                  sx={{
                    width: 28,
                    height: 28,
                    fontSize: 14,
                  }}
                >
                  {assignee.name.charAt(0).toUpperCase()}
                </Avatar>
              ) : (
                <Avatar
                  sx={{
                    width: 28,
                    height: 28,
                    bgcolor: "#ffffff",
                    border: "1px solid #bdbdbd",
                  }}
                >
                  <AddIcon sx={{ fontSize: 18, color: "#9e9e9e" }} />
                </Avatar>
              )}
            </IconButton>

            {/* Иконка приоритета + dropdown */}
            <IconButton onClick={handlePriorityIconClick}>
              <PriorityIcon sx={{ color: priorityColor }} />
            </IconButton>
          </Box>
        </Box>

        {/* Анимированное описание */}
        <AnimatePresence initial={false}>
          {open && (
            <MotionBox
              key="content"
              layout
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
              sx={{ overflow: "hidden" }} // или visible, если не нужно "обрезать" при анимации
            >
              <Typography
                mt={2}
                fontSize={14}
                color="#555"
                sx={{
                  wordBreak: "break-word", // длинные слова/ссылки ломаем
                  overflowWrap: "anywhere", // и вообще переносим где угодно, если нужно
                }}
              >
                {description}
              </Typography>
            </MotionBox>
          )}
        </AnimatePresence>
      </Box>

      {/* Dropdown приоритета */}
      <Menu
        anchorEl={priorityMenuAnchor}
        open={Boolean(priorityMenuAnchor)}
        onClose={handlePriorityMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {(Object.keys(priorityConfig) as Priority[]).map((p) => {
          const { Icon, label, color } = priorityConfig[p];
          return (
            <MenuItem
              key={p}
              selected={p === normalizedPriority}
              onClick={() => handlePriorityChange(p)}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Icon sx={{ color }} />
                <Typography>{label}</Typography>
              </Box>
            </MenuItem>
          );
        })}
      </Menu>

      {/* Диалог выбора исполнителя */}
      <Dialog
        open={assignDialogOpen}
        onClose={() => setAssignDialogOpen(false)}
      >
        <DialogTitle>Назначить исполнителя</DialogTitle>
        <DialogContent dividers>
          <List>
            {members.map((user) => (
              <ListItem
                key={user.id}
                button
                onClick={() => handleAssignUser(user.id)}
              >
                <ListItemAvatar>
                  <Avatar>{user.name.charAt(0).toUpperCase()}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={user.name} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)}>Отмена</Button>
        </DialogActions>
      </Dialog>

      {/* Диалог подтверждения удаления */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Удалить задачу?</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите удалить задачу <b>Task-{id}</b>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Отмена</Button>
          <Button color="error" onClick={handleDeleteConfirm}>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TicketCard;
