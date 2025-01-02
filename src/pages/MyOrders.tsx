import {FC, useEffect, useState} from 'react';
import { Page } from '@/components/Page';
import {Button, Banner, Headline, Placeholder} from '@telegram-apps/telegram-ui';
import styles from './MyOrdersPage.module.css';
import {useNavigate} from "react-router-dom";
import {Order} from "@/models/Order.ts";
import {getOrders} from "@/api/Orders.ts";

export const MyOrdersPage: FC = () => {
    const navigate = useNavigate();
    const [IsLoading, SetIsLoading] = useState<boolean>(true);
    const [Error, SetError] = useState<string | null>(null);
    const [LoadOrder, SetNeworders] = useState<Order[]>([]);

    useEffect(() => {
        const LoadOrders = async () => {
            try {
                const data = await getOrders();
                console.log("Сохраняем заказы в состояние MyOrders:", data);
                SetNeworders(data);
            } catch (err) {
                console.log(err);
                SetError("Не получили заказы ");
            } finally {
                SetIsLoading(false);
            }
        };

        LoadOrders();
    }, []);

    const HandleAddFunc = () => {
        navigate("/create-order");
    }

    const HandleLinkFunc = (id: string) => {
        navigate(`/order/${id}`);
    }

    return (
        <Page back={false}>
            <div className={styles.Title}>
                <Headline weight="1"> Мои заказы </Headline>
            </div>
            <div className={styles.buttonContainer}>
                <Button onClick={HandleAddFunc} mode="filled" size="m"> +</Button>
            </div>
            { IsLoading? (
                <div>Загружаем заказы...</div>
            ): Error? (
                <div>Ошибка(</div>
            ): LoadOrder.length == 0 ? (
                <div className={styles.noOrders}>
                    <Placeholder header="Вы не создали ни одного заказа">
                        <img
                            alt="Telegram sticker"
                            className="blt0jZBzpxuR4oDhJc8s"
                            src="https://xelene.me/telegram.gif"
                        />
                    </Placeholder>
                </div>
            ) : (
                <div className={styles.orderList}>
                    {LoadOrder.map((order, index) => (
                        <Banner
                            key={index}
                            header={order.subject}
                            subheader={order.id}
                            description={order.description}
                            className={styles.orderItem}
                            onClick={() => HandleLinkFunc(order.id)}
                        />
                    ))}
                </div>
            )}
        </Page>
    );
};
