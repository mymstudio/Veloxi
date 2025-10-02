<template>
  <a-modal data-about  v-model:visible="visible" width="auto" hide-title="true" closable="false" footer="false">
    <div id="modal-contentB">
      <div class="version-img">
        <img src="../assets/cover.png" alt="logo">
      </div>
      <div class="version-info">
        <div class="icon">
          <div class="version-info-item-label">
            <img src="../assets/boxy.png" alt="" height="28">
          </div>
          <div class="version-info-item-title">Veloxi
            <a-tag color="red" size="small" style="margin-left: 4px; transform: translateY(-2.6px);">Dev</a-tag>
          </div>
        </div>
        <div class="version-info-item">
          <div class="version-info-item-label">版本号：</div>
          <div class="version-info-item-value">{{ version }}</div>
        </div>

        <div class="version-info-item-update-content">
          <h2>版本代号：Origin</h2>
          <span style="
          font-size: 13px;
          transform: translateY(-4px);
          color: #666666;
          font-weight: 400;
          ">万物起源说是</span>

          <span>
            第一个版本，没有更新日志）
          </span>

        </div>

      </div>
    </div>
  </a-modal>
</template>

<script setup>
import { useCookies } from '@vueuse/integrations/useCookies'
import { onMounted, ref } from 'vue'

const cookies = useCookies(['flyout', 'theme'])
const visible = ref(false)
const version = ref('0.0.0')
const themeMode = ref(cookies.get('theme') || 'auto')

function handleClick() {
  visible.value = true
}



function setTheme(value) {
  let theme = value
  if (value === 'auto') {
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  document.body.setAttribute('arco-theme', theme)
}



window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (event) {
  if (themeMode.value === 'auto') {
    setTheme(event.matches ? 'dark' : 'light')
  }
})

onMounted(() => {
  let style = document.createElement('style')
  style.innerHTML =
    '* { transition: color ease 50ms, background-color ease 200ms, border ease 300ms; }'
  document.head.appendChild(style)
})

setTheme(cookies.get('theme') || 'auto')

defineExpose({ handleClick })
</script>

<style lang="less">
#modal-contentB {
  justify-content: space-between;
  width: 100%;
  display: flex;
  align-items: start;
  flex-direction: row;
  -webkit-tap-highlight-color: transparent;
}

/* 使用Less语法来优化样式 */
a-modal[data-about] {
  :deep(.arco-modal-footer) {
    display: none !important;
  }
  
  :deep(.arco-modal-body) {
    padding: 0 !important;
    border-radius: 4px !important;
  }
}

.version-img {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 550px !important;
  height: 400px;
  
  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 90% center;
  }
}

.version-info {
  display: flex;
  justify-content: start;
  padding: 28px 24px;
  align-items: start;
  flex-direction: column;
}

.version-info-item {
  display: flex;
  justify-content: start;
  align-items: center;
  flex-direction: row;
}

.icon {
  display: flex;
  justify-content: start;
  align-items: center;
  flex-direction: row;
}

.version-info-item-title {
  font-size: 19.5px;
  font-weight: 600;
  margin-left: 12px;
  transform: translateY(-2.6px);
}

.version-info-item-update-content {
  display: flex;
  justify-content: start;
  padding: 16px;
  width: calc(100% - 32px);
  flex: 1;
  margin: 8px 0;
  border-radius: 8px;
  background-color: rgba(230, 230, 230, 0.233);
  align-items: start;
  flex-direction: column;
  
  h2 {
    font-size: 19px;
    font-weight: 600;
    margin: 0;
  }
  
  span {
    font-size: 14px;
    color: #252525;
    font-weight: 400;
  }
}

</style>
