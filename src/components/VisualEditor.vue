<template>
  <div class="visual-editor">
    <!-- 编辑头 -->
    <div class="editor-header">
      <h3>可视化编辑器</h3>
      <div class="editor-actions">
        <a-button @click="generateCode">生成代码</a-button>
        <a-button danger @click="clearAllComponents">清空</a-button>
        <a-button type="primary" @click="addDefaultComponents">添加示例组件</a-button>
      </div>
    </div>

    <!-- 主内容区域 - 左右布局 -->
    <div class="main-content">
      <!-- 编辑画布 -->
      <div class="editor-canvas">
        <!-- 组件列表 -->
        <div class="components-list-container" @dragover="handleDragOver" @drop="handleDrop">
          <div class="components-list-header">
            <h4>组件列表</h4>
          </div>
          <div class="components-list">
            <!-- 递归渲染组件树 -->
            <render-component-tree :components="components" :selected-component-id="selectedComponentId"
              @select-component="selectComponent" />
          </div>
          <div class="components-list-footer">
            <a-button type="dashed" block @click="addDefaultComponents">
              <a-icon type="plus" /> 添加示例组件
            </a-button>
          </div>
        </div>
      </div>

      <!-- 属性编辑面板 -->
      <div class="properties-panel">
        <h4>属性编辑</h4>
        <div v-if="selectedComponent" class="properties-content">
          <!-- 组件类型显示 -->
          <div class="component-type">
            <span>组件类型: {{ selectedComponent.type }}</span>
          </div>

          <!-- ID -->
          <div class="property-group">
            <label>ID</label>
            <a-input v-model:value="selectedComponent.props.id" @input="updateComponent" />
          </div>

          <!-- 类名 -->
          <div class="property-group">
            <label>类名</label>
            <a-input v-model:value="selectedComponent.props.class" @input="updateComponent" />
          </div>

          <!-- 文本内容 -->
          <div class="property-group">
            <label>文本内容</label>
            <a-input v-model:value="selectedComponent.props.text" @input="updateComponent" />
          </div>

          <!-- 占位符文本 -->
          <div class="property-group">
            <label>占位符文本</label>
            <a-input v-model:value="selectedComponent.props.placeholder" @input="updateComponent" />
          </div>

          <!-- 图片路径 -->
          <div class="property-group">
            <label>图片路径</label>
            <a-input v-model:value="selectedComponent.props.src" @input="updateComponent" placeholder="图片URL或本地路径" />
          </div>

          <!-- 位置X -->
          <div class="property-group">
            <label>位置X</label>
            <a-input-number v-model:value="selectedComponent.style.left" @input="updateComponent" :min="0"
              style="width: 100%" />
          </div>

          <!-- 位置Y -->
          <div class="property-group">
            <label>位置Y</label>
            <a-input-number v-model:value="selectedComponent.style.top" @input="updateComponent" :min="0"
              style="width: 100%" />
          </div>

          <!-- 宽度 -->
          <div class="property-group">
            <label>宽度</label>
            <a-input-number v-model:value="selectedComponent.style.width" @input="updateComponent" :min="1"
              style="width: 100%" />
          </div>

          <!-- 高度 -->
          <div class="property-group">
            <label>高度</label>
            <a-input-number v-model:value="selectedComponent.style.height" @input="updateComponent" :min="1"
              style="width: 100%" />
          </div>

          <!-- 删除按钮 -->
          <div class="property-actions">
            <a-button danger @click="deleteComponent">删除组件</a-button>
          </div>
        </div>
        <div v-else class="no-selection">
          <p>请选择一个组件进行编辑</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, h, onMounted, onUnmounted, ref, render, watch } from 'vue'
import { useProjectStore } from '../store/project'
import { useStore } from '../store/store'

// 为了解决递归组件引用问题，我们需要先定义组件，然后再进行递归引用
// 这里使用一个简单的方法：在模板中直接使用函数渲染子组件，避免递归组件定义

// 获取组件渲染函数
const renderComponent = (component) => {
  // 构建属性
  const props = getComponentProps(component)
  // 移除不必要的日志输出
  // 构建样式
  const style = getComponentStyles(component)
  // 添加事件处理
  const on = {
    click: (event) => {
      event.stopPropagation()
      selectComponent(component.id)
    },
    mousedown: (event) => {
      startDragComponent(event, component.id)
    }
  }

  // 创建子元素列表
  let children = []
  if (component.children && component.children.length > 0) {
    children = component.children.map(child => renderComponent(child))
  }

  // 将props直接展开为组件属性，而不是嵌套在props对象中
  // 合并props、style、on和class到一个属性对象中
  const componentProps = {
    ...props,
    style,
    class: ['draggable-component', { 'selected': selectedComponentId.value === component.id }],
    ...on
  }

  return h(component.type, componentProps, children)
}

