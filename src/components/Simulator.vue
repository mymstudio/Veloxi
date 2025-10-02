<template>
  <div class="simulator-wrapper">
    <div class="simulator-header">
      <h3>应用模拟器</h3>
      <div class="simulator-actions">
        <a-select defaultValue="小米手环10" v-model:value="deviceType" @change="updatePreview">
          
          <a-option value="miBand10">小米手环10</a-option>
          <a-option value="miBand9Pro">小米手环9Pro</a-option>
        </a-select>
        <a-button type="primary" @click="updatePreview">
          刷新预览
        </a-button>
      </div>
    </div>

    <div class="simulator-content">
      <div class="device-frame" :class="deviceType">
        <!-- 小米手环实机图容器 -->
        <div v-if="deviceType === 'miBand10' || deviceType === 'miBand9Pro'" class="device-image-container">
          <img 
            :src="deviceType === 'miBand10' ? XiaomiBand10 : XiaomiBand9Pro" 
            alt="小米手环" 
            class="device-image"
          >
        </div>
        
        <!-- 预览容器 -->
        <div class="preview-container" :class="deviceType">
          <a-scrollbar style="height: 100%;">
            <div v-if="loading" class="loading-state">
              <IconLoading class="loading-icon" />
              <span>加载中...</span>
            </div>
            <div v-else class="preview-content" :class="deviceType" ref="previewContainerRef" v-html="previewContent" @click="handlePreviewClick"></div>
          </a-scrollbar>
        </div>
      </div>

      <div class="console-panel" :style="{ height: consoleHeight + 'px' }">
        <!-- 拖拽句柄 -->
        <div 
          class="console-resizer" 
          @mousedown="startResize"
          :style="{ cursor: isResizing ? 'ns-resize' : 'grab' }"
        ></div>
        
        <div class="console-header">
          <span>控制台</span>
        </div>
        <a-scrollbar style="height: 100%;">
          <div class="console-output">
            <div v-for="(log, index) in consoleLogs" :key="index" :class="`log-item ${log.type}`">
              <span class="log-time">{{ log.time }}</span>
              <span class="log-content">{{ log.message }}</span>
            </div>
          </div>
        </a-scrollbar>
      </div>
    </div>
  </div>
</template>

<script setup>
import { IconLoading } from '@arco-design/web-vue/es/icon'
import { javascriptGenerator } from 'blockly/javascript'
import { computed, h, onMounted, onUnmounted, ref, render } from 'vue'

import XiaomiBand9Pro from '../assets/device/XiaomiBand9Pro.svg'
import XiaomiBand10 from '../assets/device/XiaomiBand10.svg'
import { useStore } from '../store/store'
import { useProjectStore } from '../store/project'

const store = useStore()
const projectStore = useProjectStore()

// 组件状态
const visible = ref(false)
const loading = ref(false)
const deviceType = ref('miBand10')
const previewContent = ref('')
const consoleLogs = ref([])
const currentTime = ref('')
const previewContainerRef = ref(null)

// 控制台拖拽相关状态
const consoleHeight = ref(200) // 默认高度
const isResizing = ref(false)
const startY = ref(0)
const startHeight = ref(0)

// 计算属性
const isOpen = computed(() => store.simulatorVisible || visible.value || store.hasSimulatorSider)

// 方法
const openSimulator = () => {
  visible.value = true
  store.$patch({ simulatorVisible: true })
  updatePreview()
}

const closeSimulator = () => {
  visible.value = false
  store.$patch({
    simulatorVisible: false,
    hasSimulatorSider: false
  })
}

// 开始拖拽调整控制台高度
const startResize = (e) => {
  e.preventDefault()
  isResizing.value = true
  startY.value = e.clientY
  startHeight.value = consoleHeight.value
  
  // 添加事件监听
  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
  
  // 防止鼠标离开窗口时无法停止拖拽
  document.addEventListener('mouseleave', stopResize)
}

// 拖拽过程中更新高度
const handleResize = (e) => {
  if (!isResizing.value) return
  
  const deltaY = e.clientY - startY.value
  const newHeight = Math.max(100, Math.min(500, startHeight.value - deltaY)) // 修改符号使拖拽方向符合直觉
  consoleHeight.value = newHeight
}

