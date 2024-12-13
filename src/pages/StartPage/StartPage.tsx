import { useEffect } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { initData, useSignal } from '@telegram-apps/sdk-react';
import { getNewToken } from '@/api/auth';

export const StartPage: FC = () => {
    const initDataRaw = useSignal<string | undefined>(initData.raw);
    const navigate = useNavigate();

    useEffect(() => {
        const authenticate = async () => {
            if (!initDataRaw) {
                alert('Ошибка авторизации.');
                return;
            }
            try {
                const data = await getNewToken(initDataRaw);
                localStorage.setItem('jwt', data.token); //JWT
                navigate('/orders');
            } catch (error) {
                navigate('/orders');

                // console.error('Authorization failed:', error);
                // alert('Не удалось выполнить авторизацию.');
            }
        };

        authenticate();
    }, [initDataRaw, navigate]);

    return <p>Проверка авторизации...</p>;
};