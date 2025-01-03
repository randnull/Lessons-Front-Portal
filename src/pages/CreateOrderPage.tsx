import {FC, useEffect, useRef, useState} from 'react';
import { Page } from '@/components/Page.tsx';
import {List, Input, Textarea, Headline, Multiselect} from '@telegram-apps/telegram-ui';
import {mainButton} from "@telegram-apps/sdk-react";
import {OrderCreate} from "@/models/Order.ts";
import {createOrder} from "@/api/Orders.ts";
import {useNavigate} from "react-router-dom";
import {MultiselectOption} from "@telegram-apps/telegram-ui/dist/components/Form/Multiselect/types";

const options: MultiselectOption[] = [
    { value: 'cpp', label: 'C++' },
    { value: 'python', label: 'Python' }
];

export const CreateOrderPage: FC = () => {
    const [selectedValues, setSelectedValues] = useState<MultiselectOption[]>([]);
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');

    const titleRef = useRef(title);
    const descriptionRef = useRef(description);

    const navigate = useNavigate();

    const handleSelect = (selectedOptions: MultiselectOption[]) => {
        setSelectedValues(selectedOptions);
    };

    useEffect(() => {
        titleRef.current = title;
        descriptionRef.current = description
    }, [title, description]);

    useEffect(() => {
        if (!mainButton.isMounted()) {
            mainButton.mount();
        }
        if (mainButton.setParams.isAvailable()) {
            mainButton.setParams({
                text: 'Submit',
                isEnabled: true,
                isVisible: true
            });
        }

        const offClick = mainButton.onClick(async () => {
            mainButton.setParams({
                isLoaderVisible: true,
                isEnabled: false
            });

            const orderData: OrderCreate = {
                title: titleRef.current,
                description: descriptionRef.current,
                tags: ["C++", "Programming"],
                min_price: 1000,
                max_price: 2000
            };

            const orderId = await createOrder(orderData);

            console.log("Order ID:", orderId, orderData);

            mainButton.setParams({
                isLoaderVisible: false,
                isEnabled: true
            });

            alert('Заказ создан!')

            navigate(`/orders`);
        });

        return () => {
                offClick();
                mainButton.setParams({
                    isVisible: false,
                    isEnabled: false,
                });
                console.log("удаляем...");
                mainButton.unmount();
            }
    }, []);

    return (
        <Page>
            <List>
                <Headline weight="2" style={{ marginBottom: '8px' }}>
                    Введите название заказа
                </Headline>
                <Input
                    header="Название"
                    placeholder="Дискретная математика/Алгебра логики/..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <Headline weight="2" style={{ marginBottom: '8px', marginTop: '16px' }}>
                    Опишите задачу
                </Headline>
                <Textarea
                    header="Описание"
                    // status={"focused"}
                    placeholder="Я хочу сделать ..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <Multiselect
                    closeDropdownAfterSelect={true}
                    options={options}
                    value={selectedValues}
                    onChange={handleSelect}
                />
            </List>
        </Page>
    );
};
