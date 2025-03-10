import {Tutor} from "@/models/Tutor.ts";

// const api_link: string = 'https://lessonsmy.tech/api';

export const getTutors = async (userdata: string): Promise<Tutor[]> => {
    // try {
    //     const ResponseOrders = await fetch(`${api_link}/orders`, {
    //         method: "GET",
    //         headers: {"token": userdata },
    //     });
    //
    //     console.log("Response status:", ResponseOrders.status);
    //     console.log("Response headers:", ResponseOrders.headers);
    //
    //     if (!ResponseOrders.ok) {
    //         const errorText = await ResponseOrders.text();
    //         throw new Error(errorText || 'Не удалось загрузить заказы');
    //     }
    //     const data = await ResponseOrders.json();
    //     console.log("Сохраняем заказы в состояние:", data);
    //     console.warn(data)
    //     return data || [];
    // } catch (error) {
    //     console.error(error);
    //     return [] //
    // }
    if (!userdata) return [];
    return Array.from({length: 10}, (_, index) => ({
        id: "123123123123",
        name: "Tech" + index,
    }))
}
