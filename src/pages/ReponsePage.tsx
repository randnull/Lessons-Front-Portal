import {FC, useEffect, useState} from 'react';
import { Page } from '@/components/Page';
import {useParams} from "react-router-dom";
import {Headline, Spinner} from "@telegram-apps/telegram-ui";
import {CurrentResponse} from "@/models/Order.ts";
import {initData, useSignal} from "@telegram-apps/sdk-react";
import {getResponseById} from "@/api/Responses.ts";


export const ResponsePage: FC = () => {
    // const navigate = useNavigate();

    const { id } = useParams<{ id: string }>();
    const [currentResponse, setResponses] = useState<CurrentResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const initDataRaw = useSignal<string | undefined>(initData.raw);

    const [isLoading, setIsLoading] = useState<boolean>(true);

    // загрузка данных
    useEffect(() => {
        const currentResponse = async () => {
            if (id) {
                try {
                    if (!initDataRaw) {
                        setError("Нет токена");
                        return
                    }
                    const ResponseData = await getResponseById(id, initDataRaw);
                    setResponses(ResponseData);
                } catch (err) {
                    setError('Не удалось получить отлик');
                } finally {
                    setIsLoading(false);
                }
            }
        }
        currentResponse();
    }, [id, initDataRaw]);

    return (
        <Page back={true}>
            <div>
                { error ? (
                    <div>
                        Извините, возникла ошибка при получении этого заказа: {error}
                    </div>
                ): isLoading ? (
                    <Spinner size="l"/>
                ): !currentResponse ? (
                    <Headline weight="1">Отклика не существует</Headline>
                ) : (
                    <>
                        <div>
                            <Headline weight="2">Отлик # {currentResponse.id.slice(0,8)}</Headline>
                        </div>
                        <div>
                            <Headline weight="1">{currentResponse.name}</Headline>
                            <p>Username: {currentResponse.tutor_username}</p>
                            <p>Время отлика: {currentResponse.created_at}</p>
                        </div>
                    </>
                )}
            </div>
        </Page>
    )
};
