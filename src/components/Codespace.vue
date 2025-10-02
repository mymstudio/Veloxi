<template>
  <a-scrollbar style="overflow: auto">
    <div id="codespace">
      <div>
        <IconClose @click="handleCloseClick" />
      </div>
      <div>
        <highlightjs autodetect :code="code" />
      </div>
    </div>
  </a-scrollbar>
</template>

<script setup>
import { IconClose } from '@arco-iconbox/vue-boxy'
import { javascriptGenerator } from 'blockly/javascript'
import Highlightjs from 'highlight.js'
import { onMounted, ref } from 'vue'

import { useStore } from '../store/store'

const defaultContext = '未检测到积木块'
const code = ref(defaultContext)
const store = useStore()

onMounted(() => {
  store.workspaceSvg.addChangeListener(() => {
    code.value = javascriptGenerator.workspaceToCode(store.workspaceSvg) || defaultContext
  })
})

function handleCloseClick() {
  store.hasLayoutSider = false
}
</script>

<style lang="less">
@font-face {
  font-family: JetBrainsMono;
  font-display: swap;
  src: url('../assets/mono.ttf');
}

#app > section {
  @media screen {
    @media (max-width: 768px) {
      > div {
        min-width: 100vw;
        max-width: 100%;
        padding: 0;

        > div.arco-resizebox-trigger-vertical > div {
          display: none;
        }
      }
    }

    @media (min-width: 768px) {
      > div {
        min-width: 25%;
        max-width: 60%;
      }
    }
  }

  > div > div > div {
    height: 100%;

    > div.arco-scrollbar-container {
      padding: 1em;
      height: calc(100% - 2em);
    }

    > div.arco-scrollbar-track > div > div {
      background: var(--color-fill-4) !important;
    }
  }
}

#codespace {
  > div {
    > svg {
      position: fixed;
      top: 12px;
      right: 12px;

      width: 36px;
      height: 36px;

      color: var(--color-text-3);
    }

    > pre {
      margin: 0;

      > code {
        user-select: text;

        overflow: inherit;

        padding: 0;

        font-family: JetBrainsMono, sans-serif;
        font-size: 15px;
        line-height: 1.414;

        background: transparent;
      }
    }
  }

  @media screen {
    @media (max-width: 768px) {
      > div:nth-child(1) {
        display: block;
        height: 60px;
      }
    }

    @media (min-width: 768px) {
      > div:nth-child(1) {
        display: none;
      }
    }
  }

  > div:nth-child(2) {
    width: 100%;
  }
}
</style>
