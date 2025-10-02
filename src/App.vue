<template>
  <a-layout>
    <a-layout-sider ref="simulatorSider" :resize-directions="['left']" @moving="handleMoving"
      @moving-end="handleMoving">
      <Simulator />
    </a-layout-sider>
    <a-layout-content>

      <!-- 模式切换工具栏 -->
      <div class="mode-switch-toolbar">
        <Navigator />
        <a-menu mode="horizontal" :default-selected-keys="[designMode]" @menu-item-click="handleMenuSelect">
          <a-menu-item key="blocks">
            <template #icon>
              <icon-code-square />
            </template>
            逻辑
          </a-menu-item>
          <a-menu-item key="visual">
            <template #icon>
              <icon-layout />
            </template>
            界面
          </a-menu-item>
        </a-menu>


        <a-button-group style="transform: translateX(9px);">
          
          
        <a-button type="primary"  @click="handleDebugClick">
          <template #icon>
            <icon-bug />
          </template>
          调试
        </a-button>

          <a-button type="primary" >
            <template #icon>
              <icon-down />
            </template>
          </a-button>
        </a-button-group>

      </div>

      <!-- 积木模式内容 -->
      <div v-if="designMode === 'blocks'" class="mode-content">
        <Workspace />
        <Search />
        <Toolbox />
        <Zoombox />
      </div>

      <!-- 可视化设计模式内容 -->
      <div v-else-if="designMode === 'visual'" class="mode-content">
        <VisualDesigner />
      </div>
    </a-layout-content>
    <a-layout-sider ref="layoutSider" :resize-directions="['left']" @moving="handleMoving" @moving-end="handleMoving"
      style="display: none;">
      <Codespace />
    </a-layout-sider>
  </a-layout>

  <Trashcan />
  <Screenshot />
  <Dialog />
</template>

<script setup>
import './assets/categories'
import './blocks/boxy'
import './blocks/patch'
import './theme/codemao.theme'
import './theme/codemao.renderer'
import './generators/javascript'

import Blockly from 'blockly'
import { onMounted, ref, watch } from 'vue'

import Codespace from './components/Codespace.vue'
import Dialog from './components/Dialog.vue'
import Navigator from './components/Navigator.vue'
import Screenshot from './components/Screenshot.vue'
import Search from './components/Search.vue'
import Simulator from './components/Simulator.vue'
import Toolbox from './components/Toolbox.vue'
import Trashcan from './components/Trashcan.vue'
import VisualDesigner from './components/VisualDesigner.vue'
import Workspace from './components/Workspace.vue'
import Zoombox from './components/Zoombox.vue'
import { useStore } from './store/store'

let usedLayoutSider = void 0
let usedSimulatorSider = void 0
const layoutSider = ref()
const simulatorSider = ref()
const store = useStore()

// 设计模式状态：'blocks' 或 'visual'
const designMode = ref('blocks')

// 处理菜单选择事件
const handleMenuSelect = (selectedKeys) => {
  switchMode(selectedKeys)
}

// 切换设计模式
const switchMode = (mode) => {
  designMode.value = mode
  handleMoving() // 切换后重新调整布局
}

// 处理调试按钮点击事件
const handleDebugClick = () => {
  store.$patch((state) => {
    state.hasSimulatorSider = !state.hasSimulatorSider
  })
}

function handleMoving() {
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      Blockly.svgResize(store.workspaceSvg)
    }, 100 * i)
  }
}

function setLayoutSider(isOpen = false) {
  layoutSider.value.$el.style.display = isOpen ? 'block' : 'none'
  handleMoving()
}

function setSimulatorSider(isOpen = false) {
  simulatorSider.value.$el.style.display = isOpen ? 'block' : 'none'
  handleMoving()
}

onMounted(() => {
  watch(
    store.$state,
    (state) => {
      // 处理代码空间的显示/隐藏
      if (state.hasLayoutSider !== usedLayoutSider) {
        setLayoutSider(state.hasLayoutSider)
        usedLayoutSider = state.hasLayoutSider
      }

      // 处理模拟器的显示/隐藏
      if (state.hasSimulatorSider !== usedSimulatorSider) {
        setSimulatorSider(state.hasSimulatorSider)
        usedSimulatorSider = state.hasSimulatorSider
      }
    },
    { deep: true }
  )
  handleMoving()
  setLayoutSider()
  setSimulatorSider()
})
</script>

<style>
html,
body,
#app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: 'MiSans', sans-serif;
  background: var(--color-bg-1);
  border: 0;
}

@font-face {
  font-family: 'MiSans';
  src: url('../src/assets/MiSansVF.woff2');
}

::selection {
  background: #1ba2e333;
}

body::-webkit-scrollbar {
  display: none;
}

/* 确保a-layout占满整个屏幕 */
.arco-layout {
  width: 100%;
  height: 100%;
}

.arco-menu-horizontal .arco-menu-item .arco-menu-icon {
  margin-right: 8px;
}

.mode-switch-toolbar {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px 24px;
  background: var(--color-bg-2);
  border-bottom: 1.5px solid var(--color-border);
  position: relative;
}

/* 模式内容区域样式 */
.mode-content {
  width: 100%;
  height: calc(100% - 60px);
  overflow: hidden;
}

.blocklyMainBackground
 {
    stroke-width: 0;
    stroke: #c6c6c600;
}

/* 设置左右侧边栏的默认宽度和显示顺序 */
/* 使用order属性调整侧边栏的显示顺序，让Simulator组件显示在右侧 */
.arco-layout {
  display: flex;
}

.arco-layout-sider:nth-child(1) {
  order: 3;
  width: 500px;
  min-width: 300px;
  max-width: 800px;
}

.arco-layout-content {
  order: 2;
  flex: 1;
}

.arco-layout-sider:nth-child(3) {
  order: 1;
  width: 400px;
  min-width: 250px;
  max-width: 600px;
}

.arco-menu-horizontal .arco-menu-inner {
  display: flex;
  align-items: center;
  padding: 14px 20px;
  justify-content: center;
}

.arco-menu-overflow-wrap {
  width: 40%;
  display: flex;
  justify-content: center;
}
</style>
