import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";

interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: {
    name: string;
    description: string;
  }) => Promise<void> | void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  open,
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (open) {
      setName("");
      setDescription("");
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    await onCreate({
      name: name.trim(),
      description: description.trim(),
    });
    onClose();
  };

  const isDisabled = !name.trim();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: 3,
          bgcolor: "#ffffff",
          color: "#000000",
        },
      }}
    >
      <DialogTitle>Создать проект</DialogTitle>
      <DialogContent dividers>
        <Box mt={1} display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Название проекта *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            autoFocus
          />

          <TextField
            label="Описание проекта"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            minRows={3}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} sx={{ color: "#000000" }}>
          Отмена
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isDisabled}
          sx={{
            bgcolor: "#000000",
            color: "#ffffff",
            "&:hover": { bgcolor: "#222222" },
          }}
        >
          Создать
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateProjectModal;
