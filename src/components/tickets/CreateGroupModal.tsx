import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";
import { useProject } from "../../context/ProjectContext";

const CreateGroupModal: React.FC = () => {
  const { isCreateGroupOpen, closeCreateGroupModal, createGroup } =
    useProject();

  const [title, setTitle] = useState("");

  useEffect(() => {
    if (isCreateGroupOpen) {
      setTitle("");
    }
  }, [isCreateGroupOpen]);

  const handleClose = () => {
    closeCreateGroupModal();
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      return;
    }
    await createGroup({ title: title.trim() });
    closeCreateGroupModal();
  };

  const isSubmitDisabled = !title.trim();

  return (
    <Dialog
      open={isCreateGroupOpen}
      onClose={handleClose}
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
      <DialogTitle>Создать группу</DialogTitle>
      <DialogContent dividers>
        <Box mt={1}>
          <TextField
            label="Название группы *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            autoFocus
          />
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

export default CreateGroupModal;
