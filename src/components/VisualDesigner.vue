<template>
  <div class="visual-designer">
    <!-- 顶部工具栏 -->
    <div class="designer-toolbar">
      <div class="toolbar-left">
        <h2 class="designer-title">界面设计器</h2>
        <div class="device-selector">
          <a-select 
            v-model:value="currentDeviceType"
            @change="onDeviceChange"
            style="width: 120px"
          >
            <a-select-option value="miBand10">小米手环 10</a-select-option>
            <a-select-option value="miBand9">小米手环 9</a-select-option>
            <a-select-option value="miBand8">小米手环 8</a-select-option>
          </a-select>
        </div>
      </div>
      
      <div class="toolbar-right">
        <a-button @click="saveProject">保存项目</a-button>
        <a-button type="primary" @click="previewInterface">预览界面</a-button>
      </div>
    </div>
    
    <!-- 主内容区域 -->
    <div class="designer-content">
      <!-- 左侧组件库面板 -->
      <div class="components-panel">
        <ComponentPalette />
      </div>
      
      <!-- 中间设计区域 -->
      <div class="design-area">
        <VisualEditor 
          ref="visualEditorRef"
          :device-type="currentDeviceType"
        />
      </div>
    </div>
    
    <!-- 预览模态框 -->
    <a-modal
      v-model:visible="previewVisible"
      title="界面预览"
      width="300px"
      :footer="null"
    >
      <div class="preview-container" :class="`preview-${currentDeviceType}`">
        <div class="preview-content" v-html="previewHTML"></div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { Message } from '@arco-design/web-vue'
import { computed,ref } from 'vue'

import { useProjectStore } from '../store/project'
import ComponentPalette from './ComponentPalette.vue'
import VisualEditor from './VisualEditor.vue'

const projectStore = useProjectStore()
const visualEditorRef = ref(null)

// 状态
const currentDeviceType = ref('miBand10')
const previewVisible = ref(false)

// 计算属性：预览HTML
const previewHTML = computed(() => {
  return projectStore.interfaceCode || '<div style="text-align: center; padding: 20px; color: #999;">暂无内容</div>'
})

// 设备类型变更处理
const onDeviceChange = (deviceType) => {
  currentDeviceType.value = deviceType
  // 可以在这里添加设备类型切换后的逻辑
}

// 保存项目
const saveProject = () => {
  try {
    // 确保生成最新的界面代码
    if (visualEditorRef.value) {
      visualEditorRef.value.generateCode()
    }
    
    // 触发项目保存
    projectStore.saveProject()
    
    // 显示成功提示
    Message.success('项目保存成功')
    
  } catch (error) {
    console.error('保存项目失败:', error)
    Message.error('项目保存失败')
  }
}

// 预览界面
const previewInterface = () => {
  try {
    // 确保生成最新的界面代码
    if (visualEditorRef.value) {
      visualEditorRef.value.generateCode()
    }
    
    // 显示预览模态框
    previewVisible.value = true
    
  } catch (error) {
    console.error('预览界面失败:', error)
    Message.error('预览界面失败')
  }
}

// 消息提示功能已经通过import直接从ant-design-vue中导入
</script>

<style lang="less">
.visual-designer {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--color-bg-1);
  
  .designer-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    height: 60px;
    background: var(--color-bg-2);
    border-bottom: 1px solid var(--color-border);
    
    .toolbar-left {
      display: flex;
      align-items: center;
      gap: 24px;
      
      .designer-title {
        margin: 0;
        color: var(--color-text-1);
        font-size: 18px;
        font-weight: 500;
      }
      
      .device-selector {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }
    
    .toolbar-right {
      display: flex;
      gap: 12px;
    }
  }
  
  .designer-content {
    display: flex;
    flex: 1;
    overflow: hidden;
    
    .components-panel {
      width: 280px;
      background: var(--color-bg-2);
      border-right: 1px solid var(--color-border);
      overflow-y: auto;
    }
    
    .design-area {
      flex: 1;
      overflow: hidden;
    }
  }
  
  .preview-container {
    display: flex;
    justify-content: center;
    padding: 20px;
    
    &.preview-miBand10 {
      .preview-content {
        width: 212px;
        height: 520px;
        border-radius: 50px;
        background: #fff;
        overflow: hidden;
        position: relative;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        font-size: 14px;
        
        > * {
          position: absolute !important;
        }
      }
    }
    
    &.preview-miBand9 {
      .preview-content {
        width: 192px;
        height: 490px;
        border-radius: 45px;
        background: #fff;
        overflow: hidden;
        position: relative;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        font-size: 14px;
        
        > * {
          position: absolute !important;
        }
      }
    }
    
    &.preview-miBand8 {
      .preview-content {
        width: 180px;
        height: 450px;
        border-radius: 40px;
        background: #fff;
        overflow: hidden;
        position: relative;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        font-size: 14px;
        
        > * {
          position: absolute !important;
        }
      }
    }
  }
}
</style>