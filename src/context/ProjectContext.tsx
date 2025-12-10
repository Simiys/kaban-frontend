import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  useApi,
  type BoardResponse,
  type TicketResponse,
  type PriorityEnum,
  type TicketCreateRequest,
  type TicketUpdateRequest,
  type SectionCreateRequest,
} from "../hooks/useApi";

// локальный приоритет в UI
export type Priority = "high" | "default" | "low";

export interface Member {
  id: number | string;
  name: string;
  avatarUrl?: string;
}

export interface Task {
  id: number | string;
  title: string;
  description: string;
  epic: string;
  priority: Priority;
  assigneeId?: Member["id"] | null;
}

export interface Group {
  id: number;
  title: string;
  items: Task[];
}

interface ProjectContextValue {
  groups: Group[];
  members: Member[];

  // работа с тасками и колонками
  createTask: (data: {
    groupId: Group["id"];
    title: string;
    description: string;
    epic?: string;
    priority: Priority;
    assigneeId?: Member["id"] | null;
  }) => Promise<void>;
  deleteTask: (groupId: Group["id"], taskId: Task["id"]) => Promise<void>;
  updateTaskPriority: (
    groupId: Group["id"],
    taskId: Task["id"],
    priority: Priority
  ) => Promise<void>;
  assignTask: (
    groupId: Group["id"],
    taskId: Task["id"],
    memberId: Member["id"] | null
  ) => Promise<void>;
  moveTask: (
    taskId: Task["id"],
    fromGroupId: Group["id"],
    toGroupId: Group["id"]
  ) => Promise<void>;

  createGroup: (data: { title: string }) => Promise<void>;
  deleteGroup: (groupId: Group["id"]) => Promise<void>;

  // управление модалками
  isCreateTaskOpen: boolean;
  createTaskInitialGroupId: Group["id"] | null;
  openCreateTaskModal: (groupId: Group["id"]) => void;
  closeCreateTaskModal: () => void;

  isCreateGroupOpen: boolean;
  openCreateGroupModal: () => void;
  closeCreateGroupModal: () => void;
}

// ---- члены команды (пока мок) ----

const initialMembers: Member[] = [
  { id: 1, name: "Alice Johnson" },
  { id: 2, name: "Bob Smith" },
  { id: 3, name: "Carlos Silva" },
];

// маппинг приоритетов UI ↔ API
const apiPriorityToLocal = (p: PriorityEnum): Priority => {
  if (p === "high") return "high";
  if (p === "low") return "low";
  return "default"; // medium -> default
};

const localPriorityToApi = (p: Priority): PriorityEnum => {
  if (p === "high") return "high";
  if (p === "low") return "low";
  return "medium"; // default -> medium
};

// маппинг тикета с бэка в локальную Task
const mapTicketToTask = (ticket: TicketResponse): Task => ({
  id: ticket.id,
  title: ticket.name,
  description: ticket.task,
  epic: "GENERAL", // в API поля нет, держим простой эпик
  priority: apiPriorityToLocal(ticket.priority),
  assigneeId: null,
});

// маппинг BoardResponse → Group[]
const mapBoardToGroups = (board: BoardResponse): Group[] => {
  return [...board.sections]
    .sort((a, b) => a.order - b.order)
    .map((section) => ({
      id: section.id,
      title: section.name,
      items: section.tickets.map(mapTicketToTask),
    }));
};

const ProjectContext = createContext<ProjectContextValue | undefined>(
  undefined
);

export const useProject = (): ProjectContextValue => {
  const ctx = useContext(ProjectContext);
  if (!ctx) {
    throw new Error("useProject must be used within ProjectProvider");
  }
  return ctx;
};

interface ProjectProviderProps {
  projectId: number;
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({
  projectId,
  children,
}) => {
  const {
    getBoard,
    createTask: apiCreateTask,
    updateTask: apiUpdateTask,
    createSection: apiCreateSection,
  } = useApi();

  const [groups, setGroups] = useState<Group[]>([]);
  const [members] = useState<Member[]>(initialMembers);

  const [createTaskModal, setCreateTaskModal] = useState<{
    open: boolean;
    groupId: Group["id"] | null;
  }>({ open: false, groupId: null });

  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);

