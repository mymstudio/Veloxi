<template>
  <a-modal v-model:visible="visible" width="auto" footer="false">
    <template #title>设置</template>
    <div id="modal-content">
      <a-space>
        <p>积木盒宽度</p>
        <a-radio-group :model-value="flyoutMode" @change="handleFlyoutChange" type="button">
          <a-radio value="full">适应</a-radio>
          <a-radio value="fixed">固定</a-radio>
        </a-radio-group>
      </a-space>
      <a-space>
        <p>主题</p>
        <a-select :model-value="themeMode" @change="handleThemeChange" style="text-align: justify">
          <a-option value="light">
            <template #icon>
              <IconLight />
            </template>
            <template #default>白天模式</template>
          </a-option>
          <a-option value="dark">
            <template #icon>
              <IconDark />
            </template>
            <template #default>黑夜模式</template>
          </a-option>
          <a-option value="auto">
            <template #icon>
              <IconAuto />
            </template>
            <template #default>跟随系统</template>
          </a-option>
        </a-select>
      </a-space>
    </div>
    <template #footer>
      <span style="color: var(--color-text-4)">Copyright 2025 Xuntower Studio</span>
    </template>
  </a-modal>
</template>

<script setup>
import { IconAuto, IconDark, IconLight } from '@arco-iconbox/vue-boxy'
import { useCookies } from '@vueuse/integrations/useCookies'
import { onMounted, ref } from 'vue'

const cookies = useCookies(['flyout', 'theme'])
const visible = ref(false)
const flyoutMode = ref(cookies.get('flyout') || 'full')
const themeMode = ref(cookies.get('theme') || 'auto')

function handleClick() {
  visible.value = true
}

function setFlyout() {
  const flyout = document.querySelector('div.injectionDiv > svg.blocklyFlyout')
  if (flyout) {
    flyout.style.width = '320px'
  }
}

function handleFlyoutChange(value) {
  setFlyout()
  flyoutMode.value = value
  cookies.set('flyout', value)
}

function setTheme(value) {
  let theme = value
  if (value === 'auto') {
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  document.body.setAttribute('arco-theme', theme)
}

function handleThemeChange(value) {
  setTheme(value)
  themeMode.value = value
  cookies.set('theme', value)
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

<style>
#modal-content > div {
  justify-content: space-between;
  width: 100%;

  -webkit-tap-highlight-color: transparent;
}
</style>
