import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import ru from 'element-plus/lib/locale/lang/ru'
import App from './App.vue'

createApp(App).use(ElementPlus, { locale: ru }).mount('#app')
