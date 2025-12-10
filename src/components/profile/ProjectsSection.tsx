import React, { useMemo, useState } from "react";
import {
  Box,
  TextField,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CreateProjectModal from "./CreateProjectModal";

interface Project {
  id: number | string;
  name: string;
}

const mockCreateProject = async (name: string): Promise<Project> => {
  // потом заменишь на реальный запрос к бэкенду
  console.log("[mock API] createProject", { name });
  await new Promise((r) => setTimeout(r, 150));
  return {
    id: Math.floor(Math.random() * 100000),
    name,
  };
};

const ProjectsSection: React.FC = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([
    { id: 1, name: "SoundCloudFM Team Project" },
    { id: 2, name: "Internal Tools Refactor" },
    { id: 3, name: "Marketing Automation" },
  ]);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return projects;
    return projects.filter((p) => p.name.toLowerCase().includes(query));
  }, [projects, search]);

  const handleOpenProject = (projectId: Project["id"]) => {
    // роут можно поменять под твой
    navigate(`/projects/${projectId}`);
  };

  const handleCreateClick = () => {
    setCreateOpen(true);
  };

  const handleCreateProject = async (name: string) => {
    const newProject = await mockCreateProject(name);
    setProjects((prev) => [...prev, newProject]);
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          backgroundColor: "#f2f2f2",
          borderRadius: "16px",
          padding: 2,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Поиск проекта по названию"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#ffffff",
              borderRadius: "12px",
            },
          }}
        />

        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            mb: 2,
          }}
        >
          {filteredProjects.length === 0 ? (
            <Typography color="text.secondary">Проекты не найдены.</Typography>
          ) : (
            <List disablePadding>
              {filteredProjects.map((project) => (
                <ListItemButton
                  key={project.id}
                  onClick={() => handleOpenProject(project.id)}
                  sx={{
                    borderRadius: "12px",
                    mb: 1,
                    backgroundColor: "#ffffff",
                    "&:hover": {
                      backgroundColor: "#e0e0e0",
                    },
                  }}
                >
                  <ListItemText primary={project.name} />
                </ListItemButton>
              ))}
            </List>
          )}
        </Box>

        <Button
          onClick={handleCreateClick}
          fullWidth
          sx={{
            mt: "auto",
            bgcolor: "#000000",
            color: "#ffffff",
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 600,
            py: 1.2,
            "&:hover": {
              bgcolor: "#222222",
            },
          }}
        >
          Создать
        </Button>
      </Box>

      <CreateProjectModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreateProject}
      />
    </>
  );
};

export default ProjectsSection;
