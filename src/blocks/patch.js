import Blockly from 'blockly'

import toolboxConfig from '../assets/toolbox.json'

/**
 * 给积木重写默认样式。
 * @param name 积木名称。
 * @param style 想要改成的样式。
 */
export function block_style(name, style) {
  // https://groups.google.com/g/blockly/c/byDoKnftEcc/m/qbaF9M8vBAAJ
  const savedIfInit = Blockly.Blocks[name].init
  Blockly.Blocks[name].init = function () {
    savedIfInit.bind(this)()
    this.setStyle(style)
    this.inputsInline = true
  }
}

// 设置指定积木为多行输入
function setMultilineInput(types) {
  types.forEach(function(type) {
    if (Blockly.Blocks[type]) {
      const savedInit = Blockly.Blocks[type].init
      Blockly.Blocks[type].init = function() {
        savedInit.bind(this)()
        this.inputsInline = false
      }
    }
  })
}

// 摘取积木栏配置信息，自动生成补丁。
toolboxConfig['contents'].forEach(function (category) {
  if ('contents' in category) {
    let style = category['categorystyle']
    category['contents'].forEach(function (element) {
      if (element['kind'] === 'block') {
        block_style(element.type, style)
      }
    })
  } else {
    console.warn(
      'This category is empty. ',
      'If you are using a custom approach, ',
      'please list all possible blocks in contents for a unified format.'
    )
  }
})

setMultilineInput(['construct_start', 'ui_div'])  
