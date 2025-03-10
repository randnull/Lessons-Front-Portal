import {FC, useEffect, useState} from 'react';
import { Page } from '@/components/Page';
import {Cell, Headline, Placeholder, Spinner, Tabbar} from '@telegram-apps/telegram-ui';
import styles from './MyOrdersPage.module.css';
import {useNavigate} from "react-router-dom";
import {initData, useSignal} from "@telegram-apps/sdk-react";
import {Icon28Archive} from "@telegram-apps/telegram-ui/dist/icons/28/archive";
import {Icon32ProfileColoredSquare} from "@telegram-apps/telegram-ui/dist/icons/32/profile_colored_square";
import {getTutors} from "@/api/Tutors.ts";
import {Tutor} from "@/models/Tutor.ts";


export const TutorsPage: FC = () => {
    const navigate = useNavigate();
    const [IsLoading, SetIsLoading] = useState<boolean>(true);
    const [Error, SetError] = useState<string | null>(null);
    const [LoadTutor, SetTutors] = useState<Tutor[]>([]);
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
        const LoadTutors = async () => {
            try {
                if (!initDataRaw) {
                    SetError("Нет токена");
                    return
                }
                const data = await getTutors(initDataRaw);
                // console.log("Сохраняем заказы в состояние MyOrders:", data);
                SetTutors(data);
            } catch (err) {
                console.log(err);
                SetError("Не получили репетиторов");
            } finally {
                SetIsLoading(false);
            }
        };

        LoadTutors();
    }, []); // [initDataRaw]

    // const HandleAddFunc = () => {
    //     navigate("/create-order");
    // }

    const HandleLinkFunc = (id: string) => {
        navigate(`/tutor/${id}`);
    }

    return (
        <Page back={false}>
            <div className={styles.Title}>
                <Headline weight="1"> Репетиторы </Headline>
            </div>
            {/*<div className={styles.buttonContainer}>*/}
            {/*    <Button onClick={HandleAddFunc} mode="filled" size="m"> +</Button>*/}
            {/*</div>*/}
            { IsLoading? (
                <Spinner className={styles.spinner} size="l"/>
            ): Error? (
                <div>К сожалению возникла ошибка при загруке страницы. Пожалуйста, попробуйте позже</div>
            ): LoadTutor.length == 0 ? (
                <div className={styles.noOrders}>
                    <Placeholder header="Не нашли ни одного репетитора">
                        <img
                            alt="Telegram sticker"
                            className="blt0jZBzpxuR4oDhJc8s"
                            src="https://xelene.me/telegram.gif"
                        />
                    </Placeholder>
                </div>
            ) : (
                <div className={styles.orderList}>
                    {LoadTutor.map((tutor, index) => (
                        <Cell
                            key={index}
                            // before={<Avatar size={48} />}
                            description={tutor.name}
                            // subhead={order.}
                            // subtitle={order.min_price}
                            // titleBadge={order.status == "New" ? <Badge type="dot"/>: <Badge type="dot"/>}
                            onClick={() => HandleLinkFunc(tutor.id)}
                        >
                            {tutor.name}
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
                            if (id === "orders") {
                                navigate("/orders");
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
