export interface Order {
    id: number;
    title: string;
    bid: string;
    description: string;
}

export interface OrderCreate {
    title: string;
    description: string;
    min_price: number;
    max_price: number;
}

