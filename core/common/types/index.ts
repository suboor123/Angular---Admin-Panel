export interface HasId {
    id?: string;
}

export interface HasImageUrl {
    imageUrl: string;
}

export interface HasName {
    name: string
}

export interface HasCreatedAt {
    createdAt: string
}

export enum Entites {
    Projects = 'projects',
    Blogs = 'blogs',
    Profile = 'profile',
    Tags = 'tags',
    Comments = 'comments',
    Sessions = 'sessions',
    Notifications = 'notifications',
    Contact = 'contact',
    Visitor = 'visitor'
}