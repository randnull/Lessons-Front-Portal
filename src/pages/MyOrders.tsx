import {FC, useEffect, useState} from 'react';
import { Page } from '@/components/Page';
import {Avatar, Badge, Button, Cell, Headline, Placeholder} from '@telegram-apps/telegram-ui';
import styles from './MyOrdersPage.module.css';
import {useNavigate} from "react-router-dom";
import {Order} from "@/models/Order.ts";
import {getOrders} from "@/api/Orders.ts";
import {initData, useSignal} from "@telegram-apps/sdk-react";


export const MyOrdersPage: FC = () => {
    const navigate = useNavigate();
    const [IsLoading, SetIsLoading] = useState<boolean>(true);
    const [Error, SetError] = useState<string | null>(null);
    const [LoadOrder, SetNeworders] = useState<Order[]>([]);

    const initDataRaw = useSignal<string | undefined>(initData.raw);


    useEffect(() => {
        const LoadOrders = async () => {
            try {
                if (!initDataRaw) {
                    SetError("Нет токена");
                    return
                }
                const data = await getOrders(initDataRaw);
                console.log("Сохраняем заказы в состояние MyOrders:", data);
                SetNeworders(data);
            } catch (err) {
                console.log(err);
                SetError("Не получили заказы");
            } finally {
                SetIsLoading(false);
            }
        };

        LoadOrders();
    }, []); // [initDataRaw]

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
                        <Cell
                            key={index}
                            after={<Badge type="number">5</Badge>}
                            before={<Avatar size={48} />}
                            description={order.description}
                            // subhead={order.}
                            // subtitle={order.min_price}
                            titleBadge={<Badge type="dot" />}
                            onClick={() => HandleLinkFunc(order.id)}
                        >
                            {order.title}
                        </Cell>
                    ))}
                </div>
            )}
        </Page>
    );
};


{/*key={index}*/}
{/*header={order.subject}*/}
{/*subheader={order.id}*/}
{/*description={order.description}*/}
{/*className={styles.orderItem}*/}