const projectStore = useProjectStore()
const store = useStore()

// 组件状态
const components = ref([])
const selectedComponentId = ref(null)
const deviceType = ref('miBand10')
const currentTime = ref('')
const isDraggingComponent = ref(false)
const dragOffsetX = ref(0)
const dragOffsetY = ref(0)
const currentDragComponentId = ref(null)

// 组件渲染监听器
let componentsWatcher = null
let timeInterval = null

// 计算属性：选中的组件
const selectedComponent = computed(() => {
  if (!selectedComponentId.value) return null
  return findComponentById(components.value, selectedComponentId.value)
})

// 初始化时间显示
const updateTime = () => {
  const now = new Date()
  currentTime.value = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
}

// 查找指定ID的组件（递归）
const findComponentById = (componentList, id) => {
  for (const component of componentList) {
    if (component.id === id) {
      return component
    }
    if (component.children && component.children.length > 0) {
      const found = findComponentById(component.children, id)
      if (found) {
        return found
      }
    }
  }
  return null
}

// 获取组件属性
const getComponentProps = (component) => {
  const props = { ...component.props }
  // 移除不应该直接传递的属性
  delete props.style
  return props
}

// 获取组件样式
const getComponentStyles = (component) => {
  return {
    ...component.style,
    position: 'absolute',
    boxSizing: 'border-box'
  }
}


// 处理拖拽悬停
const handleDragOver = (event) => {
  event.preventDefault()
  event.dataTransfer.dropEffect = 'copy'
}

// 处理放置
const handleDrop = (event) => {
  event.preventDefault()

  // 获取拖拽的数据
  const data = event.dataTransfer.getData('application/vue-component')
  if (!data) return

  try {
    const componentData = JSON.parse(data)

    // 创建新组件，使用固定位置
    const newComponent = {
      id: `component_${Date.now()}`,
      type: componentData.type,
      props: { ...componentData.defaultProps },
      style: {
        left: 50, // 固定默认位置
        top: 50, // 固定默认位置
        width: 100,
        height: 40,
        backgroundColor: 'transparent',
        border: '1px dashed #ccc'
      },
      children: []
    }

    // 添加到组件列表
    components.value.push(newComponent)

    // 选中新添加的组件
    selectedComponentId.value = newComponent.id

    // 自动生成代码
    generateCode()

    // 更新projectStore中的组件数据，确保组件列表正确显示
    projectStore.updateComponentsData(components.value)

  } catch (error) {
    console.error('处理拖拽组件时出错:', error)
  }
}

// 选择组件
const selectComponent = (id) => {
  selectedComponentId.value = id
}

// 开始拖拽组件
const startDragComponent = (event, id) => {
  if (selectedComponentId.value !== id) {
    selectedComponentId.value = id
    return
  }

  isDraggingComponent.value = true
  currentDragComponentId.value = id

  // 计算鼠标偏移量
  const component = selectedComponent.value
  dragOffsetX.value = event.clientX - component.style.left
  dragOffsetY.value = event.clientY - component.style.top

  // 添加全局鼠标事件监听
  document.addEventListener('mousemove', handleDragMove)
  document.addEventListener('mouseup', handleDragEnd)

  // 阻止默认行为
  event.preventDefault()
}

// 处理拖拽移动
const handleDragMove = (event) => {
  if (!isDraggingComponent.value || !currentDragComponentId.value) return

  const component = selectedComponent.value
  if (!component) return

  // 使用简单的位置计算，不再依赖编辑区域
  const newX = Math.max(0, event.clientX - dragOffsetX.value - 100) // 减去一些偏移量
  const newY = Math.max(0, event.clientY - dragOffsetY.value - 100) // 减去一些偏移量

  // 更新位置
  component.style.left = newX
  component.style.top = newY

  // 更新界面代码
  generateCode()
}

// 结束拖拽
const handleDragEnd = () => {
  isDraggingComponent.value = false
  currentDragComponentId.value = null

  // 移除全局事件监听
  document.removeEventListener('mousemove', handleDragMove)
  document.removeEventListener('mouseup', handleDragEnd)
}

// 更新组件属性
const updateComponent = () => {
  // 确保组件数据被正确更新后再生成代码
  // 由于Vue的响应式系统，我们需要确保嵌套属性的更新能被正确检测到

  // 触发组件列表的响应式更新
  // 这是一个Vue 3响应式系统的技巧，确保嵌套属性的变化被检测到
  components.value = JSON.parse(JSON.stringify(components.value))

  // 生成新的代码
  generateCode()

  // 保存更新后的状态
  saveInterfaceState()
}