  // --- загрузка борды проекта ---

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const board = await getBoard(projectId);
        if (cancelled) return;
        setGroups(mapBoardToGroups(board));
      } catch (err) {
        console.error("Failed to load board", err);
        // можешь тут повесить тост/алерт
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [projectId, getBoard]);

  // --- модалки ---

  const openCreateTaskModal = (groupId: Group["id"]) => {
    setCreateTaskModal({ open: true, groupId });
  };

  const closeCreateTaskModal = () => {
    setCreateTaskModal({ open: false, groupId: null });
  };

  const openCreateGroupModal = () => setIsCreateGroupOpen(true);
  const closeCreateGroupModal = () => setIsCreateGroupOpen(false);

  // --- CRUD тасок и групп ---

  const createTask: ProjectContextValue["createTask"] = async (data) => {
    const { groupId, title, description, epic, priority, assigneeId } = data;

    const payload: TicketCreateRequest = {
      name: title,
      task: description,
      priority: localPriorityToApi(priority),
      complexity: 1,
      section_id: groupId,
    };

    // сначала создаём таску на бэке — чтобы получить id
    const created = await apiCreateTask(projectId, payload);

    const newTask: Task = {
      ...mapTicketToTask(created),
      epic: epic && epic.trim() ? epic : "GENERAL",
      assigneeId: assigneeId ?? null,
    };

    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId ? { ...g, items: [...g.items, newTask] } : g
      )
    );
  };

  const deleteTask: ProjectContextValue["deleteTask"] = async (
    groupId,
    taskId
  ) => {
    // в API пока нет delete, поэтому удаляем только локально
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? { ...g, items: g.items.filter((t) => t.id !== taskId) }
          : g
      )
    );
    console.warn(
      "[deleteTask] удалили таску только на фронте — на бэке нет ручки DELETE"
    );
  };

  const updateTaskPriority: ProjectContextValue["updateTaskPriority"] = async (
    groupId,
    taskId,
    priority
  ) => {
    const taskIdNum = Number(taskId);
    if (Number.isNaN(taskIdNum)) return;

    const payload: TicketUpdateRequest = {
      priority: localPriorityToApi(priority),
    };

    // сначала бэк
    await apiUpdateTask(projectId, taskIdNum, payload);

    // потом локально
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              items: g.items.map((t) =>
                t.id === taskId ? { ...t, priority } : t
              ),
            }
          : g
      )
    );
  };

  const assignTask: ProjectContextValue["assignTask"] = async (
    groupId,
    taskId,
    memberId
  ) => {
    // пока только локально, т.к. в API нет assignee
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              items: g.items.map((t) =>
                t.id === taskId ? { ...t, assigneeId: memberId } : t
              ),
            }
          : g
      )
    );
    console.warn(
      "[assignTask] изменение исполнителя только на фронте — в API нет поля assignee"
    );
  };

  const moveTask: ProjectContextValue["moveTask"] = async (
    taskId,
    fromGroupId,
    toGroupId
  ) => {
    if (fromGroupId === toGroupId) return;

    const taskIdNum = Number(taskId);
    if (Number.isNaN(taskIdNum)) return;

    // оптимистично обновляем UI
    setGroups((prev) => {
      const next = [...prev];
      const fromGroup = next.find((g) => g.id === fromGroupId);
      const toGroup = next.find((g) => g.id === toGroupId);
      if (!fromGroup || !toGroup) return prev;

      const fromItems = [...fromGroup.items];
      const idx = fromItems.findIndex((t) => t.id === taskId);
      if (idx === -1) return prev;

      const [task] = fromItems.splice(idx, 1);
      const toItems = [...toGroup.items, task];

      return next.map((g) =>
        g.id === fromGroupId
          ? { ...g, items: fromItems }
          : g.id === toGroupId
          ? { ...g, items: toItems }
          : g
      );
    });

    try {
      const payload: TicketUpdateRequest = {
        section_id: toGroupId,
      };
      await apiUpdateTask(projectId, taskIdNum, payload);
    } catch (err) {
      console.error("Failed to move task on backend", err);
      // сюда можно добавить откат стейта, если нужно
    }
  };

  const createGroup: ProjectContextValue["createGroup"] = async ({ title }) => {
    const name = title.trim() || "NEW GROUP";

    const payload: SectionCreateRequest = {
      name,
      order: groups.length,
    };

    const section = (await apiCreateSection(projectId, payload)) as unknown as {
      id: number;
      name: string;
      order: number;
    };

    const newGroup: Group = {
      id: section.id,
      title: section.name,
      items: [],
    };

    setGroups((prev) => [...prev, newGroup]);
  };

  const deleteGroup: ProjectContextValue["deleteGroup"] = async (groupId) => {
    // в API нет delete секции, поэтому только локально
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
    console.warn(
      "[deleteGroup] удалили колонку только на фронте — на бэке нет delete секции"
    );
  };

  return (
    <ProjectContext.Provider
      value={{
        groups,
        members,
        createTask,
        deleteTask,
        updateTaskPriority,
        assignTask,
        moveTask,
        createGroup,
        deleteGroup,
        isCreateTaskOpen: createTaskModal.open,
        createTaskInitialGroupId: createTaskModal.groupId,
        openCreateTaskModal,
        closeCreateTaskModal,
        isCreateGroupOpen,
        openCreateGroupModal,
        closeCreateGroupModal,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
