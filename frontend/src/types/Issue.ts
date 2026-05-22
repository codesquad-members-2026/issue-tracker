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
    progress?: number;
}

export interface Comment {
    id: number;
    author: User;
    contents: string;
    createdAt: string;
    isIssueAuthor: boolean;
}

export interface IssueDetail {
    id: number;
    title: string;
    contents: string;
    isOpened: boolean;
    createdAt: string;
    author: User;
    commentCount: number;
    comments: Comment[];
    assignees: User[];
    labels: Label[];
    milestone: Milestone | null;
}

export interface IssueDetailResponse {
    success: boolean;
    message: string;
    data: IssueDetail;
}

export interface Issue {
    id: number;
    title: string;
    isOpened: boolean;
    createdAt: string;
    author: User;
    labels: Label[];
    milestone: Milestone | null;
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