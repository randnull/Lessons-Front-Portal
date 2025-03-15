import {Tutor} from "@/models/Tutor.ts";

const api_link: string = 'https://lessonsmy.tech/api';

export const getTutors = async (userdata: string): Promise<Tutor[]> => {
    try {
        const AuthToken = localStorage.getItem("token");
        if (!AuthToken || !userdata) {
            return []
        }
        const ResponseOrders = await fetch(`${api_link}/users`, {
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
        console.log("Сохраняем заказы в состояние:", data);
        console.warn(data)
        return data || [];
    } catch (error) {
        console.error(error);
        return [] //
    }
}

export const getTutorById = async (id: string, userdata: string): Promise<Tutor | null> => {
    try {
        const AuthToken = localStorage.getItem("token");
        if (!AuthToken || !userdata) {
            return null
        }

        const ResponseOrders = await fetch(`${api_link}/users/id/${id}`, {
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
        console.log("Сохраняем заказы в состояние:", data);
        console.warn(data)
        return data || [];
    } catch (error) {
        console.error(error);
        return null
    }
}
