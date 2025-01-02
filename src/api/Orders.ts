import {Order, OrderCreate} from "@/models/Order.ts";


const api_link: string = 'https://foh1fm-109-252-122-97.ru.tuna.am';

export const getOrders = async (): Promise<Order[]> => {
    try {
        const ResponseOrders = await fetch(`${api_link}/orders`, {
            method: "GET",
        });

        console.log("Response status:", ResponseOrders.status);
        console.log("Response headers:", ResponseOrders.headers);

        if (!ResponseOrders.ok) {
            throw new Error('Не удалось загрузить заказы');
        }
        const data = await ResponseOrders.json();
        console.log("Сохраняем заказы в состояние:", data);
        console.warn(data)
        return data || [];
    } catch (error) {
        console.error(error);
        return []
        // return fallbackOrders;
    }
}

export const getOrderById = async (id: string): Promise<Order | null> => {
    try {
        const ResponseOrder = await fetch(`${api_link}/orders/${id}`, {
            method: "GET",
        });
        if (!ResponseOrder.ok) {
            throw new Error('Не удалось получить заказ');
        }
        return ResponseOrder.json();
    } catch (err) {
        return null;
        // return fallbackOrders[id];
    }
}

export const createOrder = async (data: OrderCreate): Promise<string> => {
    try {
        const responseOrder = await fetch(`${api_link}/orders`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {"content-type": 'application/json'},
        })

        if (!responseOrder.ok) {
            throw new Error("Ошибка при создании заказа");
        }

        const result = await responseOrder.json();
        return result.orderID;
    } catch (err) {
        console.error(err);
        return "f9c97bc0-dbd9-464c-91db-68e61c34b30e";
    }
}