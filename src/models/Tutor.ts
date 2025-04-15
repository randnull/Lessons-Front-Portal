export interface TutorDetails {
    id: string;
    name: string;
    bio: string;
}

export interface Tutor {
    id: string;
    name: string;
}

export interface TutorPagination {
    tutors: Tutor[];
    pagesCount: number;
}

// Edit
