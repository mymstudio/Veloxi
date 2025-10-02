<template>
  <div class="component-palette">
    <h3>界面组件库</h3>
    <div class="component-categories">
      <div class="category">
        <h4>基础组件</h4>
        <div class="components-grid">
          <div 
            class="component-item"
            v-for="component in basicComponents"
            :key="component.type"
            :draggable="true"
            @dragstart="handleDragStart($event, component)"
          >
            <div class="component-icon">{{ component.icon }}</div>
            <div class="component-name">{{ component.name }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useProjectStore } from '../store/project'

const projectStore = useProjectStore()

// 基础组件列表
const basicComponents = ref([
  {
    type: 'div',
    name: '容器',
    icon: '📦',
    defaultProps: {
      id: '',
      class: '',
      style: {}
    }
  },
  {
    type: 'text',
    name: '文本',
    icon: '📝',
    defaultProps: {
      text: '这是一段文本',
      id: '',
      class: '',
      style: {}
    }
  },
  {
    type: 'image',
    name: '图片',
    icon: '🖼️',
    defaultProps: {
      src: 'veloxi.png',
      id: '',
      class: '',
      style: {}
    }
  },
  {
    type: 'button',
    name: '按钮',
    icon: '🔘',
    defaultProps: {
      text: '按钮',
      id: '',
      class: '',
      style: {}
    }
  },
  {
    type: 'input',
    name: '输入框',
    icon: '🔤',
    defaultProps: {
      placeholder: '请输入...',
      id: '',
      class: '',
      style: {}
    }
  },
  {
    type: 'checkbox',
    name: '复选框',
    icon: '☑️',
    defaultProps: {
      label: '复选框',
      checked: false,
      id: '',
      class: '',
      style: {}
    }
  },
  {
    type: 'radio',
    name: '单选框',
    icon: '🔘',
    defaultProps: {
      label: '单选框',
      checked: false,
      id: '',
      class: '',
      style: {}
    }
  },
  {
    type: 'list',
    name: '列表',
    icon: '📋',
    defaultProps: {
      items: ['列表项1', '列表项2'],
      id: '',
      class: '',
      style: {}
    }
  }
])

// 处理拖拽开始事件
const handleDragStart = (event, component) => {
  // 设置拖拽数据
  event.dataTransfer.setData('application/vue-component', JSON.stringify(component))
  event.dataTransfer.effectAllowed = 'copy'
  
  // 为了更好的拖拽体验，设置拖拽时的视觉反馈
  const dragImage = document.createElement('div')
  dragImage.textContent = component.name
  dragImage.style.position = 'absolute'
  dragImage.style.top = '-1000px'
  dragImage.style.backgroundColor = '#f0f0f0'
  dragImage.style.padding = '4px 8px'
  dragImage.style.borderRadius = '4px'
  document.body.appendChild(dragImage)
  event.dataTransfer.setDragImage(dragImage, 0, 0)
  
  // 拖拽结束后移除临时元素
  setTimeout(() => {
    document.body.removeChild(dragImage)
  }, 0)
}
</script>

<style lang="less">
.component-palette {
  padding: 16px;
  background: var(--color-bg-1);
  height: 100%;
  overflow-y: auto;
  border-right: 1px solid var(--color-border);
  
  h3 {
    margin: 0 0 16px 0;
    color: var(--color-text-1);
    font-size: 16px;
  }
  
  .category {
    margin-bottom: 24px;
    
    h4 {
      margin: 0 0 12px 0;
      color: var(--color-text-2);
      font-size: 14px;
      font-weight: normal;
    }
  }
  
  .components-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
  
  .component-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12px;
    background: var(--color-bg-2);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    cursor: grab;
    transition: all 0.2s ease;
    
    &:hover {
      background: var(--color-bg-3);
      border-color: var(--color-primary-5);
    }
    
    &:active {
      cursor: grabbing;
    }
  }
  
  .component-icon {
    font-size: 24px;
    margin-bottom: 4px;
  }
  
  .component-name {
    font-size: 12px;
    color: var(--color-text-2);
    text-align: center;
  }
}
</style>