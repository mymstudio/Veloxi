<template>
  <a-trigger :trigger="['hover', 'click']" position="rt" v-model:popup-visible="visible">
    <div id="logo" @click="handleIconClick">
      <img alt="Logo" style="  transform: scale(0.95);" src="../assets/boxy.png" width="36" height="36" />
    </div>
    <template #content>
      <div class="navigatorMenu">
        <a-doption>新建</a-doption>
        <a-doption @click="handleSaveClick">保存到电脑</a-doption>
        <a-doption @click="handleOpenClick">打开本地文件</a-doption>
        <a-divider margin="1px" />
        <a-doption @click="handleSearchClick">查找</a-doption>
        <a-doption @click="handleSimulatorClick">应用模拟器</a-doption>
        <a-divider margin="1px" />
        <a-doption @click="handleOptionsClick">设置</a-doption>
        <a-doption @click="handleAboutClick">关于</a-doption>
      </div>
    </template>
  </a-trigger>
  <Settings ref="modal"></Settings>
  <About ref="aboutmodal"></About>
</template>

<script setup>
import Blockly from 'blockly'
import { ref } from 'vue'

import { useProjectStore } from '../store/project.js'
import { useStore } from '../store/store'
import About from './About.vue'
import Settings from './Settings.vue'

const visible = ref()
const modal = ref()
const aboutmodal = ref()
const store = useStore()
const projectStore = useProjectStore()

function handleIconClick() {
  Blockly.hideChaff()
}

function handleSaveClick() {
  try {
    // 获取工作区的JSON数据
    const workspaceJson = Blockly.serialization.workspaces.save(store.workspaceSvg)
    const workspaceText = JSON.stringify(workspaceJson, null, 2)

    // 添加工作区数据到项目文件
    projectStore.addProjectFile('workspace.boxy', workspaceText)

    // 尝试使用JSZip创建压缩包下载
    if (projectStore.isJszipAvailable) {
      // 使用新的压缩包下载功能
      projectStore.downloadProjectZip().catch(error => {
        console.warn('使用压缩包下载失败，回退到原始保存方式:', error)
        // 回退到原始的保存方式
        fallbackSave(workspaceText)
      })
    } else {
      // 如果JSZip不可用，使用原始的保存方式
      fallbackSave(workspaceText)
    }
  } catch (error) {
    console.error('保存失败:', error)
    Blockly.dialog.alert('保存失败，请稍后重试')
  } finally {
    visible.value = false
  }
}

// 原始保存方式的回退函数
function fallbackSave(workspaceText) {
  const blob = new Blob([workspaceText], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  // 使用项目名称作为文件名
  anchor.download = `${projectStore.projectData.name || 'project'}.boxy`
  anchor.click()

  // 清理URL对象
  setTimeout(() => {
    URL.revokeObjectURL(url)
  }, 100)
}

function handleOpenClick() {
  const input = document.createElement('input')
  input.setAttribute('type', 'file')
  input.setAttribute('name', 'file')
  input.setAttribute('visibility', 'hidden')
  input.setAttribute('accept', '.boxy,.zip')
  input.addEventListener('change', function () {
    const file = this.files[0]
    const reader = new FileReader()

    // 根据文件扩展名决定处理方式
    if (file.name.endsWith('.zip')) {
      if (!projectStore.isJszipAvailable) {
        Blockly.dialog.alert('打开ZIP文件需要JSZip库，请先安装依赖')
        return
      }

      // 显示加载中提示
      Blockly.dialog.setAlert('正在解压项目文件，请稍候...')

      reader.addEventListener('load', async function () {
        try {
          // 使用项目存储中的解压功能
          const result = await projectStore.extractProjectZip(this.result)

          // 尝试加载工作区文件
          const workspaceContent = projectStore.getWorkspaceFileContent()
          if (workspaceContent) {
            try {
              const workspaceJson = JSON.parse(workspaceContent)
              Blockly.serialization.workspaces.load(workspaceJson, store.workspaceSvg)
              Blockly.dialog.alert(`项目导入成功！共导入 ${result.fileCount} 个文件`)
            } catch (error) {
              console.error('加载工作区失败:', error)
              Blockly.dialog.alert('项目导入成功，但工作区文件格式无效')
            }
          } else {
            Blockly.dialog.alert(`项目导入成功，但未找到有效的工作区文件。共导入 ${result.fileCount} 个文件`)
          }
        } catch (error) {
          console.error('解压ZIP文件失败:', error)
          Blockly.dialog.alert(`解压项目文件失败: ${error.message}`)
        }
      })
      reader.readAsArrayBuffer(file)
    } else {
      // 处理普通的.boxy文件
      reader.addEventListener('load', function () {
        try {
          const json = JSON.parse(this.result)
          Blockly.serialization.workspaces.load(json, store.workspaceSvg)

          // 更新项目信息
          projectStore.setProjectData({
            name: file.name.replace('.boxy', '')
          })

          // 添加到项目文件
          projectStore.addProjectFile(file.name, this.result)

          Blockly.dialog.alert('项目导入成功')
        } catch (error) {
          console.error('打开文件失败:', error)
          Blockly.dialog.alert('文件格式无效，无法打开')
        }
      })
      reader.readAsText(file)
    }
  })
  input.click()
  visible.value = false
}

function handleSearchClick() {
  store.searchVisible = true
  visible.value = false
}

function handleOptionsClick() {
  modal.value.handleClick()
  visible.value = false
}

function handleAboutClick() {
  aboutmodal.value.handleClick()
  visible.value = false
}

function handleSimulatorClick() {
  store.simulatorVisible = true
  visible.value = false
}
</script>

<style>
#logo {
  position: absolute;
  z-index: 999;
  top: 0;
  left: 0;
  width: 36px;
  height: 36px;
  padding: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-bg-2);
}

.navigatorMenu {
  overflow: hidden;

  box-sizing: border-box;
  padding: 12px 16px;

  font-size: 14px;
  line-height: 1.5715;
  color: var(--color-text-2);

  background-color: var(--color-bg-popup);
  border: 1px solid var(--color-neutral-3);
  border-radius: var(--border-radius-medium);
  box-shadow: 0 -2px 5px rgb(0 0 0 / 10%);

  animation: show-dropdown cubic-bezier(0.3, 1.3, 0.3, 1) 400ms forwards !important;

  >li {
    -webkit-tap-highlight-color: transparent;
  }
}

@keyframes show-dropdown {
  0% {
    width: 0;
    height: 0;
  }

  100% {
    width: 150px;
    height: 284px;
  }
}
</style>
