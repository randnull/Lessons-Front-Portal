import { FC } from 'react';
import { Page } from '@/components/Page';
import {Button, Banner, Headline, Placeholder} from '@telegram-apps/telegram-ui';
import styles from './MyOrdersPage.module.css';
import {useNavigate} from "react-router-dom";

interface Order {
    id: number;
    title: string;
    bid: string;
    description: string;
}


const orders: Order[] = [
    { id: 1, title: 'Разработка на C++', bid: '5000 руб.', description: 'Создание высокопроизводительного приложения на C++.' },
    { id: 2, title: 'Скрипт на Python', bid: '3000 руб.', description: 'Написание скрипта для автоматизации задач на Python.' },
    { id: 3, title: 'Веб-сайт на React', bid: '10000 руб.', description: 'Разработка современного веб-сайта с использованием React.' },
    { id: 4, title: 'Мобильное приложение на Flutter', bid: '15000 руб.', description: 'Создание кроссплатформенного мобильного приложения на Flutter.' },
    { id: 5, title: 'База данных на SQL', bid: '4000 руб.', description: 'Проектирование и создание базы данных на SQL.' },
    { id: 6, title: 'API на Node.js', bid: '7000 руб.', description: 'Разработка RESTful API на Node.js.' },
    { id: 7, title: 'Анализ данных на R', bid: '6000 руб.', description: 'Анализ и визуализация данных с использованием языка R.' },
    { id: 8, title: 'Игра на Unity', bid: '20000 руб.', description: 'Разработка 2D/3D игры на Unity.' },
    { id: 9, title: 'Сайт на WordPress', bid: '8000 руб.', description: 'Создание и настройка сайта на WordPress.' },
    { id: 10, title: 'Машинное обучение на Python', bid: '12000 руб.', description: 'Разработка модели машинного обучения на Python.' },
];

export const MyOrdersPage: FC = () => {
    const navigate = useNavigate()

    const HandleAddFunc = () => {
        navigate("/create-order")
    }

    const HandleLinkFunc = (id: number) => {
        navigate(`/order/${id}`)
    }

    return (
        <Page back={false}>
            <div className={styles.Title}>
                <Headline
                    weight="1"
                >
                    Мои заказы
                </Headline>
            </div>

            <div className={styles.buttonContainer}>
                <Button onClick={HandleAddFunc}
                    mode="filled"
                    size="m"
                > +
                </Button>
            </div>
            {orders.length == 0 ? (
                <div className={styles.noOrders}>
                    <Placeholder
                        header="Вы не создали ни одного заказа"
                    >
                        <img
                            alt="Telegram sticker"
                            className="blt0jZBzpxuR4oDhJc8s"
                            src="https://xelene.me/telegram.gif"
                        />
                    </Placeholder>
                </div>
            ) :
            <div className={styles.orderList}>
                {orders.map((order, index) => (
                    <Banner
                        key={index}
                        header={order.title}
                        subheader={order.bid}
                        description={order.description}
                        className={styles.orderItem}
                        onClick={() => HandleLinkFunc(order.id)}
                    />
                ))}
            </div>
            }
        </Page>
    );
};

// export default MyOrdersPage;