// 删除组件
const deleteComponent = () => {
  if (!selectedComponentId.value) return

  // 从组件列表中移除
  components.value = components.value.filter(c => c.id !== selectedComponentId.value)

  // 递归检查子组件
  for (const component of components.value) {
    if (component.children) {
      component.children = component.children.filter(c => c.id !== selectedComponentId.value)
    }
  }

  // 清除选中状态
  selectedComponentId.value = null

  // 生成新的代码
  generateCode()
}

// 清空所有组件
const clearAllComponents = () => {
  components.value = []
  selectedComponentId.value = null
  generateCode()
}

// 生成界面代码
const generateCode = () => {
  try {
    const htmlCode = generateHTML(components.value)
    projectStore.interfaceCode = htmlCode

    // 保存界面内容状态
    saveInterfaceState()
  } catch (error) {
    console.error('生成界面代码时出错:', error)
  }
}

// 保存界面内容状态
const saveInterfaceState = () => {
  try {
    // 使用深拷贝确保所有嵌套的组件数据都被正确保存
    const interfaceState = {
      components: JSON.parse(JSON.stringify(components.value)), // 保存所有组件数据
      selectedComponentId: selectedComponentId.value,
      deviceType: deviceType.value
    }
    store.saveInterfaceContent(interfaceState)
  } catch (error) {
    console.error('保存界面状态时出错:', error)
  }
}

// 恢复界面内容状态
const restoreInterfaceState = () => {
  try {
    const savedState = store.getInterfaceContent()
    if (savedState && savedState.components) {
      components.value = savedState.components
      if (savedState.selectedComponentId) {
        selectedComponentId.value = savedState.selectedComponentId
      }
      if (savedState.deviceType) {
        deviceType.value = savedState.deviceType
      }
    }
  } catch (error) {
    console.error('恢复界面状态时出错:', error)
  }
}

// 生成HTML代码（递归）
const generateHTML = (componentList) => {
  let html = ''

  for (const component of componentList) {
    // 构建属性字符串
    const props = []
    for (const [key, value] of Object.entries(component.props)) {
      if (key !== 'style' && value !== undefined && value !== '') {
        props.push(`${key}="${value}"`)
      }
    }

    // 构建样式字符串
    const styles = []
    for (const [key, value] of Object.entries(component.style)) {
      if (value !== undefined && value !== '') {
        styles.push(`${key}: ${typeof value === 'number' ? value + 'px' : value}`)
      }
    }

    if (styles.length > 0) {
      props.push(`style="${styles.join('; ')}"`)
    }

    // 构建标签
    const propsStr = props.length > 0 ? ' ' + props.join(' ') : ''

    // 获取组件内容
    let componentContent = ''

    // 优先使用用户输入的text属性
    if (component.props.text) {
      componentContent = component.props.text
    }
    // 如果没有用户输入的text属性，再根据组件类型和class设置默认内容
    else if (component.props.class === 'welcome-text') {
      componentContent = '欢迎使用'
    } else if (component.props.class === 'description-text') {
      componentContent = '拖放组件到此处\n创建你的界面'
    } else if (component.props.class === 'sample-button') {
      componentContent = '点击按钮'
    }

    // 根据组件类型生成不同的标签
    if (component.type === 'text' || component.type === 'div' || component.type === 'p' || component.type === 'span') {
      // 文本容器组件处理
      html += `  <${component.type}${propsStr}>
    ${componentContent}
  </${component.type}>`
    } else if (component.type === 'button') {
      // 按钮组件处理
      html += `  <${component.type}${propsStr}>
    ${componentContent}
  </${component.type}>`
    } else if (component.type === 'img') {
      // 图片组件处理
      html += `  <${component.type}${propsStr}>`
    } else {
      // 其他组件处理
      html += `  <${component.type}${propsStr}>`

      // 如果有子组件，递归生成
      if (component.children && component.children.length > 0) {
        html += '\n' + generateHTML(component.children).split('\n').map(line => '    ' + line).join('\n')
      }

      // 结束标签
      html += `</${component.type}>`
    }

    // 添加换行
    if (componentList.indexOf(component) < componentList.length - 1) {
      html += '\n'
    }
  }

  return html
}

