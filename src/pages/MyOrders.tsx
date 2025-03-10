import {FC, useEffect, useState} from 'react';
import { Page } from '@/components/Page';
import {Badge, Button, Cell, Headline, Placeholder, Spinner, Tabbar} from '@telegram-apps/telegram-ui';
import styles from './MyOrdersPage.module.css';
import {useNavigate} from "react-router-dom";
import {Order} from "@/models/Order.ts";
import {getOrders} from "@/api/Orders.ts";
import {initData, useSignal} from "@telegram-apps/sdk-react";
import {Icon28Archive} from "@telegram-apps/telegram-ui/dist/icons/28/archive";
import {Icon32ProfileColoredSquare} from "@telegram-apps/telegram-ui/dist/icons/32/profile_colored_square";


export const MyOrdersPage: FC = () => {
    const navigate = useNavigate();
    const [IsLoading, SetIsLoading] = useState<boolean>(true);
    const [Error, SetError] = useState<string | null>(null);
    const [LoadOrder, SetNeworders] = useState<Order[]>([]);
    const [currentTabId, setCurrentTab] = useState<string>("orders");

    const initDataRaw = useSignal<string | undefined>(initData.raw);

    const tabs = [
        {
            id: "tutors",
            text: "Tutors",
            Icon: Icon32ProfileColoredSquare,
        },
        {
            id: "orders",
            text: "Orders",
            Icon: Icon28Archive,
        }
    ];

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
                <Spinner className={styles.spinner} size="l"/>
            ): Error? (
                <div>К сожалению возникла ошибка при загруке страницы. Пожалуйста, попробуйте позже</div>
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
                            after={<Badge type="number">{order.response_count}</Badge>}
                            // before={<Avatar size={48} />}
                            description={order.description}
                            // subhead={order.}
                            // subtitle={order.min_price}
                            // titleBadge={order.status == "New" ? <Badge type="dot"/>: <Badge type="dot"/>}
                            onClick={() => HandleLinkFunc(order.id)}
                        >
                            {order.title}
                        </Cell>
                    ))}
                </div>
            )}
            <Tabbar>
                {tabs.map(({ id, text, Icon }) => (
                    <Tabbar.Item
                        key={id}
                        text={text}
                        selected={id === currentTabId}
                        onClick={() => {
                            setCurrentTab(id);
                            if (id === "tutors") {
                                navigate("/tutors");
                            }
                        }}
                    >
                        <Icon />
                    </Tabbar.Item>
                ))}
            </Tabbar>
        </Page>
    );
};
