import type { ComponentType, JSX } from 'react';

// import { IndexPage } from '@/pages/IndexPage/IndexPage.tsx';
import { StartPage } from '@/pages/StartPage/StartPage.tsx';
import { MyOrdersPage } from "@/pages/MyOrders.tsx";
import {CreateOrderPage} from "@/pages/CreateOrderPage.tsx";
import { OrderDetailsPage } from "@/pages/MyOrdersDetails";
import {TutorInfoPage} from "@/pages/TutorPage.tsx";
import {TutorsPage} from "@/pages/Tutors.tsx";
import {ResponsePage} from "@/pages/ReponsePage.tsx";

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
  { path: '/tutor/:id', Component: TutorInfoPage },
  { path: '/tutors', Component: TutorsPage },
  { path: '/responses', Component: ResponsePage },
];
