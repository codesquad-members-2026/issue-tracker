export interface FilterTokens {
    is?: 'open' | 'closed';
    author?: string;
    assignee?: string[];
    label?: string[];
    milestone?: string;
    commentAuthor?: string;
}

export const parseFilterString = (q: string): FilterTokens => {
    const tokens: FilterTokens = {};
    const regex = /(\w+):(?:"([^"]+)"|(\S+))/g;
    let match;

    while ((match = regex.exec(q)) !== null) {
        const key = match[1];
        const value = match[2] || match[3];

        switch (key) {
            case 'is':
                if (value === 'open' || value === 'closed') tokens.is = value;
                break;
            case 'author':
                tokens.author = value;
                break;
            case 'assignee':
                tokens.assignee = [...(tokens.assignee || []), value];
                break;
            case 'label':
                tokens.label = [...(tokens.label || []), value];
                break;
            case 'milestone':
                tokens.milestone = value;
                break;
            case 'mentions': // commentAuthorId filter
                tokens.commentAuthor = value;
                break;
        }
    }

    return tokens;
};

export const buildFilterString = (tokens: FilterTokens): string => {
    const parts: string[] = [];

    const formatValue = (value: string) => value.includes(' ') ? `"${value}"` : value;

    if (tokens.is) parts.push(`is:${tokens.is}`);
    if (tokens.author) parts.push(`author:${formatValue(tokens.author)}`);
    if (tokens.assignee) {
        tokens.assignee.forEach(a => parts.push(`assignee:${formatValue(a)}`));
    }
    if (tokens.label) {
        tokens.label.forEach(l => parts.push(`label:${formatValue(l)}`));
    }
    if (tokens.milestone) {
        parts.push(`milestone:${formatValue(tokens.milestone)}`);
    }
    if (tokens.commentAuthor) parts.push(`mentions:${formatValue(tokens.commentAuthor)}`);

    return parts.join(' ');
};
