import {FC, useEffect, useState} from 'react';
import { Page } from '@/components/Page';
import {useNavigate, useParams} from "react-router-dom";
import {Headline, Spinner} from "@telegram-apps/telegram-ui";
import {CurrentResponse } from "@/models/Order.ts";
import {initData, useSignal, openTelegramLink, mainButton, secondaryButton} from "@telegram-apps/sdk-react";
import {getResponseById} from "@/api/Responses.ts";

import styles from "./ResponsePage.module.css"


export const ResponsePage: FC = () => {
    const navigate = useNavigate();

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

    useEffect(() => {
        if (currentResponse) {
            if (!secondaryButton.isMounted()) {
                secondaryButton.mount();
            }

            if (secondaryButton.setParams.isAvailable()) {
                secondaryButton.setParams({
                    text: 'Выбрать',
                    isEnabled: true,
                    isVisible: true
                })
            }

            const offClickSecondary = secondaryButton.onClick(async () => {
                secondaryButton.setParams({
                    isLoaderVisible: true,
                    isEnabled: false
                });

                if (confirm("Вы хотите выбрать этого репетитора?")) {
                    alert("Репетитор выбран!")
                    secondaryButton.setParams({
                        isLoaderVisible: false,
                        isEnabled: true
                    });
                    navigate(`/orders`);
                } else {
                    secondaryButton.setParams({
                        isLoaderVisible: false,
                        isEnabled: true
                    });
                }
            });

            return () => {
                offClickSecondary();
                secondaryButton.setParams({
                    isVisible: false,
                    isEnabled: false,
                });
                secondaryButton.unmount();
            }
        }
    }, [currentResponse]);

    useEffect(() => {
        if (currentResponse) {
            if (!mainButton.isMounted()) {
                mainButton.mount();
            }

            if (mainButton.setParams.isAvailable()) {
                mainButton.setParams({
                    text: 'Чат',
                    // убрать в отдельную проверку!
                    // нужен ли ref?
                    isEnabled: true,//titleRef.current.trim() !== '' && descriptionRef.current.trim() !== '' && tagsRef.current.length > 0, // прикол
                    isVisible: true
                });
            }

            const offClick = mainButton.onClick(async () => {
                // if (!(titleRef.current.trim() !== '' && descriptionRef.current.trim() !== '' && tagsRef.current.length > 0)) {
                //     alert('Заполните все поля на форме')
                //     return
                // }

                mainButton.setParams({
                    isLoaderVisible: true,
                    isEnabled: false
                });

                console.log(currentResponse)

                if (currentResponse?.tutor_username) {
                    handleShareLink(currentResponse.tutor_username)
                } else {
                    mainButton.setParams({
                        isLoaderVisible: false,
                        isEnabled: true
                    });
                    alert('Ошибка перехода в чат. Пожалуйста, попробуйте позже.')
                    return
                }
                mainButton.setParams({
                    isLoaderVisible: false,
                    isEnabled: true
                });
            });


            return () => {
                offClick();
                mainButton.setParams({
                    isVisible: false,
                    isEnabled: false,
                });
                mainButton.unmount();
            }
        }
    }, [currentResponse]);


    // if (shareURL.isAvailable()) {
    //     shareURL('https://t.me/heyqbnk', 'Check out this cool group!');
    // }
    // const handleShareLink = useCallback(() => {
    //     if (currentResponse?.tutor_username) {
    //         console.log(currentResponse.tutor_username)
    //         shareURL(`https://t.me/${currentResponse.tutor_username}`, "link:)");
    //     }
    // }, [currentResponse]);
    // const handleShareLink = () => {
    //     console.error(currentResponse?.tutor_username)
    //
    //     if (currentResponse?.tutor_username) {
    //         console.error(currentResponse.tutor_username)
    //         console.log(currentResponse.tutor_username)
    //         shareURL(`https://t.me/${currentResponse.tutor_username}`, "link:)");
    //     }
    // };
    const handleShareLink = (tutorUsername: string) => {
        console.log("Переданный tutorUsername:", tutorUsername);

        if (tutorUsername) {
            if (openTelegramLink.isAvailable()) {
                openTelegramLink(`https://t.me/${tutorUsername}`);
            }
        } else {
            console.warn("tutorUsername пуст!");
        }
    };

    return (
        <Page back={true}>
            <div className={styles.container}>
                { error ? (
                    <div>
                        Извините, возникла ошибка при получении этого заказа: {error}
                    </div>
                ): isLoading ? (
                    <Spinner className={styles.spinner} size="l"/>
                ): !currentResponse ? (
                    <Headline weight="1">Отклика не существует</Headline>
                ) : (
                    <>
                        <div className={styles.responseDetailsHeader}>
                            <Headline weight="2">Отлик # {currentResponse.id.slice(0,8)}</Headline>
                        </div>
                        <div className={styles.responseDetails}>
                            <Headline weight="1">{currentResponse.name}</Headline>
                            <p className={styles.responseTime}>Время отлика: {currentResponse.created_at}</p>
                        </div>
                    </>
                )}
            </div>
        </Page>
    )
};
