<template>
  <div id="zoombox">
    <a-space>
      <a-tooltip content="整理" position="top" mini>
        <a-button type="text" @click="handleCleanUpClick" aria-label="整理">
          <template #icon>
            <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
              <title>align_left_2_line</title>
              <g id="align_left_2_line" fill='none' fill-rule='evenodd'>
                <path
                  d='M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z' />
                <path fill='currentColor'
                  d='M5 3a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 2h10v4H5zm0 8a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2zm0 2h14v4H5z' />
              </g>
            </svg>
          </template>
        </a-button>
      </a-tooltip>
    </a-space>

    <a-space style="display: none;">
      <a-tooltip content="代码区" position="top" mini>
        <a-button type="text" @click="handleCodespace" aria-label="代码区">
          <template #icon>
            <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
              <title>code_line</title>
              <g id="code_line" fill='none'>
                <path d='M0 0h24v24H0z' />
                <path fill='currentColor'
                  d='M14.486 3.143a1 1 0 0 1 .692 1.233l-4.43 15.788a1 1 0 0 1-1.926-.54l4.43-15.788a1 1 0 0 1 1.234-.693M7.207 7.05a1 1 0 0 1 0 1.414L3.672 12l3.535 3.535a1 1 0 1 1-1.414 1.415L1.55 12.707a1 1 0 0 1 0-1.414L5.793 7.05a1 1 0 0 1 1.414 0m9.586 1.414a1 1 0 1 1 1.414-1.414l4.243 4.243a1 1 0 0 1 0 1.414l-4.243 4.243a1 1 0 0 1-1.414-1.415L20.328 12z' />
              </g>
            </svg>
          </template>
        </a-button>
      </a-tooltip>
    </a-space>
    <a-space>
      <a-tooltip content="缩小" position="top" mini>
        <a-button type="text" @click="handleSmallerClick" aria-label="缩小">
          <template #icon>
            <icon-smaller />
          </template>
        </a-button>
      </a-tooltip>
      <a-tooltip content="恢复为100%" position="top" mini>
        <a-button type="text" @click="handleResetClick" aria-label="恢复为100%">
          <span ref="scale">100%</span>
        </a-button>
      </a-tooltip>
      <a-tooltip content="放大" position="top" mini>
        <a-button type="text" @click="handleBiggerClick" aria-label="放大">
          <template #icon>
            <icon-bigger />
          </template>
        </a-button>
      </a-tooltip>
    </a-space>
  </div>
</template>

<script setup>
import { IconBug } from '@arco-design/web-vue/es/icon';
import { IconBigger, IconCleanup, IconCode, IconSmaller } from '@arco-iconbox/vue-boxy'
import { onMounted, ref } from 'vue'

import { useStore } from '../store/store'

const scale = ref()
const store = useStore()

function handleCleanUpClick() {
  store.workspaceSvg.cleanUp()
}

function handleCodespace() {
  store.hasLayoutSider = !store.hasLayoutSider
}

function handleSmallerClick() {
  let speed = store.workspaceSvg.options.zoomOptions.scaleSpeed
  let scale = store.workspaceSvg.scale
  store.workspaceSvg.zoom(0, 0, Math.log((scale - 0.15) / scale) / Math.log(speed))
}

function handleResetClick() {
  document.getElementsByClassName('blocklyZoom')[2].dispatchEvent(new PointerEvent('pointerdown'))
}

function handleBiggerClick() {
  let speed = store.workspaceSvg.options.zoomOptions.scaleSpeed
  let scale = store.workspaceSvg.scale
  store.workspaceSvg.zoom(0, 0, Math.log((scale + 0.15) / scale) / Math.log(speed))
}


function handleSimulatorClick() {
  store.hasSimulatorSider = !store.hasSimulatorSider
}


onMounted(() => {
  store.workspaceSvg.addChangeListener(() => {
    // 确保scale.value存在再设置innerHTML
    if (scale.value) {
      scale.value.innerHTML = Math.floor((store.workspaceSvg.scale * (5 / 3) - 1 / 3) * 100) + '%'
    }
  })
})
</script>

<style>
.blocklyZoom {
  display: block;
  opacity: 0;
}

#app>section>main {
  position: relative;
}

#zoombox {
  position: absolute;
  right: 40px;
  bottom: 40px;
  width: max-content;
  display: flex;
  align-items: center;

  svg {
    transform: scale(0.7);
  }

  >div {
    position: relative;
    z-index: 9;

    display: inline-flex;
    align-items: center;
    justify-content: space-evenly;

    margin-right: 10px;

    background-color: var(--color-bg-2);
    border: var(--color-border-2) solid 1px;
    border-radius: var(--border-radius-medium);

    >div {
      margin: 0 !important;

      >button>span {
        color: var(--color-text-2);
      }
    }
  }

  >div:nth-last-child(1) {
    margin-right: 0;

    >div:nth-child(2)>button {
      padding: 0 5px;
    }
  }
}

div.arco-trigger-popup.arco-trigger-position-top.arco-tooltip {
  visibility: hidden;
}

arco-btn-text,
.arco-btn-text[type='button'],
.arco-btn-text[type='submit'] {
  background: transparent !important;

  -webkit-tap-highlight-color: transparent;
}

arco-btn-text:active,
.arco-btn-text[type='button']:active,
.arco-btn-text[type='submit']:active {
  background: var(--color-fill-3) !important;
}

@media (any-hover: hover) {
  div.arco-trigger-popup.arco-trigger-position-top.arco-tooltip {
    visibility: visible;
  }

  arco-btn-text:hover,
  .arco-btn-text[type='button']:hover,
  .arco-btn-text[type='submit']:hover {
    background: var(--color-fill-2) !important;
  }
}
</style>
