import '@arco-design/web-vue/dist/arco.css'
import 'highlight.js/styles/atom-one-dark.css'

import { Modal } from '@arco-design/web-vue'
import highlight from '@highlightjs/vue-plugin'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import { createPinia } from 'pinia'
import { registerSW } from 'virtual:pwa-register'
import { createApp } from 'vue'

import App from './App.vue'

hljs.registerLanguage('javascript', javascript)

const app = createApp(App)
const pinia = createPinia()
app.use(highlight)
app.use(pinia)
app.mount('#app')

if ('serviceWorker' in navigator) {
  const updateSW = registerSW({
    onNeedRefresh() {
      Modal.confirm({
        title: '注意',
        content: '当前版本有更新，请问是否立即更新。',
        okText: '确认',
        onOk: () => {
          updateSW(true)
        },
        onCancel: false,
        hideCancel: false
      })
    }
  })
}
