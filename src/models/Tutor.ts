export interface Tutor {
    id: string;
    name: string;
}

export interface TutorPagination {
    tutors: Tutor[];
    pagesCount: number;
}
