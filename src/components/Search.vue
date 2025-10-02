<template>
  <div id="search">
    <a-space :style="{ display: visible ? 'block' : 'none' }">
      <a-input placeholder="搜索作品中的积木" @input="handleInput" @press-enter="handlePressEnter">
        <template #append>
          <a-button type="text" @click="handleUpClick" aria-label="整理">
            <template #icon>
              <IconUp />
            </template>
          </a-button>
          <a-button type="text" @click="handleDownClick" aria-label="整理">
            <template #icon>
              <IconDown />
            </template>
          </a-button>
          <a-button type="text" @click="handleCloseClick" aria-label="关闭">
            <template #icon>
              <IconClose />
            </template>
          </a-button>
        </template>
      </a-input>
    </a-space>
  </div>
</template>

<script setup>
import { IconClose, IconDown, IconUp } from '@arco-iconbox/vue-boxy'
import { onMounted, ref, watch } from 'vue'

import { useStore } from '../store/store'

const visible = ref()
const store = useStore()

function open() {
  visible.value = true
}

function close() {
  visible.value = false
  store.searchPlugin.close()
}

function handleInput(value) {
  store.searchPlugin.searchAndHighlight(value)
}

function handlePressEnter() {
  store.searchPlugin.next()
}

function handleUpClick() {
  store.searchPlugin.previous()
}

function handleDownClick() {
  store.searchPlugin.next()
}

function handleCloseClick() {
  store.searchVisible = false
}

onMounted(() => {
  store.workspaceSvg.injectionDiv.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
      store.searchVisible = true
      event.preventDefault()
      event.stopPropagation()
    }
  })
  watch(store.$state, (state) => {
    if (state.searchVisible) {
      open()
    } else {
      close()
    }
  })
  close()
})
</script>

<style lang="less">
#search {
  position: absolute;
  right: 40px;
  top: 40px;
  z-index: 7;

  > div > div > span > span.arco-input-append {
    padding: 0 4px;
  }
}

div.blockly-ws-search {
  display: none !important;
}
</style>
