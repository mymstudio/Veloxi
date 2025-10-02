<template>
  <div class="blocklyDiv" ref="blocklyDiv" style="height: 100%;"></div>
</template>

<script setup>
import '@blockly/block-plus-minus'

import { WorkspaceSearch } from '@blockly/plugin-workspace-search'
import Blockly from 'blockly'
import { onMounted, ref, onUnmounted } from 'vue'

import toolboxConfig from '../assets/toolbox.json'
import { block_style } from '../blocks/patch'
import * as zh from '../msg/zh.json'
import { useStore } from '../store/store'

Blockly.setLocale(zh)

Blockly.Scrollbar.scrollbarThickness = 15
Blockly.FlyoutButton.BORDER_RADIUS = 4
Blockly.FlyoutButton.TEXT_MARGIN_X = 10
Blockly.FlyoutButton.TEXT_MARGIN_Y = 10

block_style('lists_create_with', 'list')
block_style('procedures_defnoreturn', 'function')
block_style('procedures_defreturn', 'function')
block_style('procedures_ifreturn', 'function')
block_style('procedures_callnoreturn', 'function')
block_style('procedures_callreturn', 'function')

const blocklyDiv = ref()
const store = useStore()
const options = {
  toolbox: toolboxConfig,
  media: '/media',
  trashcan: false,
  zoom: {
    controls: true,
    wheel: true,
    startScale: 0.8,
    maxScale: 1.4,
    minScale: 0.5
  },
  move: {
    scrollbars: true,
    drag: true,
    wheel: true
  },
  theme: 'codemao',
  renderer: 'codemao'
}

let autoSaveInterval = null

// 保存工作区到状态管理和localStorage
function saveWorkspace() {
  try {
    if (store.workspaceSvg) {
      // 使用Blockly v10推荐的序列化API
      const workspaceJson = Blockly.serialization.workspaces.save(store.workspaceSvg);
      const workspaceText = JSON.stringify(workspaceJson);
      store.saveBlocklyWorkspace(workspaceText);
      console.log('逻辑代码已保存');
    }
  } catch (e) {
    console.error('Failed to save workspace:', e);
  }
}

