import {FC, useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import { Page } from '@/components/Page';
import {Button, Headline, Spinner} from '@telegram-apps/telegram-ui';
import {Order} from "@/models/Order.ts";
import {deleteOrder, getOrderById} from "@/api/Orders.ts";
import {initData, useSignal} from "@telegram-apps/sdk-react";

import styles from "./MyOrdersDetails.module.css"


export const OrderDetailsPage: FC = () => {
    const navigate = useNavigate();

    const { id } = useParams<{ id: string }>();
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const initDataRaw = useSignal<string | undefined>(initData.raw);

    const [isDeleted, setIsDeleted] = useState<boolean>(false);
// Сработало 4.01 в 01:41 без передачи здесь initDataRaw - при этом на бэк он пришел правильный. почему?

    const HandleDeleteOrder = async (id: string) => {
        try{
            if (!initDataRaw) {
                alert('Не удалось удалить заказ. Ошибка авторизации')
                return
            }
            await deleteOrder(id, initDataRaw);
            navigate("/orders")
        } catch (error) {
            alert('Не удалось удалить заказ.')
        } finally {
            setIsDeleted(true)
        }
    }

    useEffect(() => {
        const currentOrder = async () => {
            if (id) {
                try {
                    if (!initDataRaw) {
                        setError("Нет токена");
                        return
                    }
                    const OrderData = await getOrderById(id, initDataRaw);
                    setOrder(OrderData);
                } catch (err) {
                    setError('Не удалось получить заказ');
                } finally {
                    setIsLoading(false);
                }
            }
        }
        currentOrder();
    }, [id, initDataRaw]);

    return (
        <Page back={true}>
            <div className={styles.container}>
                { error ? (
                    <div className={styles.error}>
                        Извините, возникла ошибка при получении этого заказа: {error}
                    </div>
                ): isLoading ? (
                    <Spinner className={styles.spinner} size="l"/>
                ): !order ? (
                    <Headline weight="1">Заказа не существует</Headline>
                ) : (
                    <>
                        <Headline weight="2">Детали заказа # {order.id.slice(0,8)}</Headline>
                        <div className={styles.orderDetails}>
                            <Headline weight="1">{order.title}</Headline>
                            <p>Ставка: {order.min_price} - {order.max_price}</p>
                            <p>Описание: {order.description}</p>
                            <p>Статус: </p>
                        </div>
                        <Headline weight="2" className={styles.calls}>Отклики</Headline>
                        <div className={styles.orderDetails}>
                            У вас пока нет откликов, но ваш заказ скоро заметят!
                        </div>

                        {/* кнопка для удаления заказа*/}
                        <div className={styles.footer}>
                            <Button
                                size="l"
                                onClick={() => id && HandleDeleteOrder(id)}
                                disabled={isLoading || !order || isDeleted}
                            >
                                Удалить заказ
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </Page>
    )
};
