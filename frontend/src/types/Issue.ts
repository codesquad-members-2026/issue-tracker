export interface User {
    id: number;
    name: string;
}

export interface Label {
    id: number;
    name: string;
    backgroundColor: string;
    textColor: string;
    description?: string;
}

export interface Milestone {
    id: number;
    name: string;
    description?: string;
    completionDate?: string;
    isOpened?: boolean;
    openIssueNum?: number;
    closedIssueNum?: number;
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

export interface CommonResponse<T = unknown> {
    success: boolean;
    message: string;
    data: T;
}

export type IssueDetailResponse = CommonResponse<IssueDetail>;

export interface Issue {
    id: number;
    title: string;
    isOpened: boolean;
    createdAt: string;
    author: User;
    labels: Label[];
    milestone: Milestone | null;
}

export interface IssueListResponse {
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

export interface LabelPageResponse {
    success: boolean;
    message: string;
    data: {
        metadata: {
            labelCount: number;
            milestoneCount: number;
        };
        labels: Label[];
    };
}

export interface MilestoneListResponse {
    success: boolean;
    message: string;
    data: {
        milestones: Milestone[];
    };
}

export interface IssueType {
    id: number;
    status: 'open' | 'closed';
    title: string;
    labels: {
        text: string;
        color: string;
        textColor: string;
    }[];
    authorName: string;
    timestamp: string;
    milestoneTitle: string | null;
}
