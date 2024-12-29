import {FC, useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import { Page } from '@/components/Page';
import { Headline } from '@telegram-apps/telegram-ui';
import {Order} from "@/models/Order.ts";
import {getOrderById} from "@/api/Orders.ts";


export const OrderDetailsPage: FC = () => {
    const { id } = useParams<{ id: string }>();
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const currentOrder = async () => {
            if (id) {
                try {
                    const OrderData = await getOrderById(parseInt(id, 10));
                    setOrder(OrderData);
                } catch (err) {
                    setError('Не удалось получить заказ');
                } finally {
                    setIsLoading(false);
                }
            }
        }
        currentOrder();
    }, [id]);

    if (error) {
        return <Page back={true}>
            <Headline weight="1">Ошибка</Headline>
        </Page>
    }

    if (isLoading) {
        return <Page back={true}>
            <Headline weight="1">Загружаем заказ...</Headline>
        </Page>
    }

    if (!order) {
        return <Page back={true}>
            <Headline weight="1">Заказа не существует</Headline>
        </Page>
    }

    return <Page back={true}>
        <div>
            <Headline weight="1">Мои заказы</Headline>
            <Headline weight="1">{order.title}</Headline>
            <p>Ставка: {order.bid}</p>
            <p>Описание: {order.description}</p>
        </div>
    </Page>
};
