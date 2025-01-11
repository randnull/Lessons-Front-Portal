import type { ComponentType, JSX } from 'react';

// import { IndexPage } from '@/pages/IndexPage/IndexPage.tsx';
import { StartPage } from '@/pages/StartPage/StartPage.tsx';
import { MyOrdersPage } from "@/pages/MyOrders.tsx";
import {CreateOrderPage} from "@/pages/CreateOrderPage.tsx";
import { OrderDetailsPage } from "@/pages/MyOrdersDetails";

interface Route {
  path: string;
  Component: ComponentType;
  title?: string;
  icon?: JSX.Element;
  protected?: boolean;
}

export const routes: Route[] = [
  { path: '/', Component: StartPage},
  { path: '/orders', Component: MyOrdersPage},
  { path: '/create-order', Component: CreateOrderPage },
  { path: '/order/:id', Component: OrderDetailsPage },
];