// 停止拖拽
const stopResize = () => {
  isResizing.value = false
  
  // 移除事件监听
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
  document.removeEventListener('mouseleave', stopResize)
}

// 确保模拟器在挂载时自动更新预览
onMounted(() => {
  // 如果组件被挂载到DOM中且应该显示，则更新预览
  if (isOpen.value) {
    logMessage('info', '组件已挂载且应该显示，准备更新预览')
    setTimeout(() => updatePreview("miBand10"), 100)
  } else {
    logMessage('info', '组件已挂载但当前不可见')
  }
  
  // 监听interfaceCode变化，实时更新预览
  const unwatch = projectStore.$subscribe((mutation, state) => {
    // 使用更可靠的方式检测interfaceCode变化
    if (mutation.type === 'patch object' || mutation.type === 'direct') {
      logMessage('info', '检测到interfaceCode变化，更新预览')
      updatePreview()
    }
  })
  
  onUnmounted(() => {
    unwatch()
  })
})

const updatePreview = (value) => {
  if (value) {
    deviceType.value = value
  }
  loading.value = true
  console.log(deviceType.value)
  try {
    // 从projectStore获取interfaceCode
    const interfaceCode = projectStore.interfaceCode
    
    if (interfaceCode) {
      logMessage('info', '已从projectStore获取interfaceCode')
      // 首先设置previewContent以确保内容可见
      previewContent.value = interfaceCode
      logMessage('info', '已设置previewContent用于v-html渲染')
      // 然后尝试使用Vue的h函数渲染界面
      renderInterfaceFromCode(interfaceCode)
    } else {
      logMessage('info', 'interfaceCode为空，尝试从工作区生成代码')
      // 备用方案：从工作区获取生成的代码
      const workspace = store.workspaceSvg
      if (workspace) {
        const code = javascriptGenerator.workspaceToCode(workspace)
        logMessage('info', '已从工作区生成代码')
        generatePreviewContentFromCode(code)
      } else {
        logMessage('warning', '无法获取工作区，加载示例内容')
        loadSamplePreviewContent() // 加载示例内容作为备用
      }
    }
  } catch (error) {
    logMessage('error', `生成预览内容时出错: ${error.message}`)
    // 记录错误堆栈以便调试
    logMessage('error', `错误堆栈: ${error.stack}`)
    loadSamplePreviewContent() // 加载示例内容作为备用
  } finally {
    loading.value = false
  }
}

