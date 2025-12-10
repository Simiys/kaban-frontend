import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";
import { useProject, type Priority } from "../../context/ProjectContext";

const priorityOptions: { value: Priority; label: string }[] = [
  { value: "high", label: "Высокий" },
  { value: "default", label: "Обычный" },
  { value: "low", label: "Низкий" },
];

const CreateTaskModal: React.FC = () => {
  const {
    isCreateTaskOpen,
    closeCreateTaskModal,
    createTask,
    createTaskInitialGroupId,
    members,
  } = useProject();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [epic, setEpic] = useState("");
  const [priority, setPriority] = useState<Priority>("default");
  const [assigneeId, setAssigneeId] = useState<"" | number | string>("");

  useEffect(() => {
    if (isCreateTaskOpen) {
      setTitle("");
      setDescription("");
      setEpic("");
      setPriority("default");
      setAssigneeId("");
    }
  }, [isCreateTaskOpen]);

  const handleClose = () => {
    closeCreateTaskModal();
  };

  const handleSubmit = async () => {
    if (!title.trim() || !createTaskInitialGroupId) return;

    await createTask({
      groupId: createTaskInitialGroupId,
      title: title.trim(),
      description: description.trim(),
      epic: epic,
      priority,
      assigneeId: assigneeId === "" ? null : assigneeId,
    });

    closeCreateTaskModal();
  };

  const isSubmitDisabled = !title.trim() || !createTaskInitialGroupId;

  return (
    <Dialog
      open={isCreateTaskOpen}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
          bgcolor: "#ffffff",
          color: "#000000",
        },
      }}
    >
      <DialogTitle>Создать задачу</DialogTitle>
      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="Название задачи *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            autoFocus
          />

          <TextField
            label="Описание"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            minRows={3}
          />

          <TextField
            label="Эпик (опционально)"
            value={epic}
            onChange={(e) => setEpic(e.target.value)}
            fullWidth
          />

          <TextField
            select
            label="Приоритет"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            fullWidth
          >
            {priorityOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Исполнитель"
            value={assigneeId}
            onChange={(e) =>
              setAssigneeId(e.target.value === "" ? "" : e.target.value)
            }
            fullWidth
          >
            <MenuItem value="">
              <Typography color="text.secondary">Не назначено</Typography>
            </MenuItem>
            {members.map((m) => (
              <MenuItem key={m.id} value={m.id}>
                {m.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} sx={{ color: "#000000" }}>
          Отмена
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
          sx={{
            bgcolor: "#000000",
            color: "#ffffff",
            "&:hover": {
              bgcolor: "#222222",
            },
          }}
        >
          Создать
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTaskModal;