onMounted(() => {
  store.$patch((state) => {
    state.workspaceSvg = Blockly.inject(blocklyDiv.value, options)
    state.searchPlugin = new WorkspaceSearch(store.workspaceSvg)
  })
  store.searchPlugin.setSearchPlaceholder('搜索作品中的积木')
  store.searchPlugin.init()
  
  // 加载已保存的工作区
  const savedData = store.loadBlocklyWorkspace()
  if (savedData) {
    try {
      console.log('Attempting to load saved workspace data:', typeof savedData, savedData.length, 'characters');
      // 检查savedData是否为非空字符串
      if (typeof savedData !== 'string' || savedData.trim() === '') {
        console.error('Invalid savedData: not a valid string');
      } else {
        // 检查workspaceSvg是否有效
        if (!store.workspaceSvg) {
          console.error('workspaceSvg is null or undefined');
        } else if (typeof store.workspaceSvg !== 'object') {
          console.error('workspaceSvg is not an object:', typeof store.workspaceSvg);
        } else {
          console.log('workspaceSvg is valid object');
          
          try {
            // 尝试使用新的序列化API加载工作区
            try {
              const workspaceJson = JSON.parse(savedData);
              Blockly.serialization.workspaces.load(workspaceJson, store.workspaceSvg);
              const blockCount = store.workspaceSvg.getAllBlocks().length;
              console.log(`Workspace loaded successfully using new serialization API, ${blockCount} blocks loaded`);
            } catch (jsonError) {
              console.warn('New serialization API failed, trying XML fallback:', jsonError.message);
              
              // 旧的XML格式后备方案 - 保留原始的XML清理和加载逻辑
              let cleanedXml = savedData.trim();
              // 1. 移除可能存在的反引号和代码块标记
              cleanedXml = cleanedXml.replace(/`/g, '').replace(/```[\s\S]*?```/g, '');
              // 2. 修复常见的属性格式问题
              cleanedXml = cleanedXml.replace(/([\w-]+)=\s*("')(.*?)\2/g, '$1=$2$3$2');
              // 3. 移除XML声明之前的所有内容
              const xmlStartIndex = cleanedXml.indexOf('<');
              if (xmlStartIndex > 0) {
                cleanedXml = cleanedXml.substring(xmlStartIndex);
              }
              
              // 再次尝试使用DOMParser解析
              const parser = new DOMParser();
              const xmlDoc = parser.parseFromString(cleanedXml, 'text/xml');
              
              // 检查解析结果
              const parserError = xmlDoc.querySelector('parsererror');
              if (parserError) {
                console.error('XML parsing error:', parserError.textContent);
              } else if (xmlDoc instanceof Document && xmlDoc.documentElement) {
                Blockly.Xml.domToWorkspace(xmlDoc, store.workspaceSvg);
                const blockCount = store.workspaceSvg.getAllBlocks().length;
                console.log(`Workspace loaded with XML fallback, ${blockCount} blocks loaded`);
              }
            }
          } catch (e) {
            console.error('Failed to parse or load workspace data:', e);
            console.error('Error details:', { message: e.message, stack: e.stack, name: e.name });
            
            // 异常情况下的后备方案
            console.warn('Fallback: Clearing workspace due to critical error');
            store.workspaceSvg.clear();
          }
        }
      }
    } catch (e) {
      console.error('Failed to load saved workspace:', e);
      console.error('Error details:', { message: e.message, stack: e.stack, name: e.name });
      console.error('Context at error time:', {
        savedDataType: typeof savedData,
        savedDataLength: savedData ? savedData.length : 'N/A',
        workspaceSvgExists: !!store.workspaceSvg
      });
    }
  } else {
    console.log('No saved workspace data found');
  }
  
  // 添加工作区变化事件监听，自动保存
  autoSaveInterval = setInterval(() => {
    saveWorkspace()
  }, 5000) // 每5秒自动保存一次
  
  store.workspaceSvg.addChangeListener((event) => {
    // 忽略某些不重要的事件
    if (event.type !== Blockly.Events.UI && 
        event.type !== Blockly.Events.HIGHLIGHT && 
        event.type !== Blockly.Events.BUBBLE_OPEN && 
        event.type !== Blockly.Events.BUBBLE_CLOSE) {
      saveWorkspace() // 重要变化立即保存
    }
  })
})

// 在组件卸载时清除定时器并保存工作区
onUnmounted(() => {
  // 组件卸载前强制保存一次工作区，确保切换页面时内容不丢失
  saveWorkspace()
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval)
  }
})
</script>

<style lang="less">
#app>section {
  height: 100%;

  >main {
    height: 100%;

    >div.blocklyDiv {
      width: 100%;
      height: 100%;
      text-align: left;

      >div.injectionDiv {
        >svg.blocklySvg {
          background-color: var(--color-bg-1);

          >g.blocklyWorkspace>rect.blocklyMainBackground {
            /* stroke: #c6c6c6; stroke-width: 1; */
          }
   
          
        }

        >svg.blocklyMainWorkspaceScrollbar {
          opacity: 0;
          transition: opacity ease 200ms;

          >g>rect.blocklyScrollbarHandle {
            fill: var(--color-fill-4);
          }
        }

        >svg.blocklyScrollbarHorizontal {
          margin-top: 1px;

          >g>rect.blocklyScrollbarHandle {
            height: 9px;
          }
        }

        >svg.blocklyScrollbarVertical {
          >g>rect.blocklyScrollbarHandle {
            width: 9px;
          }
        }
      }
    }
  }

  >main:hover {
    >div.blocklyDiv>div>svg.blocklyMainWorkspaceScrollbar {
      opacity: 0.8;
    }
  }
}

div.blocklyWidgetDiv {
  >div.blocklyMenu {
    padding: 4px 0;
    background-color: var(--color-bg-popup);
    border: 1px solid var(--color-fill-3);
    border-radius: var(--border-radius-medium);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

    >div.blocklyMenuItem {
      color: var(--color-text-1);
      padding: 0 12px;
      font-size: 14px;
      line-height: 36px;
      text-align: left;
      background-color: transparent;

      >div.blocklyMenuItemContent {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

    >div.blocklyMenuItem.blocklyMenuItemDisabled {
      color: var(--color-text-4);
    }

    >div.blocklyMenuItem:not(.blocklyMenuItemDisabled):hover {
      background: var(--color-fill-2);
    }
  }

  >div.blocklyMenu.blocklyFocused {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
}

body {
  >div.blocklyDropDownDiv {
    border: 1px solid var(--color-fill-3);
    border-radius: var(--border-radius-medium);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

    >div.blocklyDropDownContent>div.blocklyMenu>div.blocklyMenuItem {
      border-radius: var(--border-radius-medium);
    }
  }

  >div.blocklyDropDownDiv.blocklyFocused {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
}

</style>