// 使用Vue的h函数渲染interfaceCode内容
const renderInterfaceFromCode = (interfaceCode) => {
  if (!previewContainerRef.value) {
    logMessage('error', '预览容器引用未初始化')
    return
  }
  
  try {
    // 记录传入的interfaceCode内容（前100个字符）
    logMessage('info', `准备渲染的interfaceCode内容: ${interfaceCode.substring(0, 100)}...`)
    
    // 验证和清理interfaceCode
    const cleanedCode = validateAndCleanInterfaceCode(interfaceCode)
    
    // 创建一个临时容器来解析HTML
    const tempContainer = document.createElement('div')
    tempContainer.innerHTML = cleanedCode
    
    logMessage('info', `解析后的子节点数量: ${tempContainer.childNodes.length}`)
    
    // 使用Vue的h函数递归创建VNode
    const renderElement = (element) => {
      if (element.nodeType === 3) { // 文本节点
        return element.textContent
      } else if (element.nodeType === 1) { // 元素节点
        let tag = element.tagName.toLowerCase()
        const props = {} 
        const children = []
        
        // 记录处理的标签
        logMessage('info', `处理标签: ${tag}`)
        
        // 处理非标准HTML标签，转换为标准标签
        if (tag === 'text') {
          logMessage('info', '转换非标准标签 <text> 为 <span>')
          tag = 'span' // 将非标准的<text>标签转换为标准的<span>标签
        } else if (tag === 'image') {
          logMessage('info', '转换非标准标签 <image> 为 <img>')
          tag = 'img' // 将非标准的<image>标签转换为标准的<img>标签
        }
        
        // 处理属性
        for (const attr of element.attributes) {
          props[attr.name] = attr.value
        }
        
        // 处理点击事件
        if (tag === 'button' || element.classList.contains('sample-btn') || element.classList.contains('band-btn')) {
          props.onClick = (e) => {
            const buttonText = element.textContent.trim() || '按钮'
            logMessage('info', `点击了${buttonText}`)
            
            // 添加按钮点击效果
            element.style.transform = 'scale(0.95)'
            setTimeout(() => {
              element.style.transform = 'scale(1)'
            }, 150)
          }
        }
        
        // 处理子元素
        for (const child of element.childNodes) {
          const childVNode = renderElement(child)
          if (childVNode !== undefined) {
            children.push(childVNode)
          }
        }
        
        return h(tag, props, children)
      }
    }
    
    // 创建根元素的VNode
    const vnodes = []
    for (const child of tempContainer.childNodes) {
      const vnode = renderElement(child)
      if (vnode !== undefined) {
        vnodes.push(vnode)
      }
    }
    
    logMessage('info', `创建的VNode数量: ${vnodes.length}`)
    
    // 确保有根元素包裹内容
    let contentToRender
    if (vnodes.length === 1) {
      logMessage('info', '只有一个根节点，直接渲染')
      contentToRender = vnodes[0]
    } else if (vnodes.length > 1) {
      logMessage('info', `有${vnodes.length}个根节点，用div包裹`)
      // 如果有多个根节点，用一个div包裹
      contentToRender = h('div', null, vnodes)
    } else {
      logMessage('warning', '没有创建任何VNode，显示空内容')
      contentToRender = h('div', '界面内容为空')
    }
    
    // 渲染到预览容器
    render(contentToRender, previewContainerRef.value)
    logMessage('info', `已使用Vue h函数渲染${deviceType.value}设备的预览内容`)
  } catch (error) {
    logMessage('error', `使用h函数渲染界面时出错: ${error.message}`)
    // 记录错误堆栈以便调试
    logMessage('error', `错误堆栈: ${error.stack}`)
    // 渲染失败时显示原始内容
    previewContent.value = interfaceCode
    logMessage('info', '已回退到v-html渲染')
  }
}

const generatePreviewContentFromCode = (code) => {
  // 分析代码中的组件和功能
  const analysis = analyzeCode(code)

  // 根据分析结果生成预览内容
  const templates = {
    miBand10: generateMiBand10Template(code, analysis),
    miBand9Pro: generateMiBand9ProTemplate(code, analysis)
  }

  previewContent.value = templates[deviceType.value]
  logMessage('info', `已加载${deviceType.value}设备的预览内容`)
  logMessage('info', '预览基于工作区生成的代码')

  // 记录代码分析结果
  if (analysis.hasLists) {
    logMessage('info', '检测到列表操作')
  }
  if (analysis.hasLoops) {
    logMessage('info', '检测到循环逻辑')
  }
  if (analysis.hasFunctions) {
    logMessage('info', '检测到函数定义')
  }
}

const analyzeCode = (code) => {
  // 简单的代码分析，检测常见的 Xiaomi Vela JS 组件和功能
  const analysis = {
    hasLists: /\[\]|push|splice|indexOf/.test(code),
    hasLoops: /for|while|do.*while|forEach/.test(code),
    hasFunctions: /function|=>/.test(code),
    hasUIComponents: /Button|Text|Image|List|Card/.test(code),
    hasConditionals: /if|else|switch|case/.test(code),
    hasMathOperations: /\+|-|\*|\//.test(code),
    hasVariables: /let|const|var/.test(code)
  }

  return analysis
}

const loadSamplePreviewContent = () => {
  // 根据设备类型生成不同的示例预览内容
  const templates = {
    miBand10: generateMiBand10Template(),
    miBand9Pro: generateMiBand9ProTemplate()
  }

  previewContent.value = templates[deviceType.value]
  logMessage('info', `已加载${deviceType.value}设备的预览内容`)
}

const generateMiBand10Template = (code = '', analysis = {}) => `
  <div class="sample-app mi-band mi-band-10">
    <div class="band-screen">
      <div class="band-time">${currentTime.value}</div>
      <div class="band-content">
        <div class="band-card">
          <h3>手环应用</h3>
          <p>心率: 72 次/分</p>
          <p>步数: 3,452</p>
        </div>
        ${analysis.hasVariables ? `
        <div class="band-card">
          <h3>变量状态</h3>
          <p>数据已加载</p>
        </div>` : ''}
        ${analysis.hasFunctions ? `
        <div class="band-actions">
          <button class="band-btn">功能 1</button>
          <button class="band-btn">功能 2</button>
        </div>` : ''}
      </div>
    </div>
  </div>
`

