const API_BASE = 'https://lessonsmy.tech';

export const ValidateInitData = async (initData: string): Promise<boolean> => {
    try {
        console.log('initData', initData);
        const response = await fetch(`${API_BASE}/auth/init-data`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                initData: initData,
                role: "Student"
            })
        });

        if (response.status === 200) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            return true
        }

        return false;
    } catch (error) {
        console.error('Hello', error);
        return false; //
        // if (axios.isAxiosError(error)) {
        //     console.error("Axios error:", error.response?.data || error.message);
        //     return false;
        // } else {
        //     console.error("Unexpected error:", error);
        //     return false;
        // }
    }
};
