import {FC, useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import { Page } from '@/components/Page';
import {Button, Headline, Input, Spinner} from '@telegram-apps/telegram-ui';
import {Order, OrderUpdate} from "@/models/Order.ts";
import {deleteOrder, getOrderById, updateOrder} from "@/api/Orders.ts";
import { initData, useSignal } from "@telegram-apps/sdk-react";

import styles from "./MyOrdersDetails.module.css"


export const OrderDetailsPage: FC = () => {
    const navigate = useNavigate();

    const { id } = useParams<{ id: string }>();
    const [order, setOrder] = useState<Order | null>(null);
    const [editOrder, setEditOrder] = useState<OrderUpdate | null>(null);
    const [error, setError] = useState<string | null>(null);
    const initDataRaw = useSignal<string | undefined>(initData.raw);

    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isDeleted, setIsDeleted] = useState<boolean>(false);
// Сработало 4.01 в 01:41 без передачи здесь initDataRaw - при этом на бэк он пришел правильный. почему?

    // загрузка данных
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


    // удалить заказ
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
            setIsDeleted(true);
        }
    }

    // изменить заказ
    const HandleUpdateModeOrder = async () => {
        if (order) {

            const editableOrder: OrderUpdate = {
                title: order.title,
                description: order.description,
                tags: order.tags,
                min_price: order.min_price,
                max_price: order.max_price
            };

            setEditOrder(editableOrder);
            setIsEdit(true);
        }
    }

    const handleSaveChanges = async () => {
        if (!id || !initDataRaw || !editOrder) {
            setError("Ошибка: данные не загружены");
            return;
        }

        try {
            await updateOrder(id, initDataRaw, editOrder);

            if (order?.description) {
                order.description = editOrder.description
            }

            if (order?.title) {
                order.title = editOrder.title
            }
            setOrder(order)
            // const update_order: Order = {
            //     id: order?.id || "",
            //     student_id: order?.student_id || "",
            //     title: order?.title || "",
            //     description: order?.description || "",
            //     tags: order?.tags || [],
            //     min_price: order?.min_price || 0,
            //     max_price: order?.max_price || 0,
            //     status: order?.status || "",
            //     created_at: order?.created_at || "",
            //     updated_at: order?.updated_at || ""
            // }
            // !!! вот тут надо придумать как setOrder(editOrder)
            // setOrder(update_order)
            setIsEdit(false);
            alert("Заказ успешно обновлен!");
        } catch (err) {
            setError("Ошибка при обновлении заказа");
        }
    };

    // useEffect(() => {
    //     if (isEdit) {
    //         backButton.hide();
    //         backButton.show();
    //         return backButton.onClick(() => {
    //             navigate(`/order/${id}`);
    //         });
    //     }
    //     backButton.hide();
    // }, [isEdit]);

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
                ) : isEdit ? (
                    <Page back={true}>
                        <Headline weight="1">Редактирование заказа</Headline>
                            <Headline weight="2">Название</Headline>
                            <Input
                                header="Название"
                                value={editOrder?.title || ""}
                                onChange={(e) => setEditOrder({...editOrder!, title: e.target.value})}/>
                            <Headline weight="2">Описание</Headline>
                            <Input
                                header="Описание"
                                value={editOrder?.description || ""}
                                onChange={(e) => setEditOrder({...editOrder!, description: e.target.value})}/>
                            {/*переделать или остальное переделать */}
                            <div className={styles.footer}>
                                <Button size="l" onClick={handleSaveChanges}>
                                    Сохранить
                                </Button>
                            </div>
                    </Page>
                ) : (
                    <>
                        <div className={styles.orderDetailsHeader}>
                            <Headline weight="2">Детали заказа # {order.id.slice(0,8)}</Headline>
                            <Button
                                size="l"
                                className={styles.editButton}
                                onClick={() => HandleUpdateModeOrder()}>
                                ✏️
                            </Button>
                        </div>
                        <div className={styles.orderDetails}>
                            <Headline weight="1">{order.title}</Headline>
                            <p>Ставка: {order.min_price} - {order.max_price}</p>
                            <p>Описание: {order.description}</p>
                            <p>Статус: {order.status}</p>
                        </div>
                        <Headline weight="2" className={styles.calls}>Отклики</Headline>
                        <div className={styles.orderDetails}>
                            У вас пока нет откликов, но ваш заказ скоро заметят!
                        </div>

                        {/* кнопка для удаления заказа*/}
                        {/* добавить подтвеждение */ }
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