const generateMiBand9ProTemplate = (code = '', analysis = {}) => `
  <div class="sample-app mi-band mi-band-9pro">
    <div class="band-screen">
      <div class="band-time">${currentTime.value}</div>
      <div class="band-content">
        <div class="band-card">
          <h3>健康数据</h3>
          <p>血氧: 98%</p>
          <p>睡眠: 7.5 小时</p>
          <p>压力值: 35</p>
          <p>心率变异性: 68ms</p>
        </div>
        ${analysis.hasVariables ? `
        <div class="band-card">
          <h3>变量状态</h3>
          <p>数据已加载</p>
        </div>` : ''}
        ${analysis.hasFunctions ? `
        <div class="band-actions">
          <button class="band-btn">功能 1</button>
          <button class="band-btn">功能 2</button>
        </div>` : ''}
      </div>
    </div>
  </div>
`

const logMessage = (type, message) => {
  const now = new Date()
  const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`

  consoleLogs.value.push({
    type,
    message,
    time: timeString
  })

  // 保持日志不超过100条
  if (consoleLogs.value.length > 100) {
    consoleLogs.value.shift()
  }
}

const handlePreviewClick = (event) => {
  // 处理预览区域的点击事件
  const target = event.target

  // 记录按钮点击
  if (target.tagName === 'BUTTON' || target.classList.contains('sample-btn')) {
    const buttonText = target.textContent.trim() || '按钮'
    logMessage('info', `点击了${buttonText}`)

    // 添加按钮点击效果
    target.style.transform = 'scale(0.95)'
    setTimeout(() => {
      target.style.transform = 'scale(1)'
    }, 150)
  }

  // 记录列表项点击
  if (target.closest('.list-item')) {
    const listItem = target.closest('.list-item')
    const itemText = listItem.textContent.trim()
    logMessage('info', `点击了列表项: ${itemText}`)
  }
}

const updateTime = () => {
  const now = new Date()
  currentTime.value = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
}

// 生命周期
onMounted(() => {
  updateTime()
  const timeInterval = setInterval(updateTime, 60000) /* 每分钟更新一次时间 */

  onUnmounted(() => {
    clearInterval(timeInterval)
  })
})

// 验证和清理interfaceCode，确保它是有效的HTML
const validateAndCleanInterfaceCode = (code) => {
  console.log('[Simulator] validateAndCleanInterfaceCode - 接收到的代码:', code)
  if (!code || typeof code !== 'string') {
    logMessage('error', '无效的interfaceCode: 空值或非字符串')
    return '<div>无效的界面代码</div>'
  }
  
  // 尝试修复常见的HTML问题
  let cleanedCode = code.trim()
  
  // 检查是否缺少根元素
  if (!cleanedCode.startsWith('<') || !cleanedCode.endsWith('>')) {
    logMessage('warning', 'interfaceCode缺少有效的HTML标签，用div包裹')
    cleanedCode = `<div>${cleanedCode}</div>`
  }
  
  // 检查是否有未闭合的标签（简单检查）
  const openTags = (cleanedCode.match(/<[^/][^>]*>/g) || []).length
  const closeTags = (cleanedCode.match(/<\/[^>]*>/g) || []).length
  
  if (openTags !== closeTags) {
    logMessage('warning', `发现标签不匹配: 开标签 ${openTags} 个, 闭标签 ${closeTags} 个`)
    
    // 尝试添加缺失的闭合标签
    const lastOpenTag = cleanedCode.match(/<([a-z][a-z0-9]*)([^>]*)>(?!<\/\1)/i)
    if (lastOpenTag) {
      const tagName = lastOpenTag[1]
      logMessage('info', `尝试添加缺失的闭合标签: </${tagName}>`)
      cleanedCode += `</${tagName}>`
    }
  }
  
  logMessage('info', 'interfaceCode验证和清理完成')
  console.log('[Simulator] validateAndCleanInterfaceCode - 清理后的代码:', cleanedCode)
  return cleanedCode
}

// 暴露给父组件的方法
defineExpose({
  open: openSimulator,
  close: closeSimulator,
  update: updatePreview
})
</script>

<style lang="less">
@font-face {
  font-family: JetBrainsMono;
  font-display: swap;
  src: url('../assets/mono.ttf');
}

#app>section {
  @media screen {
    @media (max-width: 768px) {
      >div {
        min-width: 100vw;
        max-width: 100%;
        padding: 0;

        >div.arco-resizebox-trigger-vertical>div {
          display: none;
        }
      }
    }

    @media (min-width: 768px) {
      >div {
        min-width: 25%;
        max-width: 60%;
      }
    }
  }

  >div>div>div {
    height: 100%;

    >div.arco-scrollbar-container {
      padding: 1em;
      height: calc(100% - 2em);
    }

    >div.arco-scrollbar-track>div>div {
      background: var(--color-fill-4) !important;
    }
  }
}

.simulator-wrapper {
  position: relative;
  height: 100%;
  background: var(--color-bg-2);
  display: flex;
  flex-direction: column;

  .simulator-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    background: var(--color-bg-1);
    border-bottom: 1px solid var(--color-border);
    position: sticky;
    top: 0;
    z-index: 10;

    h3 {
      margin: 0;
      color: var(--color-text-1);
    }

    .close-btn {
      color: var(--color-text-2);

      &:hover {
        color: var(--color-text-1);
        background: var(--color-bg-2);
      }
    }

    .simulator-actions {
      display: flex;
      gap: 12px;
      align-items: center;
    }
  }

  .simulator-content {
    flex: 1;
    display: flex;
    gap: 12px;
    padding: 1em;
    overflow: hidden;
    flex-direction: column;
    align-items: center;

    .device-frame {
        flex: none;
        background: transparent;
        border-radius: 16px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        position: relative;
        width: fit-content;
        
        // 小米手环10样式
        &.miBand10 {
          width: 100%;
          height: 100%;
          position: relative;
          flex: 1;
        }
        
        // 小米手环9 Pro样式
        &.miBand9Pro {
          width: 230px;
          height: 540px;
          position: relative;
        }

        // 小米手环实机图容器样式
        .device-image-container {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 0; // 设置为0，确保在预览容器下方显示
          pointer-events: none;
        }

        .device-image {
          max-width: 80%;
          max-height: 80%;
          object-fit: contain;
        }

        .device-status-bar {
          height: 24px;
          background: #000;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 12px;
          font-size: 12px;

          .status-icons {
            display: flex;
            gap: 4px;
          }
        }

        .preview-container {
          flex: 1;
          overflow: auto;
          position: relative;
          z-index: 1;
          
          // 小米手环设备的预览容器特殊样式 - 只使用绝对定位居中
          &.miBand10, &.miBand9Pro {
            background: transparent;
          }
          
          // 小米手环10预览容器样式
          &.miBand10 {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: transparent; // 修改为透明背景，让实机图能显示出来
            border-radius: 10000px;
            width: 110px;
            height: 260px;
            padding: 15px;
            overflow: hidden;
            z-index: 1; // 确保z-index一致
          }
          
          // 小米手环9 Pro预览容器样式
          &.miBand9Pro {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: transparent; // 修改为透明背景，让实机图能显示出来
            border-radius: 46px;
            width: 200px;
            height: 500px;
            padding: 12px;
            overflow: hidden;
            z-index: 1; // 确保z-index一致
          }

          .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: var(--color-text-3);

          .loading-icon {
            font-size: 48px;
            margin-bottom: 16px;
            animation: spin 1s linear infinite;
          }
        }

        // 预览内容区域样式 - 确保只有一个定义
        .preview-content {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;

          // 示例应用样式
          .sample-app {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            position: relative;
            overflow: hidden;
            
            // 小米手环样式
            &.mi-band {
              background: transparent;
              display: flex;
              align-items: center;
              justify-content: center;
              position: relative;
            }
            
            // 小米手环10特定样式 (保持兼容性)
            &.mi-band.mi-band-10 .band-screen {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              background: #fff;
              border-radius: 50px;
              width: 110px;
              height: 260px;
              padding: 15px;
              display: flex;
              flex-direction: column;
              overflow: hidden;
            }
            
            // 通用手环屏幕样式
            .band-screen {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              background: #fff;
              border-radius: 50px;
              padding: 15px;
              display: flex;
              flex-direction: column;
              overflow: hidden;
            }
            
            .band-time {
              text-align: center;
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 15px;
            }
            
            .band-content {
              flex: 1;
              overflow-y: auto;
              padding: 8px;
            }
            
            .band-card {
              background: #f0f0f0;
              border-radius: 12px;
              padding: 12px;
              margin-bottom: 12px;
            }
            
            .band-card h3 {
              margin: 0 0 8px 0;
              font-size: 16px;
              text-align: center;
            }
            
            .band-card p {
              margin: 4px 0;
              font-size: 14px;
              text-align: center;
            }
            
            .band-actions {
              display: flex;
              justify-content: space-around;
              margin-top: 15px;
            }
            
            .band-btn {
              padding: 8px 15px;
              background: var(--color-primary-5);
              color: white;
              border: none;
              border-radius: 6px;
              cursor: pointer;
              font-size: 14px;
            }
            
            .band-btn:hover {
              background: var(--color-primary-6);
            }

            .app-header {
              padding: 16px;
              background: var(--color-primary-5);
              color: white;

              h1 {
                margin: 0;
                font-size: 18px;
              }

              .header-actions {
                display: flex;
                gap: 8px;
                margin-top: 8px;
              }
            }

            .app-content {
              flex: 1;
              padding: 16px;
              overflow-y: auto;

              .card {
                background: white;
                padding: 16px;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                margin-bottom: 16px;

                h2 {
                  margin: 0 0 8px 0;
                  font-size: 16px;
                }

                p {
                  margin: 0 0 12px 0;
                  color: var(--color-text-3);
                }
              }

              .list-item {
                padding: 12px;
                border-bottom: 1px solid var(--color-border);

                &:last-child {
                  border-bottom: none;
                }
              }

              .grid-layout {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 16px;
              }

              .sidebar {
                width: 200px;
                background: var(--color-bg-2);
                padding: 16px 0;

                .sidebar-item {
                  padding: 12px 16px;
                  cursor: pointer;

                  &.active {
                    background: var(--color-primary-1);
                    color: var(--color-primary-6);
                  }

                  &:hover {
                    background: var(--color-bg-3);
                  }
                }
              }

              .main-content {
                flex: 1;
                padding: 16px;

                .chart-container {
                  margin-top: 16px;
                  height: 300px;
                  background: var(--color-bg-2);
                  border-radius: 8px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: var(--color-text-4);
                }
              }
            }

            .app-footer {
              display: flex;
              border-top: 1px solid var(--color-border);

              .nav-item {
                flex: 1;
                padding: 16px;
                text-align: center;
                cursor: pointer;

                &.active {
                  color: var(--color-primary-6);
                }
              }
            }
          }

          .sample-btn {
            padding: 6px 16px;
            background: var(--color-primary-5);
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;

            &:hover {
              background: var(--color-primary-6);
            }
          }
        }
      }
    }

    .console-panel {
      width: calc(100% - 3px);
      background: var(--color-bg-1);
      border-radius: 12px;
      border: 1px solid var(--color-border);
      display: flex;
      flex-direction: column;
  
      .console-resizer {
        height: 6px;
        background: var(--color-bg-2);
        cursor: grab;
        position: relative;
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
        border-bottom: 1px solid var(--color-border);
        
        &::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 2px;
          background: var(--color-border);
          border-radius: 1px;
        }
        
        &:active {
          cursor: grabbing;
        }
      }
  
      .console-header {
        padding: 12px 16px;
        border-bottom: 1px solid var(--color-border);
        font-weight: 500;
        color: var(--color-text-1);
      }

      .console-output {
        flex: 1;
        padding: 12px;
        overflow-y: auto;
        font-family: JetBrainsMono, monospace;
        font-size: 13px;
        height: calc(202px - 60px);

        .log-item {
          margin-bottom: 4px;
          display: flex;
          gap: 8px;

          .log-time {
            color: var(--color-text-4);
            min-width: 65px;
          }

          .log-content {
            flex: 1;
          }

          &.info {
            color: var(--color-text-2);
          }

          &.error {
            color: rgb(var(--danger-4));
          }

          &.warning {
            color: rgb(var(--warning-4));
          }
        }
      }
    }
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>