import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'

export const useStore = defineStore('main', () => {
  const workspaceSvg = shallowRef(null)
  const searchPlugin = shallowRef(null)

  const hasLayoutSider = ref(false)
  const hasSimulatorSider = ref(false)
  const searchVisible = ref(false)
  const simulatorVisible = ref(false)
  
  // 可视化设计器相关状态
  const designerVisible = ref(true)
  const componentsPanelVisible = ref(true)
  const propertiesPanelVisible = ref(true)
  const currentZoomLevel = ref(100)
  const selectedTool = ref('select') // select, move, resize
  
  // 界面内容状态
  const interfaceContent = ref({})
  
  // Blockly工作区状态
  const blocklyWorkspaceXml = ref('')

  // 切换设计器可见性
  const toggleDesigner = () => {
    designerVisible.value = !designerVisible.value
  }

  // 切换组件面板可见性
  const toggleComponentsPanel = () => {
    componentsPanelVisible.value = !componentsPanelVisible.value
  }

  // 切换属性面板可见性
  const togglePropertiesPanel = () => {
    propertiesPanelVisible.value = !propertiesPanelVisible.value
  }

  // 调整缩放级别
  const zoomIn = () => {
    currentZoomLevel.value = Math.min(200, currentZoomLevel.value + 10)
  }

  const zoomOut = () => {
    currentZoomLevel.value = Math.max(50, currentZoomLevel.value - 10)
  }

  const resetZoom = () => {
    currentZoomLevel.value = 100
  }

  // 保存界面内容状态
  const saveInterfaceContent = (content) => {
    // 使用深拷贝确保所有嵌套数据都被正确保存
    interfaceContent.value = JSON.parse(JSON.stringify(content))
  }

  // 获取界面内容状态
  const getInterfaceContent = () => {
    // 返回深拷贝的数据，避免引用问题
    return JSON.parse(JSON.stringify(interfaceContent.value))
  }

  // 保存Blockly工作区（带持久化存储）
  const saveBlocklyWorkspace = (xml) => {
    blocklyWorkspaceXml.value = xml
    // 保存到localStorage，确保页面刷新后数据不丢失
    try {
      localStorage.setItem('boxy_workspace_data', xml)
    } catch (e) {
      console.warn('Failed to save workspace to localStorage:', e)
    }
  }

  // 加载Blockly工作区（优先从localStorage加载）
  const loadBlocklyWorkspace = () => {
    // 首先尝试从localStorage加载
    try {
      const savedData = localStorage.getItem('boxy_workspace_data')
      console.log(savedData)
      if (savedData) {
        blocklyWorkspaceXml.value = savedData
        return savedData
      }
    } catch (e) {
      console.warn('Failed to load workspace from localStorage:', e)
    }
    // 如果localStorage没有数据，返回store中的数据
    return blocklyWorkspaceXml.value
  }

  return {
    workspaceSvg,
    searchPlugin,
    hasLayoutSider,
    searchVisible,
    simulatorVisible,
    hasSimulatorSider,
    designerVisible,
    componentsPanelVisible,
    propertiesPanelVisible,
    currentZoomLevel,
    selectedTool,
    interfaceContent,
    blocklyWorkspaceXml,
    toggleDesigner,
    toggleComponentsPanel,
    togglePropertiesPanel,
    zoomIn,
    zoomOut,
    resetZoom,
    saveInterfaceContent,
    getInterfaceContent,
    saveBlocklyWorkspace,
    loadBlocklyWorkspace
  }
})
