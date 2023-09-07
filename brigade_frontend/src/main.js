import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as labsComponents from 'vuetify/labs/components'
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import '@mdi/font/css/materialdesignicons.css';

import App from './App.vue';

import Home from './pages/Home.vue'

//Route pour operation
import OperationLoginForm from "./pages/OperationLoginForm.vue"
import ClientView from './pages/ClientPage/ClientView.vue'
import ReservationView from './pages/ReservationPage/ReservationView.vue'
import PlanSalleView from './pages/TablePage/TablePlanView.vue'
import PunchView from './pages/PunchPage/PunchView.vue'

//Route pour l espace employee
import EspaceLoginForm from './pages/EspaceLoginForm.vue'
import EspaceDashboard from './pages/Dashboard.vue'
import EmployeeView from './pages/EmployeePage/EmployeeView.vue'
import EmployeeInformationView from './pages/EmployeePage/EmployeeInformation.vue';
import LeaveView from "./pages/LeavePeage/LeaveView.vue"
import EventView from "./pages/EventPage/EventView.vue"
import EventInformation from "./pages/EventPage/EventInformation.vue"
import PunchManagerView from "./pages/PunchPage/PunchManagerView.vue"

import NotFoundView from './pages/NotFound.vue'

const app = createApp(App);

const router = createRouter({
    scrollBehavior(to, from, savedPosition)
    {
        // always scroll to top
        return { top: 0 }
    },
    history: createWebHistory(),
    routes: [
        { path: '/', component: Home },
        { path: '/espace', component: EspaceLoginForm },
        { path: '/espace/dashboard', component: EspaceDashboard },
        { path: '/espace/leave', component: LeaveView },
        { path: '/espace/leave/:employeeNumber', component: LeaveView, props: true },
        { path: '/espace/event', component: EventView },
        { path: '/espace/event/:name', component: EventInformation, props: true },
        { path: '/espace/employee', component: EmployeeView },
        { path: '/espace/employee/:employeeNumber', component: EmployeeInformationView, props: true },
        { path: '/espace/punch', component : PunchManagerView },

        { path: '/operation', component: OperationLoginForm },
        { path: '/operation/client', component: ClientView },
        { path: '/operation/punch', component: PunchView },
        { path: '/operation/reservation', component: ReservationView },
        { path: '/operation/plansalle', component: PlanSalleView },

        { path: '/:pathMatch(.*)*', component: NotFoundView}

    ]
});

app.use(router);

const vuetify = createVuetify({
    components: {
        ...components,
        ...labsComponents,
    },
    directives,
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi
        }
    }
});

app.use(vuetify);

app.mount("#app");