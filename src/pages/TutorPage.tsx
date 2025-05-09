import {FC, useEffect, useState} from 'react';
import { Page } from '@/components/Page';
import {useParams} from "react-router-dom";
import {Headline, Spinner} from "@telegram-apps/telegram-ui";
import {initData, useSignal} from "@telegram-apps/sdk-react";
import {TutorDetails} from "@/models/Tutor.ts";
import {getTutorById} from "@/api/Tutors.ts";
import styles from "./TutorPage.module.css"


export const TutorInfoPage: FC = () => {
    const { id } = useParams<{ id: string }>();
    const initDataRaw = useSignal<string | undefined>(initData.raw);

    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [tutor, setTutor] = useState<TutorDetails | null>(null);

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
            <div className={styles.container}>
                { error ? (
                    <div>
                        Извините, возникла ошибка при получении этого заказа: {error}
                    </div>
                ): isLoading ? (
                    <Spinner className={styles.spinner} size="l"/>
                ): !tutor ? (
                    <Headline weight="1">Репетитор не найден</Headline>
                ) : (
                    <>
                        <Headline weight="2" className={styles.centeredHeadline}>
                            Профиль репетитора
                        </Headline>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                textAlign: "center",
                                padding: "10px",
                                gap: "8px",
                            }}>
                            <p className={styles.statusText}>
                                {tutor.Tutor.Name}
                            </p>
                        </div>
                        <div className={styles.orderDetails}>
                            <p>Описание: {tutor.Bio}</p>
                        </div>
                    </>
                )}
            </div>
        </Page>
    );
};
