export interface Tutor {
    Id: string;
    TelegramId: number;
    Name: string;
    Role: string;
    IsBanned: boolean;
}

export interface TutorDetails {
    Tutor: Tutor;
    Bio: string;
    ResponseCount: number;
    Reviews: null;
    IsActive: boolean;
    Tags: string[];
    Rating: number;
    CreatedAt: string;
}

export interface TutorPagination {
    Tutors: Tutor[];
    Pages: number;
}
