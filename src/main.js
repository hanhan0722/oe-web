import Vue from 'vue'
import App from './App'
import router from './router'
import store from './vuex/store'
import axios from 'axios'
import VueI18n from 'vue-i18n'
import VueLazyload from 'vue-lazyload'
import '@/assets/style/font.css'
import {
  Row, Col, Tooltip, Form, Button, Badge, Message, Dropdown, DropdownMenu, DropdownItem,
  FormItem, Input, Radio, Upload, Dialog, Loading, DatePicker, MessageBox
} from 'element-ui'
import { loadimg } from '@/assets/utils/directive'
import { timeFormat,dateFormat } from '@/assets/utils/filter'

Vue.use(VueI18n)
Vue.use(VueLazyload)
Vue.use(Row);
Vue.use(Col);
Vue.use(Tooltip);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Radio);
Vue.use(Upload);
Vue.use(Dialog);
Vue.use(Button);
Vue.use(Badge);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Loading);
Vue.use(DatePicker);

const messages = {
  'zh_Hans': require('./assets/lang/zh'),
  'en': require('./assets/lang/en')
}
const userLang = localStorage.getItem('lang') || 'en'
const i18n = new VueI18n({
  locale: userLang,
  messages
})

Vue.prototype.$ajax = axios
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
Vue.config.productionTip = false

new Vue({
  el: '#app',
  store,
  router,
  i18n,
  render: h => h(App),
  mounted () {
    document.dispatchEvent(new Event('render-event'))
  }
})
