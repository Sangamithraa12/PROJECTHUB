export interface Project {
    id: number;
    name: string;
    description: string;
    dueDate?: string | Date;
}

export interface CreateProjectDto {
    name: string;
    description: string;
    dueDate?: string | Date;
}

export interface TaskItem {
    id: number;
    title: string;
    status: string;
    projectId: number;
    projectName?: string;
    assignedTo: number;
    assignedToName?: string;
    comments?: Comment[];
}

export interface CreateTaskDto {
    title: string;
    status: string;
    projectId: number;
    assignedTo: number;
}

export interface Comment {
    id: number;
    content: string;
    userId: number;
    userName?: string;
    createdAt: string | Date;
}

