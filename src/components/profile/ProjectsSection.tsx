// src/components/profile/ProjectsSection.tsx
import React, { useEffect, useMemo, useState } from "react";
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
import { useApi, type ProjectResponse } from "../../hooks/useApi";

const ProjectsSection: React.FC = () => {
  const navigate = useNavigate();
  const { listProjects, listTeams, createTeam, createProject } = useApi();

  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // id команды, в которую будем создавать проекты
  const [defaultTeamId, setDefaultTeamId] = useState<number | null>(null);

  // загрузка проектов + команд
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const [projectsResp, teamsResp] = await Promise.all([
          listProjects(), // /projects
          listTeams(), // /teams
        ]);

        if (cancelled) return;

        setProjects(projectsResp);

        if (teamsResp.length > 0) {
          setDefaultTeamId(teamsResp[0].id);
        } else {
          // если команды нет — создаём одну
          const team = await createTeam("My Team");
          if (!cancelled) {
            setDefaultTeamId(team.id);
          }
        }
      } catch (err: any) {
        console.error("Failed to load projects or teams", err);
        if (!cancelled) {
          setError(err?.message || "Не удалось загрузить проекты.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [listProjects, listTeams, createTeam]);

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return projects;
    return projects.filter((p) => p.name.toLowerCase().includes(query));
  }, [projects, search]);

  const handleOpenProject = (projectId: ProjectResponse["id"]) => {
    // тут потом подправим роут на твой формат
    navigate(`/project/${projectId}`);
  };

  const handleCreateClick = () => {
    setCreateOpen(true);
  };

  const handleCreateProject = async (data: {
    name: string;
    description: string;
  }) => {
    if (!defaultTeamId) {
      // если вдруг ещё не успели получить team_id
      console.warn("Нет team_id для создания проекта");
      return;
    }

    try {
      setCreating(true);
      setError(null);

      const created = await createProject({
        name: data.name,
        description: data.description || null,
        team_id: defaultTeamId,
      });

      setProjects((prev) => [...prev, created]);
    } catch (err: any) {
      console.error("Failed to create project", err);
      setError(err?.message || "Не удалось создать проект.");
      throw err;
    } finally {
      setCreating(false);
    }
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
          {loading ? (
            <Typography color="text.secondary">Загрузка проектов...</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : filteredProjects.length === 0 ? (
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
          disabled={creating || !defaultTeamId}
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
          {creating ? "Создаём..." : "Создать"}
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
