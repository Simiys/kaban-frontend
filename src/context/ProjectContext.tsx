import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

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

// ---- моковые данные ----

const initialGroups: Group[] = [
  {
    id: 1,
    title: "TO DO",
    items: [
      {
        id: "1",
        title: "UI приложения",
        description: "Описание UI блока...",
        epic: "PROJECT DEVELOPMENT",
        priority: "default",
      },
    ],
  },
  {
    id: 2,
    title: "IN PROGRESS",
    items: [
      {
        id: "2",
        title: "Изучить библиотеку MUI",
        description: "Надо изучить MUI и сделать UI...",
        epic: "SELF-DEVELOPMENT",
        priority: "low",
      },
      {
        id: "3",
        title: "UI приложения",
        description: "Вторая задача в прогрессе...",
        epic: "PROJECT DEVELOPMENT",
        priority: "high",
      },
    ],
  },
  {
    id: 3,
    title: "IN REVIEW",
    items: [],
  },
  {
    id: 4,
    title: "DONE",
    items: [
      {
        id: "0",
        title: "Изучить курсы по React",
        description: "Задача выполнена.",
        epic: "SELF-DEVELOPMENT",
        priority: "low",
      },
    ],
  },
];

const initialMembers: Member[] = [
  { id: 1, name: "Alice Johnson" },
  { id: 2, name: "Bob Smith" },
  { id: 3, name: "Carlos Silva" },
];

const mockApi = async (label: string, payload?: unknown) => {
  console.log(`[mock API] ${label}`, payload);
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

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [members] = useState<Member[]>(initialMembers);

  const [createTaskModal, setCreateTaskModal] = useState<{
    open: boolean;
    groupId: Group["id"] | null;
  }>({ open: false, groupId: null });

  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);

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

    const newTask: Task = {
      id: Math.floor(Math.random() * 100000),
      title,
      description,
      epic: epic && epic.trim() ? epic : "GENERAL",
      priority,
      assigneeId: assigneeId ?? null,
    };

    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId ? { ...g, items: [...g.items, newTask] } : g
      )
    );

    await mockApi("createTask", { groupId, task: newTask });
  };

  const deleteTask: ProjectContextValue["deleteTask"] = async (
    groupId,
    taskId
  ) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? { ...g, items: g.items.filter((t) => t.id !== taskId) }
          : g
      )
    );

    await mockApi("deleteTask", { groupId, taskId });
  };

  const updateTaskPriority: ProjectContextValue["updateTaskPriority"] = async (
    groupId,
    taskId,
    priority
  ) => {
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

    await mockApi("updateTaskPriority", { groupId, taskId, priority });
  };

  const assignTask: ProjectContextValue["assignTask"] = async (
    groupId,
    taskId,
    memberId
  ) => {
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

    await mockApi("assignTask", { groupId, taskId, memberId });
  };

  const moveTask: ProjectContextValue["moveTask"] = async (
    taskId,
    fromGroupId,
    toGroupId
  ) => {
    if (fromGroupId === toGroupId) return;

    setGroups((prev) => {
      const fromIndex = prev.findIndex((g) => g.id === fromGroupId);
      const toIndex = prev.findIndex((g) => g.id === toGroupId);

      if (fromIndex === -1 || toIndex === -1) return prev;
      if (Math.abs(fromIndex - toIndex) !== 1) return prev; // только соседние

      const next = [...prev];

      const fromGroup = next[fromIndex];
      const toGroup = next[toIndex];

      const fromItems = [...fromGroup.items];
      const toItems = [...toGroup.items];

      const taskIndex = fromItems.findIndex((t) => t.id === taskId);
      if (taskIndex === -1) return prev;

      const [task] = fromItems.splice(taskIndex, 1);
      toItems.push(task);

      next[fromIndex] = { ...fromGroup, items: fromItems };
      next[toIndex] = { ...toGroup, items: toItems };

      return next;
    });

    await mockApi("moveTask", { taskId, fromGroupId, toGroupId });
  };

  const createGroup: ProjectContextValue["createGroup"] = async ({ title }) => {
    const newGroup: Group = {
      id: Math.floor(Math.random() * 100000),
      title: title.trim() || "NEW GROUP",
      items: [],
    };

    setGroups((prev) => [...prev, newGroup]);
    await mockApi("createGroup", newGroup);
  };

  const deleteGroup: ProjectContextValue["deleteGroup"] = async (groupId) => {
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
    await mockApi("deleteGroup", { groupId });
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
