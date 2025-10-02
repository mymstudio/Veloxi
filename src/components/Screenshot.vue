<template>
  <a-image-preview v-model:src="src" v-model:visible="visible">
    <template #actions>
      <a-image-preview-action name="下载" @click="handleDownloadClick">
        <icon-download />
      </a-image-preview-action>
    </template>
  </a-image-preview>
</template>

<script setup>
import {IconDownload} from '@arco-iconbox/vue-boxy'
import Blockly from 'blockly'
import {onMounted, ref} from 'vue'

const src = ref()
const visible = ref()

function handleDownloadClick() {
  const a = document.createElement('a')
  a.download = 'block.png'
  a.href = src.value
  a.click()
}

// https://github.com/google/blockly/blob/develop/tests/playgrounds/screenshot.js
// https://google.github.io/blockly-samples/examples/mirror-demo/index.html

function showSvg(svg) {
  const img = document.createElement('img')
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  const pixelDensity = Math.sqrt(40)
  canvas.width = svg.width * pixelDensity
  canvas.height = svg.height * pixelDensity
  img.onload = function () {
    context.drawImage(img, 0, 0, svg.width, svg.height, 0, 0, canvas.width, canvas.height)
    try {
      src.value = canvas.toDataURL('image/png')
      visible.value = true
    } catch (err) {
      console.warn('Error converting the workspace svg to a png.')
    }
  }
  img.src = svg.data
}

function workspaceToSvg(workspace, customCss) {
  const textAreas = document.getElementsByTagName('textarea')
  for (const element of textAreas) {
    element.innerHTML = element.value
  }

  const bBox = workspace.getBlocksBoundingBox()
  const x = bBox.x || bBox.left
  const y = bBox.y || bBox.top
  const width = bBox.width || bBox.right - x
  const height = bBox.height || bBox.bottom - y

  const blockCanvas = workspace.getCanvas()
  const clone = blockCanvas.cloneNode(true)
  clone.removeAttribute('transform')

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  svg.appendChild(clone)
  svg.setAttribute('viewBox', x + ' ' + y + ' ' + width + ' ' + height)

  svg.setAttribute(
    'class',
    'blocklySvg ' +
      (workspace.options.renderer || 'geras') +
      '-renderer ' +
      (workspace.getTheme ? workspace.getTheme().name + '-theme' : '')
  )
  svg.setAttribute('width', width)
  svg.setAttribute('height', height)
  svg.setAttribute('style', 'background-color: transparent')

  const css = [].slice
    .call(document.head.querySelectorAll('style'))
    .filter((el) => /\.blocklySvg/.test(el.innerText) || el.id.indexOf('blockly-') === 0)
    .map((el) => el.innerText)
    .join('\n')
  const style = document.createElement('style')
  style.innerHTML = css + '\n' + customCss
  svg.insertBefore(style, svg.firstChild)

  let svgAsXML = new XMLSerializer().serializeToString(svg)
  svgAsXML = svgAsXML.replace(/&nbsp/g, '&#160')
  const data = 'data:image/svg+xml,' + encodeURIComponent(svgAsXML)

  return { data: data, width: width, height: height }
}

function createBlockArea(scope) {
  const div = document.createElement('div')
  const head = { blocks: { languageVersion: 0, blocks: [scope.block.toCopyData().saveInfo] } }
  const blockArea = Blockly.inject(div, {
    readOnly: true,
    theme: 'codemao',
    renderer: 'codemao'
  })
  Blockly.serialization.workspaces.load(head, blockArea)
  return blockArea
}

onMounted(() => {
  Blockly.ContextMenuRegistry.registry.register({
    callback: function (scope) {
      showSvg(workspaceToSvg(createBlockArea(scope)))
    },
    scopeType: Blockly.ContextMenuRegistry.ScopeType.BLOCK,
    displayText: '生成积木图片',
    preconditionFn: function () {
      return 'enabled'
    },
    id: 'BlcokImage'
  })

  Blockly.ContextMenuRegistry.registry.register({
    callback: function (scope) {
      showSvg(workspaceToSvg(scope.workspace))
    },
    scopeType: Blockly.ContextMenuRegistry.ScopeType.WORKSPACE,
    displayText: '全局预览',
    preconditionFn: function (scope) {
      return scope.workspace.blockDB.size ? 'enabled' : 'disabled'
    },
    id: 'WorkspaceImage'
  })
})
</script>

<style lang="less">
body
  > div.arco-image-preview
  > div.arco-image-preview-wrapper
  > div.arco-image-preview-img-container {
  width: 50%;
  height: 50%;
  margin: 25% 25%;
}
</style>
