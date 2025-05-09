import {OrderCreate, OrderDetails, OrderPagination, OrderUpdate} from "@/models/Order.ts";

const api_link: string = 'https://lessonsmy.tech/api';

export const getOrders = async (userdata: string, limit: number, page: number): Promise<OrderPagination | null> => {
    try {
        const AuthToken = localStorage.getItem("token");
        if (!AuthToken || !userdata) {
            return null // navigate auth page
        }
        const ResponseOrders = await fetch(`${api_link}/orders/pagination/student?size=${limit}&page=${page}`, {
            method: "GET",
            headers: {"Authorization": AuthToken },
        });

        console.log("Response status:", ResponseOrders.status);
        console.log("Response headers:", ResponseOrders.headers);

        if (!ResponseOrders.ok) {
            const errorText = await ResponseOrders.text();
            throw new Error(errorText || 'Не удалось загрузить заказы');
        }
        const data = await ResponseOrders.json();

        const ordersData: OrderPagination = {
            orders: data.Orders || [],
            pages: data.Pages || 0,
        }

        console.log("Сохраняем заказы в состояние:", data);
        console.warn(data)
        return ordersData;
    } catch (error) {
        console.error(error);
        return null //
    }
}

export const getOrderById = async (id: string, userdata: string): Promise<OrderDetails | null> => {
    try {
        const AuthToken = localStorage.getItem("token");
        if (!AuthToken || !userdata) {
            return null // navigate auth page
        }
        const ResponseOrder = await fetch(`${api_link}/orders/id/${id}`, {
            method: "GET",
            headers: {"Authorization": AuthToken },
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

export const createOrder = async (orderdata: OrderCreate, userdata: string): Promise<string | null> => {
    try {
        const AuthToken = localStorage.getItem("token");
        if (!AuthToken || !userdata) {
            return null // navigate auth page
        }
        const responseOrder = await fetch(`${api_link}/orders`, {
            method: 'POST',
            body: JSON.stringify(orderdata),
            headers: {"content-type": 'application/json', "Authorization": AuthToken},
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

export const deleteOrder = async (id: string, userdata: string): Promise<void> => {
    try {
        const AuthToken = localStorage.getItem("token");
        if (!AuthToken || !userdata) {
            return
        }
        const responseOrder = await fetch(`${api_link}/orders/id/${id}`, {
            method: "DELETE",
            headers: {"Authorization": AuthToken },
        })

        if (!responseOrder.ok) {
            const error = await responseOrder.json();
            throw new Error("Ошибка при удалении заказа:" + error.error);
        }
    } catch (error) {
        // throw new Error("Ошибка при удалении заказа:")
        console.error(error);
    }
}

export const updateOrder = async (id: string, userdata: string, orderdata: OrderUpdate): Promise<void> => {
    try {
        const AuthToken = localStorage.getItem("token");
        if (!AuthToken || !userdata) {
            return
        }

        const responseOrder = await fetch(`${api_link}/orders/id/${id}`, {
            method: "PUT",
            body: JSON.stringify(orderdata),
            headers: {"content-type": 'application/json', "Authorization": AuthToken },
        })

        console.log("Response status:", responseOrder.status);
        console.log("Response headers:", responseOrder.headers);

        if (!responseOrder.ok) {
            const error = await responseOrder.json();
            throw new Error("Ошибка при обновлении заказа" + error.error);
        }
    } catch (error) {
        // throw new Error("Ошибка при удалении заказа:")
        console.error(error);
    }
}

export const selectTutorForOrder = async (responseId: string, userdata: string): Promise<void> => {
    try {
        const AuthToken = localStorage.getItem("token");
        if (!AuthToken || !userdata) {
            return
        }

        const responseOrder = await fetch(`${api_link}/orders/select/id/${responseId}`, {
            method: "POST",
            headers: {"content-type": 'application/json', "Authorization": AuthToken },
        })

        console.log("Response status:", responseOrder.status);
        console.log("Response headers:", responseOrder.headers);

        if (!responseOrder.ok) {
            const error = await responseOrder.json();
            throw new Error("Ошибка при обновлении заказа" + error.error);
        }
    } catch (error) {
        // throw new Error("Ошибка при удалении заказа:")
        console.error(error);
    }
}

export const setOrderStatus = async (userdata: string | undefined, id: string | undefined, status: boolean): Promise<boolean> => {
    try {
        const AuthToken = localStorage.getItem("token");
        if (!AuthToken || !userdata) {
            return false;
        }

        const responseOrder = await fetch(`${api_link}/orders/id/${id}/active`, {
            method: "POST",
            body: JSON.stringify({"is_active": status}),
            headers: {"content-type": 'application/json', "Authorization": AuthToken },
        })

        console.log("Response status:", responseOrder.status);
        console.log("Response headers:", responseOrder.headers);

        if (!responseOrder.ok) {
            const error = await responseOrder.json();
            throw new Error("Ошибка при обновлении заказа" + error.error);
        }
        return responseOrder.ok;
    } catch (error) {
        // throw new Error("Ошибка при удалении заказа:")
        console.error(error);
        return false;
    }
}