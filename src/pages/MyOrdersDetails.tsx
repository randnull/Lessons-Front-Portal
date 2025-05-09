import { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Page } from '@/components/Page';
import { Button, Cell, Headline, Input, Spinner, Modal, Textarea } from '@telegram-apps/telegram-ui';
import { OrderDetails, OrderUpdate } from "@/models/Order.ts";
import { deleteOrder, getOrderById, updateOrder } from "@/api/Orders.ts"; // Add submitReview
import { submitReview } from  "@/api/Responses.ts";
import { initData, useSignal } from "@telegram-apps/sdk-react";
import EditIcon from "@/icons/edit.tsx";

import styles from "./MyOrdersDetails.module.css";

export const OrderDetailsPage: FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [order, setOrder] = useState<OrderDetails | null>(null);
    const [editOrder, setEditOrder] = useState<OrderUpdate | null>(null);
    const [error, setError] = useState<string | null>(null);
    const initDataRaw = useSignal<string | undefined>(initData.raw);

    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // State for review modal
    const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
    const [selectedResponseId, setSelectedResponseId] = useState<string | null>(null);
    const [rating, setRating] = useState<number>(0);
    const [reviewText, setReviewText] = useState<string>("");

    // Load order data
    useEffect(() => {
        const currentOrder = async () => {
            if (id) {
                try {
                    if (!initDataRaw) {
                        setError("Нет токена");
                        return;
                    }
                    const OrderData = await getOrderById(id, initDataRaw);
                    setOrder(OrderData);
                } catch (err) {
                    setError('Не удалось получить заказ');
                } finally {
                    setIsLoading(false);
                }
            }
        };
        currentOrder();
    }, [id, initDataRaw]);

    // Delete order
    const HandleDeleteOrder = async (id: string) => {
        try {
            if (!initDataRaw) {
                alert('Не удалось удалить заказ. Ошибка авторизации');
                return;
            }
            if (confirm("Восстановить заказ будет невозможно. Вы хотите удалить заказ?")) {
                await deleteOrder(id, initDataRaw);
                navigate("/orders");
            }
        } catch (error) {
            alert('Не удалось удалить заказ.');
        }
    };

    // Update order
    const HandleUpdateModeOrder = async () => {
        if (order) {
            const editableOrder: OrderUpdate = {
                title: order.title,
                description: order.description,
                tags: order.tags,
                min_price: order.min_price,
                max_price: order.max_price,
            };
            setEditOrder(editableOrder);
            setIsEdit(true);
        }
    };

    const handleSaveChanges = async () => {
        if (!id || !initDataRaw || !editOrder) {
            setError("Ошибка: данные не загружены");
            return;
        }
        try {
            await updateOrder(id, initDataRaw, editOrder);
            setOrder({ ...order!, ...editOrder });
            setIsEdit(false);
            alert("Заказ успешно обновлен!");
        } catch (err) {
            setError("Ошибка при обновлении заказа");
        }
    };

    const HandleLinkFunc = (id: string) => {
        navigate(`/responses/${id}`);
    };

    // Open review modal
    const handleOpenReviewModal = (responseId: string) => {
        setSelectedResponseId(responseId);
        setRating(0);
        setReviewText("");
        setIsReviewModalOpen(true);
    };

    // Handle star rating
    const handleSetRating = (value: number) => {
        setRating(value);
    };

    // Submit review
    const handleSubmitReview = async () => {
        if (!selectedResponseId || !initDataRaw) {
            alert("Ошибка: данные не загружены");
            return;
        }
        try {
            const id = await submitReview(selectedResponseId, reviewText, rating, initDataRaw);
            setIsReviewModalOpen(false);
            setRating(0);
            setReviewText('');
            alert('Отзыв ' + id + ' успешно отправлен!');
        } catch (err) {
            alert("Ошибка при отправке отзыва");
        }
    };

    const finalResponse = order?.responses?.find((response) => response.is_final);

    return (
        <Page back={true}>
            <div className={styles.container}>
                {error ? (
                    <div className={styles.error}>
                        Извините, возникла ошибка при получении этого заказа: {error}
                    </div>
                ) : isLoading ? (
                    <Spinner className={styles.spinner} size="l" />
                ) : !order ? (
                    <Headline weight="1">Заказа не существует</Headline>
                ) : isEdit ? (
                    <Page back={true}>
                        <Headline weight="1">Редактирование заказа</Headline>
                        <Headline weight="2">Название</Headline>
                        <Input
                            header="Название"
                            value={editOrder?.title || ""}
                            onChange={(e) => setEditOrder({ ...editOrder!, title: e.target.value })}
                        />
                        <Headline weight="2">Описание</Headline>
                        <Input
                            header="Описание"
                            value={editOrder?.description || ""}
                            onChange={(e) => setEditOrder({ ...editOrder!, description: e.target.value })}
                        />
                        <div className={styles.footer}>
                            <Button size="l" onClick={handleSaveChanges}>
                                Сохранить
                            </Button>
                        </div>
                    </Page>
                ) : (
                    <>
                        <div className={styles.orderDetailsHeader}>
                            {order && order.response_count === 0 ? (
                                <span
                                    className={styles.iconPlaceholder}
                                    onClick={() => id && HandleDeleteOrder(id)}
                                    title="Удалить заказ"
                                    aria-label="Удалить заказ"
                                >
                  ✕
                </span>
                            ) : (
                                <span className={styles.iconPlaceholder}></span>
                            )}
                            <Headline weight="2" className={styles.centeredHeadline}>
                                Детали заказа
                            </Headline>
                            <span className={styles.iconPlaceholder}>
                <EditIcon
                    onClick={() => HandleUpdateModeOrder()}
                    style={{ cursor: "pointer" }}
                />
              </span>
                        </div>
                        <div className={styles.orderDetails}>
                            <Headline weight="1">{order.title}</Headline>
                            <p>Ставка: {order.min_price} - {order.max_price}</p>
                            <p>Описание: {order.description}</p>
                            <p>Статус: {order.status}</p>
                        </div>
                        <div className={styles.calls}>
                            <Headline weight="2" className={styles.centeredHeadline}>
                                {order.status === "Selected"  || order.status === "Closed" ? "Выбранный отклик" : "Отклики"}
                            </Headline>
                        </div>
                        <div className={styles.orderDetails}>
                            {!order || order.response_count === 0 ? (
                                <Headline weight="3">У вас пока нет откликов, но ваш заказ скоро заметят!</Headline>
                            ) : (
                                (order.status === "Selected" || order.status === "Closed"
                                        ? order.responses.filter((response) => response.is_final)
                                        : order.responses
                                ).map((response, index) => (
                                    <div key={index} className={styles.responseContainer}>
                                        <Cell
                                            onClick={() => HandleLinkFunc(response.id)}
                                            className={response.is_final ? styles.finalResponse : ""}
                                        >
                                            {response.name}
                                        </Cell>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className={styles.footer}>
                            {finalResponse && order.status === "Selected" && (
                                <Button
                                    size="l"
                                    onClick={() => handleOpenReviewModal(finalResponse.id)}
                                >
                                    Отзыв
                                </Button>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Review Modal */}
            <Modal
                open={isReviewModalOpen}
                onOpenChange={setIsReviewModalOpen}
            >
                <div className={styles.reviewModal}>
                    <Headline weight="2">Оцените репетитора</Headline>
                    <div className={styles.starRating}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={star <= rating ? styles.starActive : styles.star}
                                onClick={() => handleSetRating(star)}
                                style={{ cursor: "pointer", fontSize: "24px" }}
                            >
                ★
              </span>
                        ))}
                    </div>
                    <Textarea
                        placeholder="Напишите ваш отзыв"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        className={styles.reviewTextarea}
                    />
                    <Button
                        onClick={handleSubmitReview}
                        disabled={rating === 0}
                        className={styles.submitButton}
                    >
                        Отправить
                    </Button>
                </div>
            </Modal>
        </Page>
    );
};