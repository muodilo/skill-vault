
export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export interface Reflection {
  id: string;
  content: string;
  createdAt?: string | number | Date;
}

export interface Skill {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  tasks: Task[];
  reflections: Reflection[];
}
