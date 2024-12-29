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
        setSelectedValues(selectedOptions);
    };

    const handleMainButtonClick = () => {
        console.log('MainButton clicked', selectedValues);
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
            mainButton.unmount();
        };
    }, [selectedValues]);

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