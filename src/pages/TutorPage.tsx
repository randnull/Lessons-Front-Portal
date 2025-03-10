import {FC, useEffect, useState} from 'react';
import { Page } from '@/components/Page';
import {useParams} from "react-router-dom";
import {Headline, Spinner} from "@telegram-apps/telegram-ui";
import {initData, useSignal} from "@telegram-apps/sdk-react";
import {Tutor} from "@/models/Tutor.ts";
import {getTutorById} from "@/api/Tutors.ts";

// import styles from "./TutorPage.modules.css"


export const TutorInfoPage: FC = () => {
    const { id } = useParams<{ id: string }>();
    const initDataRaw = useSignal<string | undefined>(initData.raw);

    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [tutor, setTutor] = useState<Tutor | null>(null);

    useEffect(() => {
        const currentTutor = async () => {
            if (id) {
                try {
                    if (!initDataRaw) {
                        setError("Нет токена");
                        return
                    }
                    console.error(id)
                    const TutorData = await getTutorById(id, initDataRaw);
                    setTutor(TutorData);
                } catch (err) {
                    setError('Не удалось получить заказ');
                } finally {
                    setIsLoading(false);
                }
            }
        }
        currentTutor();
    }, [id, initDataRaw]);
    // className={styles.container}
    return (
        <Page back={true}>
            <div>
                { error ? (
                    <div>
                        Извините, возникла ошибка при получении этого заказа: {error}
                    </div>
                ): isLoading ? (
                    <Spinner size="l"/>
                ): !tutor ? (
                    <Headline weight="1">Заказа не существует</Headline>
                ) : (
                    <>
                        <div>
                            <Headline weight="2">Репетитор</Headline>
                        </div>
                        <div>
                            <Headline weight="1">{tutor.name}</Headline>
                            <p>Id: {tutor.id} </p>
                        </div>
                    </>
                )}
            </div>
        </Page>
    );
};
