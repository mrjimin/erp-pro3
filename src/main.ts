import { createApp } from 'vue';
import App from './App.vue';

import pinia from '@/stores/index';
import router from './router';
import { directive } from '@/utils/directive';
import { setComponents } from '@/utils/components';

import 'uno.css';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

import '@/assets/css/font-awesome.min.css';
import '@/assets/css/iconfont-0708.css';
import '@/theme/index.scss';

// import 'default-passive-events'



const app = createApp(App);

directive(app);     //注册全局自定义指令
setComponents(app)  //注册全局组件

app.use(pinia);
app.use(router);
app.use(ElementPlus);


app.mount('#app');


