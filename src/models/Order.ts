export interface Order {
    id: string;
    student_id: string;
    tutor_id: string;
    subject: string;
    description: string;
    min_price: number;
    max_price: number;
    created_at: string;
    updated_at: string;
}

export interface OrderCreate {
    title: string;
    description: string;
    min_price: number;
    max_price: number;
}

