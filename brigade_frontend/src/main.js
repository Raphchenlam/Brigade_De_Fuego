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


const app = createApp(App);

const router = createRouter({
    scrollBehavior(to, from, savedPosition) {
        // always scroll to top
        return { top: 0 }
    },
    history: createWebHistory(),
    routes: [
        // { path: '/', component: FormulaireLogin },
        // { path: '/recettes/:id', component: PageDetailRecette, props: true },
        // { path: '/admin/new-recipe', component: NewRecette },
        // { path: '/admin/update-recipe/:id', component: UpdateRecette, props: true },
        // { path: '/login', component: FormulaireLogin },
        // { path: '/login/new', component: FormulaireNouvUser }
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