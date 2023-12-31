import Vue from 'vue';

import 'normalize.css/normalize.css'; // A modern alternative to CSS resets

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/en'; // lang i18n

import '@/styles/index.scss'; // global css
import '@/styles/mine.scss'; // global css
import '@/iconfont/iconfont.css'

import App from './App';
import store from './store';
import router from './router';

import '@/icons'; // icon
import '@/permission'; // permission control

import TextBody from '@/components/Text/TextBody';
import TextLabel from '@/components/Text/TextLabel';
import Subtitle from '@/components/Text/Subtitle';
import MainTitle from '@/components/Text/MainTitle';
import { _ } from 'core-js';

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const {mockXHR} = require('../mock');
//   mockXHR();
// }

// set ElementUI lang to EN
Vue.use(ElementUI, {locale});
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false;

Vue.prototype.$EventBus = new Vue();

Vue.component('text-body', TextBody);
Vue.component('text-label', TextLabel);
Vue.component('main-title', MainTitle);
Vue.component('subtitle', Subtitle);

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
