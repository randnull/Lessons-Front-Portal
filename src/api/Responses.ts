import {CurrentResponse} from "@/models/Order.ts";

const api_link: string = 'https://lessonsmy.tech/api';


export const getResponseById = async (id: string, userdata: string): Promise<CurrentResponse | null> => {
    try {
        const AuthToken = localStorage.getItem("token");
        if (!AuthToken || !userdata) {
            return null // navigate auth page
        }
        const Responses = await fetch(`${api_link}/responses/id/${id}`, {
            method: "GET",
            headers: {"Authorization": AuthToken },
        });

        console.log("Response status:", Responses.status);
        console.log("Response headers:", Responses.headers);

        if (!Responses.ok) {
            throw new Error('Не удалось получить отклик');
        }
        return Responses.json();
    } catch (err) {
        return null;
    }
}
