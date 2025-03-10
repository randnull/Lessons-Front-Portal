import {FC} from 'react';
import { Page } from '@/components/Page';
import {useParams} from "react-router-dom";
import {Headline} from "@telegram-apps/telegram-ui";


export const TutorInfoPage: FC = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <Page back={true}>
            <Headline weight="1"> {id} </Headline>
        </Page>
    );
};
