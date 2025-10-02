import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProjectStore = defineStore('manifest', () => {
  const mainfestJson = ref('')
  const interfaceCode = ref('') 
  const projectName = ref('未命名项目')
  const lastModified = ref(new Date().toLocaleString())
  const deviceType = ref('miBand10')
  const componentsData = ref([])

  // 保存项目
  const saveProject = () => {
    try {
      const projectData = {
        name: projectName.value,
        lastModified: new Date().toLocaleString(),
        deviceType: deviceType.value,
        manifest: mainfestJson.value,
        interfaceCode: interfaceCode.value,
        components: componentsData.value
      }
      
      // 这里应该实现实际的保存逻辑
      // 目前只是打印到控制台
      console.log('项目保存数据:', projectData)
      
      // 更新最后修改时间
      lastModified.value = projectData.lastModified
      
      return true
    } catch (error) {
      console.error('保存项目失败:', error)
      return false
    }
  }

  // 加载项目
  const loadProject = (projectData) => {
    try {
      if (projectData) {
        projectName.value = projectData.name || '未命名项目'
        lastModified.value = projectData.lastModified || new Date().toLocaleString()
        deviceType.value = projectData.deviceType || 'miBand10'
        mainfestJson.value = projectData.manifest || ''
        interfaceCode.value = projectData.interfaceCode || ''
        componentsData.value = projectData.components || []
      }
      
      return true
    } catch (error) {
      console.error('加载项目失败:', error)
      return false
    }
  }

  // 清除项目数据
  const clearProject = () => {
    projectName.value = '未命名项目'
    lastModified.value = new Date().toLocaleString()
    mainfestJson.value = ''
    interfaceCode.value = ''
    componentsData.value = []
  }

  // 更新界面代码
  const updateInterfaceCode = (code) => {
    interfaceCode.value = code
    lastModified.value = new Date().toLocaleString()
  }

  // 更新组件数据
  const updateComponentsData = (components) => {
    componentsData.value = components
    lastModified.value = new Date().toLocaleString()
  }

  return {
    mainfestJson,
    interfaceCode,
    projectName,
    lastModified,
    deviceType,
    componentsData,
    saveProject,
    loadProject,
    clearProject,
    updateInterfaceCode,
    updateComponentsData
  }
})
