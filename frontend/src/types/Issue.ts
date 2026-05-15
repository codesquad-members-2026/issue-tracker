export interface User {
    id: number;
    name: string;
}

export interface Label {
    id: number;
    name: string;
    backgroundColor: string;
    textColor: string;
}

export interface Milestone {
    id: number;
    name: string;
}

export interface Issue {
    id: number;
    title: string;
    opened: boolean;
    createdAt: string;
    author: User;
    labels: Label[];
    milestone: Milestone;
}

export interface IssueResponse {
    success: boolean;
    message: string;
    data: {
        issues: Issue[];
        metadata: {
            openIssueCount: number;
            closedIssueCount: number;
            labelCount: number;
            milestoneCount: number;
        }
    }
}