// 获取组件预览HTML
const getComponentPreviewHTML = (component) => {
  // 根据组件类型返回不同的预览图标
  switch (component.type) {
    case 'text':
    case 'p':
    case 'span':
      return '<div style="font-size: 12px; color: var(--color-text-2)">T</div>'
    case 'div':
      return '<div style="width: 20px; height: 10px; background: var(--color-border);"></div>'
    case 'button':
      return '<div style="padding: 2px 8px; background: var(--color-primary-5); color: white; font-size: 10px; border-radius: 2px;">Btn</div>'
    case 'img':
      return component.props.src ?
        `<img src="${component.props.src}" alt="Preview" style="max-width: 100%; max-height: 100%;">` :
        '<div style="font-size: 12px; color: var(--color-text-3);">📷</div>'
    default:
      return `<div style="font-size: 12px; color: var(--color-text-2)">${component.type.charAt(0).toUpperCase()}</div>`
  }
}

// 定义递归渲染组件树的组件
const RenderComponentTree = {
  name: 'render-component-tree',
  props: {
    components: {
      type: Array,
      required: true
    },
    selectedComponentId: {
      type: String,
      default: null
    },
    level: {
      type: Number,
      default: 0
    }
  },
  emits: ['select-component'],
  template: `
    <div class="component-tree-level" :style="{ marginLeft: level * 20 + 'px' }">
      <div v-for="component in components" :key="component.id" class="component-tree-item">
        <!-- 组件项 -->
        <div 
          class="component-item"
          :class="{ 'selected': selectedComponentId === component.id }"
          @click="handleComponentClick(component.id)"
        >
          <div class="component-info">
            <div class="component-type-name">
              {{ component.type }}
              <span v-if="component.children && component.children.length > 0" class="children-count">
                ({{ component.children.length }})
              </span>
            </div>
            <div class="component-id">{{ component.id }}</div>
          </div>
          <div class="component-preview" v-html="getComponentPreviewHTML(component)"></div>
        </div>
        
        <!-- 递归渲染子组件 -->
        <div v-if="component.children && component.children.length > 0" class="children-container">
          <render-component-tree 
            :components="component.children"
            :selected-component-id="selectedComponentId"
            @select-component="handleChildSelect"
            :level="level + 1"
          ></render-component-tree>
        </div>
      </div>
    </div>
  `,
  methods: {
    getComponentPreviewHTML,
    handleComponentClick(id) {
      this.$emit('select-component', id)
    },
    handleChildSelect(id) {
      this.$emit('select-component', id)
    }
  }
}

// 添加默认组件示例
const addDefaultComponents = () => {
  // 只在组件列表为空时添加默认组件
  if (components.value.length === 0) {
    components.value = [
      {
        id: `component_container_${Date.now()}`,
        type: 'div',
        props: {
          class: 'container'
        },
        style: {
          left: 40,
          top: 100,
          width: 180,
          height: 300,
          backgroundColor: 'rgba(24, 144, 255, 0.1)',
          border: '1px solid #1890ff',
          borderRadius: '8px',
          padding: '10px'
        },
        children: [
          {
            id: `component_title_${Date.now()}`,
            type: 'div',
            props: {
              class: 'title'
            },
            style: {
              left: 10,
              top: 10,
              width: 160,
              height: 30,
              backgroundColor: 'transparent',
              border: 'none',
              textAlign: 'center',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#333'
            },
            children: []
          },
          {
            id: `component_content_${Date.now()}`,
            type: 'div',
            props: {
              class: 'content'
            },
            style: {
              left: 10,
              top: 50,
              width: 160,
              height: 100,
              backgroundColor: 'transparent',
              border: '1px dashed #ccc',
              borderRadius: '4px',
              padding: '8px'
            },
            children: [
              {
                id: `component_text_${Date.now()}`,
                type: 'div',
                props: {
                  class: 'text'
                },
                style: {
                  left: 8,
                  top: 8,
                  width: 144,
                  height: 20,
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontSize: '12px',
                  color: '#666'
                },
                children: []
              }
            ]
          },
          {
            id: `component_button_${Date.now()}`,
            type: 'button',
            props: {
              class: 'action-button'
            },
            style: {
              left: 50,
              top: 170,
              width: 80,
              height: 32,
              backgroundColor: '#1890ff',
              border: 'none',
              borderRadius: '16px',
              color: 'white',
              fontSize: '12px',
              cursor: 'pointer'
            },
            children: []
          }
        ]
      },
      {
        id: `component_standalone_${Date.now()}`,
        type: 'div',
        props: {
          class: 'standalone'
        },
        style: {
          left: 40,
          top: 420,
          width: 180,
          height: 40,
          backgroundColor: 'transparent',
          border: '1px solid #ccc',
          textAlign: 'center',
          fontSize: '14px',
          color: '#666',
          lineHeight: '40px'
        },
        children: []
      }
    ]

    // 生成默认组件的HTML代码
    generateCode()
  }
}

