import { FC, useState, useEffect } from 'react';
import { Page } from '@/components/Page.tsx';
import { List, Input, Multiselect } from '@telegram-apps/telegram-ui';
import { MultiselectOption } from '@telegram-apps/telegram-ui/dist/components/Form/Multiselect/types';
import { mainButton } from '@telegram-apps/sdk-react';

const options: MultiselectOption[] = [
    { value: 'cpp', label: 'C++' },
    { value: 'python', label: 'Python' }
];

export const CreateOrderPage: FC = () => {
    const [selectedValues, setSelectedValues] = useState<MultiselectOption[]>([]);

    const handleSelect = (selectedOptions: MultiselectOption[]) => {
        console.log("current list:", selectedOptions);
        setSelectedValues(selectedOptions);
    };

    const handleMainButtonClick = () => {
        let validSelections: string[] = [];

        let i = 0;

        for (i = 0; i < selectedValues.length; i++) {
            console.log("выбрано:", selectedValues[i])
            validSelections.push(selectedValues[i].value.toString());
        }

        if (validSelections.length == 0) {
            console.warn('Не выбрано ни одной валидной опции!');
            return;
        }
        console.log('MainButton clicked', validSelections);
    };

    useEffect(() => {
            mainButton.mount();
            mainButton.setParams({
                text: 'Создать заказ',
                isVisible: true,
            });

            mainButton.onClick(handleMainButtonClick);

            return () => {
                mainButton.offClick(handleMainButtonClick);
                mainButton.setParams({
                    isVisible: false,
                });

                console.log("удаляем...")
                mainButton.unmount();
            };

    }, []);

    return (
        <Page>
            <List>
                <Input header="Описание" placeholder="I am usual input, just leave me alone" />
                <Multiselect
                    options={options}
                    value={selectedValues}
                    onChange={handleSelect}
                />
            </List>
        </Page>
    );
};
