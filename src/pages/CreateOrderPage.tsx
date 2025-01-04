import {FC, useEffect, useRef, useState} from 'react';
import { Page } from '@/components/Page.tsx';
import {
    List,
    Input,
    Textarea,
    Headline,
    Multiselect,
    Cell,
    Selectable
} from '@telegram-apps/telegram-ui';
import {initData, mainButton, useSignal} from "@telegram-apps/sdk-react";
import {OrderCreate} from "@/models/Order.ts";
import {createOrder} from "@/api/Orders.ts";
import {useNavigate} from "react-router-dom";
import {MultiselectOption} from "@telegram-apps/telegram-ui/dist/components/Form/Multiselect/types";

const options: MultiselectOption[] = [
    { value: 'cpp', label: 'C++' },
    { value: 'python', label: 'Python' } // подумать как вынести
];

export const CreateOrderPage: FC = () => {
    // idk как работать с этим говном, пусть будет так
    const [selectedValues, setSelectedValues] = useState<MultiselectOption[]>([]);

    const [tags, setTags] = useState<string[]>([]);
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [minPrice, setMinPrice] = useState<number>(0)
    const [maxPrice, setMaxPrice] = useState<number>(1000)

    const initDataRaw = useSignal<string | undefined>(initData.raw);

    const titleRef = useRef(title);
    const descriptionRef = useRef(description);
    const tagsRef = useRef(tags);

    const navigate = useNavigate();

    const priceRanges = {
        "1": { min: 0, max: 1000 },
        "2": { min: 1000, max: 5000 },
        "3": { min: 5000, max: 10000 },
    }; // убрать в отдельное место

    const handleSelect = (selectedOptions: MultiselectOption[]) => {
        setSelectedValues(selectedOptions);
        setTags(selectedOptions.map(option => String(option.value)));
    };

    const handleSelectPrice = (value: string)=> {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const priceNumber = priceRanges[value];
        if (priceNumber) {
            setMinPrice(priceNumber.min);
            setMaxPrice(priceNumber.max);
            console.log("выбрано!" + priceNumber.min + priceNumber.max)
        }
    };

    useEffect(() => {
        console.warn("tags in update:" + tags)
        titleRef.current = title;
        descriptionRef.current = description;
        tagsRef.current = tags;
    }, [title, description, tags]);

    useEffect(() => {
        if (!mainButton.isMounted()) {
            mainButton.mount();
        }
        if (mainButton.setParams.isAvailable()) {
            mainButton.setParams({
                text: 'Submit',
                // убрать в отдельную проверку!
                // нужен ли ref?
                isEnabled: true,//titleRef.current.trim() !== '' && descriptionRef.current.trim() !== '' && tagsRef.current.length > 0, // прикол
                isVisible: true
            });
        }

        const offClick = mainButton.onClick(async () => {
            if (!(titleRef.current.trim() !== '' && descriptionRef.current.trim() !== '' && tagsRef.current.length > 0)) {
                alert('Заполните все поля на форме')
                return
            }

            mainButton.setParams({
                isLoaderVisible: true,
                isEnabled: false
            });

            const orderData: OrderCreate = {
                title: titleRef.current,
                description: descriptionRef.current,
                tags: tagsRef.current,
                min_price: minPrice,
                max_price: maxPrice
            };

            console.warn("tags:" + tagsRef.current)

            if (!initDataRaw) {
            // вот тут ошибку наверное?
                alert('Неправильня инициализация данных. Попробуйте позднее')
                return
            }

            try {
                const orderId = await createOrder(orderData, initDataRaw);
                alert('Заказ создан! ID: ' + orderId);
                navigate(`/orders`);
            } catch (error) {
                alert('Ошибка создания заказа');
            } finally {
                mainButton.setParams({ isLoaderVisible: false, isEnabled: true });
            }

            mainButton.setParams({
                isLoaderVisible: false,
                isEnabled: true
            });

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
                    status={"focused"}
                    placeholder="Дискретная математика/Алгебра логики/..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <Headline weight="2" style={{ marginBottom: '8px', marginTop: '16px' }}>
                    Опишите задачу
                </Headline>
                <Textarea
                    header="Описание"
                    status={"focused"}
                    placeholder="Я хочу сделать ..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <Headline weight="2" style={{ marginBottom: '8px', marginTop: '16px' }}>
                    Задайте теги для заказа
                </Headline>
                <Multiselect
                    creatable="Задать новый тег"
                    closeDropdownAfterSelect={true}
                    options={options}
                    value={selectedValues}
                    onChange={handleSelect}
                />
                <Headline weight="2" style={{ marginBottom: '8px', marginTop: '16px' }}>
                    Укажите цену заказа
                </Headline>
            {/*    тут */}
                <Cell
                    Component="label"
                    before={
                        <Selectable
                            defaultChecked
                            name="group"
                            value="1"
                            onChange={(e) => handleSelectPrice(e.target.value)}
                        />}
                    description="Бюджетный сегмент"
                    multiline
                >
                    До 1000₽
                </Cell>
                <Cell
                    Component="label"
                    before={
                        <Selectable
                            name="group"
                            value="2"
                            onChange={(e) => handleSelectPrice(e.target.value)}
                        />}
                    description="Средний сегмент"
                    multiline
                >
                    1000₽ - 5000₽
                </Cell>
                <Cell
                    Component="label"
                    before={
                        <Selectable
                            name="group"
                            value="2"
                            onChange={(e) => handleSelectPrice(e.target.value)}
                        />}
                    description="Дорогой сегмент"
                    multiline
                >
                    5000₽ - 10000₽
                </Cell>
            </List>
        </Page>
    );
};