// 生命周期
onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 60000) // 每分钟更新一次时间

  // 尝试恢复保存的界面状态
  restoreInterfaceState()

  // 如果没有恢复到任何状态，添加默认组件
  if (components.value.length === 0) {
    addDefaultComponents()
  }
})

onUnmounted(() => {
  clearInterval(timeInterval)

  // 确保移除所有事件监听器
  document.removeEventListener('mousemove', handleDragMove)
  document.removeEventListener('mouseup', handleDragEnd)
})

// 暴露方法给父组件
defineExpose({
  generateCode
})
</script>

<style lang="less">
.visual-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--color-bg-1);
  overflow: hidden;

  .editor-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    background: var(--color-bg-2);
    border-bottom: 1px solid var(--color-border);

    h3 {
      margin: 0;
      color: var(--color-text-1);
      font-size: 16px;
    }

    .editor-actions {
      display: flex;
      gap: 12px;
    }
  }

  /* 主内容区域 - 左右布局 */
  .main-content {
    display: flex;
    flex: 1;
    overflow: hidden;

    .editor-canvas {
      flex: 1;
      display: flex;
      gap: 20px;
      padding: 20px;
      overflow: auto;
      background: var(--color-bg-3);
      height: calc(100% - 100px);

      .components-list-container {
        flex: 1;
        min-width: 300px;
        height: 100%;
        background: var(--color-bg-2);
        border-radius: 8px;
        border: 1px solid var(--color-border);
        display: flex;
        flex-direction: column;
        overflow: hidden;

        .components-list-header {
          padding: 16px;
          border-bottom: 1px solid var(--color-border);
          display: flex;
          justify-content: space-between;
          align-items: center;

          h4 {
            margin: 0;
            color: var(--color-text-1);
            font-size: 14px;
          }

          .components-count {
            color: var(--color-text-3);
            font-size: 12px;
          }
        }

        .components-list {
          flex: 1;
          overflow-y: auto;
          padding: 16px;

          .component-tree-level {
            margin-bottom: 8px;
          }

          .component-tree-item {
            margin-bottom: 8px;
          }

          .component-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 12px;
            background: var(--color-bg-1);
            border: 1px solid var(--color-border);
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.3s;

            &:hover {
              border-color: var(--color-primary);
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }

            &.selected {
              border-color: var(--color-primary);
              background: rgba(24, 144, 255, 0.05);
            }

            .component-info {
              flex: 1;
            }

            .component-type-name {
              font-size: 12px;
              color: var(--color-text-1);
              font-weight: 500;
              margin-bottom: 2px;

              .children-count {
                color: var(--color-text-3);
                font-size: 11px;
                margin-left: 4px;
              }
            }

            .component-id {
              font-size: 10px;
              color: var(--color-text-4);
            }

            .component-preview {
              width: 30px;
              height: 20px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }

          .children-container {
            margin-top: 4px;
          }
        }

        .components-list-footer {
          padding: 16px;
          border-top: 1px solid var(--color-border);
        }
      }
    }

    /* 属性编辑面板 - 左右布局 */
    .properties-panel {
      width: 300px;
      background: var(--color-bg-2);
      border-left: 1px solid var(--color-border);
      padding: 20px;
      overflow-y: auto;
      height: 100%;

      h4 {
        margin: 0;
        padding: 16px;
        border-bottom: 1px solid var(--color-border);
        color: var(--color-text-1);
        font-size: 14px;
      }

      .properties-content {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
      }

      .no-selection {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-text-3);
        font-size: 12px;
      }

      .component-type {
        margin-bottom: 16px;
        padding: 8px 12px;
        background: rgba(24, 144, 255, 0.05);
        border: 1px solid rgba(24, 144, 255, 0.2);
        border-radius: 4px;
        font-size: 12px;
        color: var(--color-primary);
      }

      .property-group {
        margin-bottom: 16px;

        label {
          display: block;
          margin-bottom: 4px;
          font-size: 12px;
          color: var(--color-text-2);
        }
      }

      .property-actions {
        margin-top: 20px;
      }
    }
  }
}

/* 拖拽组件样式 */
.draggable-component {
  position: absolute;
  box-sizing: border-box;
  cursor: move;
  user-select: none;
  transition: all 0.3s;

  &.selected {
    box-shadow: 0 0 0 2px var(--color-primary) !important;
    z-index: 1000;
  }
}
</style>