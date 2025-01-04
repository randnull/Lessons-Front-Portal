import {Order, OrderCreate} from "@/models/Order.ts";

const api_link: string = 'https://ar2hdr-109-252-122-97.ru.tuna.am';

export const getOrders = async (userdata: string): Promise<Order[]> => {
    try {
        const ResponseOrders = await fetch(`${api_link}/orders`, {
            method: "GET",
            headers: {"token": userdata },
        });

        console.log("Response status:", ResponseOrders.status);
        console.log("Response headers:", ResponseOrders.headers);

        if (!ResponseOrders.ok) {
            const errorText = await ResponseOrders.text();
            throw new Error(errorText || 'Не удалось загрузить заказы');
        }
        const data = await ResponseOrders.json();
        console.log("Сохраняем заказы в состояние:", data);
        console.warn(data)
        return data || [];
    } catch (error) {
        console.error(error);
        return []
    }
}

export const getOrderById = async (id: string, userdata: string): Promise<Order | null> => {
    try {
        const ResponseOrder = await fetch(`${api_link}/orders/${id}`, {
            method: "GET",
            headers: {"token": userdata },
        });

        console.log("Response status:", ResponseOrder.status);
        console.log("Response headers:", ResponseOrder.headers);

        if (!ResponseOrder.ok) {
            throw new Error('Не удалось получить заказ');
        }
        return ResponseOrder.json();
    } catch (err) {
        return null;
    }
}

export const createOrder = async (data: OrderCreate, userdata: string): Promise<string | null> => {
    try {
        const responseOrder = await fetch(`${api_link}/orders`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {"content-type": 'application/json', "token": userdata},
        })

        if (!responseOrder.ok) {
            throw new Error("Ошибка при создании заказа");
        }

        const result = await responseOrder.json();
        return result.orderID;
    } catch (err) {
        console.error(err);
        return null;
    }
}