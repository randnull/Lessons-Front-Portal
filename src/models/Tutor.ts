export interface TutorDetails {
    id: string;
    name: string;
    bio: string;
}

export interface Tutor {
    Id: string;
    Name: string;
    Rating: number;
    Tags: string[];
}

export interface TutorPagination {
    Tutors: Tutor[];
    Pages: number;
}
