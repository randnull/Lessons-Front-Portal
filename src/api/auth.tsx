import axios from 'axios';

const API_BASE = 'https://wbnr8w-2a00-1fa0-140-1dbb-90c8-bdd8-189-34db.ru.tuna.am';

export const getNewToken = async (initData: string) => {
    try {
        const response = await axios.post(`${API_BASE}/auth/init-data`, { initData });
        return response.data; // Предполагается, что сервер возвращает { token: string }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Axios error:", error.response?.data || error.message);
        } else {
            console.error("Unexpected error:", error);
        }
        throw error;
    }
};

//
// export const validateToken = async (token: string) => {
//     const response = await axios.post(`${API_BASE}/auth/validate`, { token });
//     return response.data;
// };
