import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Page } from '@/components/Page';
import { Headline } from '@telegram-apps/telegram-ui';

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

export const OrderDetailsPage: FC = () => {
    const { id } = useParams<{ id: string }>();
    const order = orders.find((order) => order.id === parseInt(id || '', 10));

    if (!order) {
        return (
            <Page back={true}>
                <Headline weight="1">Заказ не найден</Headline>
            </Page>
        );
    }

    return (
        <Page back={true}>
            <Headline weight="1">{order.title}</Headline>
            <p>Ставка: {order.bid}</p>
            <p>Описание: {order.description}</p>
        </Page>
    );
};
