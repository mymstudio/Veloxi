import * as Blockly from 'blockly'
import { javascriptGenerator, Order } from 'blockly/javascript'

import { useProjectStore } from '../store/project'

// 全局变量用于存储所有UI积木对应的HTML代码
let uiBlocksMap = {};

// 支持的UI组件类型
const SUPPORTED_UI_TYPES = ['ui_div', 'ui_text', 'ui_image'];

function isInteger(str) {
  return /^\d+$/.test(str)
}

javascriptGenerator.forBlock['controls_forever'] = function (block, generator) {
  const branch = generator.statementToCode(block, 'DO')
  return 'for(;;) {\n' + branch + '}\n'
}

javascriptGenerator.forBlock['math_evenly_divisible'] = function (block, generator) {
  const argument1 = generator.valueToCode(block, 'DIVIDEND', Order.MODULUS) || '0'
  const argument2 = generator.valueToCode(block, 'DIVISOR', Order.MODULUS) || '0'
  return [argument1 + ' % ' + argument2 + ' === 0', Order.NONE]
}

javascriptGenerator.forBlock['text_charAt'] = function (block, generator) {
  const argument1 = generator.valueToCode(block, 'VALUE', Order.FUNCTION_CALL) || "''"
  let argument2, code
  argument2 = generator.valueToCode(block, 'INDEX', Order.FUNCTION_CALL) || '1'
  if (block.getFieldValue('WHERE') === 'FROM_START') {
    argument2 = isInteger(argument2) ? String(Number(argument2) - 1) : argument2 + ' - 1'
    code = argument1 + '.charAt(' + argument2 + ')'
  } else if (block.getFieldValue('WHERE') === 'FROM_END') {
    code = argument1 + '.slice(-' + argument2 + ').charAt(0)'
  }
  return [code, Order.NONE]
}

javascriptGenerator.forBlock['text_getSubstring'] = function (block, generator) {
  const argument1 = generator.valueToCode(block, 'VALUE', Order.FUNCTION_CALL) || "''"
  let argument2, argument3
  argument2 = generator.valueToCode(block, 'INDEX1', Order.FUNCTION_CALL) || '1'
  argument3 = generator.valueToCode(block, 'INDEX2', Order.FUNCTION_CALL) || '1'
  if (block.getFieldValue('WHERE1') === 'FROM_START') {
    argument2 = isInteger(argument2) ? String(Number(argument2) - 1) : argument2 + ' - 1'
  } else if (block.getFieldValue('WHERE1') === 'FROM_END') {
    argument2 = argument1 + '.length - ' + argument2
  }
  if (block.getFieldValue('WHERE2') === 'FROM_END') {
    argument3 = isInteger(argument3) ? String(Number(argument3) - 1) : '(' + argument3 + ' - 1)'
    argument3 = argument1 + '.length - ' + argument3
  }
  return [argument1 + '.slice(' + argument2 + ' ,' + argument3 + ')', Order.NONE]
}

javascriptGenerator.forBlock['math_types'] = function (block, generator) {
  const map = { STRING: 'String', NUMBER: 'Number', BOOLEAN: 'Boolean' }
  const argument1 = generator.valueToCode(block, 'VALUE', Order.ADDITION) || ''
  return [map[block.getFieldValue('TYPE')] + '(' + argument1 + ')', Order.NONE]
}

javascriptGenerator.forBlock['lists_push'] = function (block, generator) {
  const argument1 = generator.valueToCode(block, 'VALUE', Order.ADDITION) || ''
  const argument2 = generator.valueToCode(block, 'LIST', Order.ADDITION) || '[]'
  return argument2 + '.push(' + argument1 + ')'
}

javascriptGenerator.forBlock['lists_insert'] = function (block, generator) {
  const argument1 = generator.valueToCode(block, 'VALUE', Order.ADDITION) || 'null'
  const argument2 = generator.valueToCode(block, 'LIST', Order.ADDITION) || '[]'
  let argument3 = generator.valueToCode(block, 'INDEX', Order.ADDITION) || '1'
  if (block.getFieldValue('WHERE') === 'FROM_START') {
    argument3 = isInteger(argument3) ? String(Number(argument3) - 1) : argument3 + '- 1'
  } else if (block.getFieldValue('WHERE') === 'FROM_END') {
    argument3 = argument2 + '.length - ' + argument3
  }
  return argument2 + '.splice(' + argument3 + ', 0, ' + argument1 + ')'
}

javascriptGenerator.forBlock['lists_delete'] = function (block, generator) {
  const argument1 = generator.valueToCode(block, 'LIST', Order.ADDITION) || '[]'
  let argument2 = generator.valueToCode(block, 'INDEX', Order.ADDITION) || '1'
  if (block.getFieldValue('WHERE') === 'FROM_START') {
    argument2 = isInteger(argument2) ? String(Number(argument2) - 1) : argument2 + ' - 1'
  } else if (block.getFieldValue('WHERE') === 'FROM_END') {
    argument2 = argument1 + '.length - ' + argument2
  }
  return argument1 + '.splice(' + argument2 + ', 1)'
}

javascriptGenerator.forBlock['lists_set'] = function (block, generator) {
  const argument1 = generator.valueToCode(block, 'LIST', Order.ADDITION) || '[]'
  const argument3 = generator.valueToCode(block, 'VALUE', Order.ADDITION) || 'null'
  let argument2 = generator.valueToCode(block, 'INDEX', Order.ADDITION) || '1'
  if (block.getFieldValue('WHERE') === 'FROM_START') {
    argument2 = isInteger(argument2) ? String(Number(argument2) - 1) : argument2 + ' - 1'
  } else if (block.getFieldValue('WHERE') === 'FROM_END') {
    argument2 = argument1 + '.length - ' + argument2
  }
  return argument1 + '[' + argument2 + '] = ' + argument3
}

javascriptGenerator.forBlock['lists_get'] = function (block, generator) {
  const argument1 = generator.valueToCode(block, 'LIST', Order.ADDITION) || '[]'
  let argument2 = generator.valueToCode(block, 'INDEX', Order.ADDITION) || '1'
  if (block.getFieldValue('WHERE') === 'FROM_START') {
    argument2 = isInteger(argument2) ? String(Number(argument2) - 1) : argument2 + ' - 1'
  } else if (block.getFieldValue('WHERE') === 'FROM_END') {
    argument2 = argument1 + '.length - ' + argument2
  }
  return [argument1 + '[' + argument2 + ']', Order.NONE]
}

javascriptGenerator.forBlock['lists_index'] = function (block, generator) {
  const argument1 = generator.valueToCode(block, 'LIST', Order.ADDITION) || '[]'
  const argument2 = generator.valueToCode(block, 'VALUE', Order.ADDITION) || "''"
  let code
  if (block.getFieldValue('WHICH') === 'FIRST') {
    code = argument1 + '.indexOf(' + argument2 + ') + 1'
  } else if (block.getFieldValue('WHICH') === 'LAST') {
    code = argument1 + '.lastIndexOf(' + argument2 + ') + 1'
  }
  return [code, Order.NONE]
}

javascriptGenerator.forBlock['lists_includes'] = function (block, generator) {
  const argument1 = generator.valueToCode(block, 'LIST', Order.ADDITION) || '[]'
  const argument2 = generator.valueToCode(block, 'VALUE', Order.ADDITION) || "''"
  return [argument1 + '.contains(' + +argument2 + ')', Order.NONE]
}

javascriptGenerator.forBlock['construct_start'] = function (block, generator) {
  var text_packagename = block.getFieldValue('packageName');
  var text_appicon = block.getFieldValue('appIcon');
  var text_versionname = block.getFieldValue('versionName');
  var text_minplatformversion = block.getFieldValue('minPlatformVersion');
  var statements_api = generator.statementToCode(block, 'api');
  // TODO: Assemble JavaScript into code variable.
  var code = `
  {
  "package": "${text_packagename}",
  "name": "${block.getFieldValue('appName')}",
  "versionName": "${text_versionname}",
  "versionCode": 1,
  "minPlatformVersion": ${text_minplatformversion},
  "icon": "${text_appicon}",
  "deviceTypeList": [
    "watch"
  ],
  "features": [
    ${statements_api}
  ],
  "config": {
    "logLevel": "log",
    "designWidth": "device-width"
  },
  "router": {
    "entry": "pages/index",
    "pages": {
      "pages/index": {
        "component": "index"
      },
    }
  }
  }
  `;
  useProjectStore().mainfestJson = code
  console.log('Manifest内容已更新:', code)
  // 立即保存到本地存储，防止数据丢失
  localStorage.setItem('boxy_project_data', JSON.stringify({
    timestamp: Date.now(),
    interfaceCode: useProjectStore().interfaceCode  
  }));
};

// 文本组件代码生成器
defineUITextGenerator();

// 图片组件代码生成器
defineUIImageGenerator();

// 为style_color块添加更新逻辑
// 确保当颜色选择器的值改变时，强制更新interfaceCode
javascriptGenerator.updateStyleColorInterface = function(workspace) {
  try {
    const projectStore = useProjectStore();
    
    // 延迟一点时间，确保所有变化都已完成
    setTimeout(() => {
      try {
        // 重新生成所有UI积木的代码
        const updatedBlocks = {};
        const allBlocks = workspace.getAllBlocks(false);
        
        // 遍历所有积木，更新支持的UI类型积木的代码
        for (const b of allBlocks) {
          if (['ui_div', 'ui_text', 'ui_image'].includes(b.type)) {
            // 使用已导入的javascriptGenerator对象
            const generator = javascriptGenerator;
            // 确保生成器已初始化
            generator.init(workspace);
            // 生成更新后的代码
            const newCode = generator.forBlock[b.type](b, generator);
            updatedBlocks[b.id] = newCode;
          }
        }
        
        // 更新interfaceCode
        const newInterfaceCode = Object.values(updatedBlocks).join('');
        projectStore.interfaceCode = newInterfaceCode;
        console.log('已更新interfaceCode以反映颜色变化');
      } catch (error) {
        console.error('更新interfaceCode时出错:', error);
      }
    }, 100);
  } catch (e) {
    console.log('更新style_color界面时出错:', e);
  }
};

// 为工作区添加一次性的全局变化监听器
let hasGlobalChangeListener = false;
let updateTimeout = null;

function addGlobalChangeListener() {
  if (!hasGlobalChangeListener) {
    hasGlobalChangeListener = true;
    
    // 尝试从store获取workspace引用并添加监听器
    try {
      const store = useProjectStore();
      
      // 定期检查workspace是否已初始化
      const checkWorkspaceInterval = setInterval(() => {
        if (store.workspaceSvg) {
          clearInterval(checkWorkspaceInterval);
          
          // 为工作区添加style_color变化监听器
          store.workspaceSvg.addChangeListener((event) => {
            // 防抖动处理，避免短时间内多次触发更新
            if (updateTimeout) {
              clearTimeout(updateTimeout);
            }
            
            updateTimeout = setTimeout(() => {
              // 监听字段变化事件
              if (event.type === Blockly.Events.BLOCK_CHANGE && event.element === 'field') {
                const block = store.workspaceSvg.getBlockById(event.blockId);
                if (block && block.type === 'style_color') {
                  console.log('检测到style_color块变化，触发interfaceCode更新');
                  javascriptGenerator.updateStyleColorInterface(store.workspaceSvg);
                }
              }
              // 监听连接变化事件，当颜色块被拖入或拖出时触发更新
              else if (event.type === Blockly.Events.CONNECT || event.type === Blockly.Events.DISCONNECT) {
                console.log('检测到连接变化，可能涉及style_color块');
                javascriptGenerator.updateStyleColorInterface(store.workspaceSvg);
              }
            }, 150); // 150ms防抖动延迟
          });
          
          console.log('已为工作区添加全局变化监听器');
        }
      }, 100);
      
      // 设置超时，防止无限循环
      setTimeout(() => {
        clearInterval(checkWorkspaceInterval);
      }, 5000);
    } catch (e) {
      console.log('添加全局监听器时出错:', e);
    }
  }
}

// 在模块加载时添加全局监听器
setTimeout(addGlobalChangeListener, 100);

/**
 * 定义文本组件代码生成器
 */
function defineUITextGenerator() {
  javascriptGenerator.forBlock['ui_text'] = function (block, generator) {
    var text_content = block.getFieldValue('text');
    var text_id = block.getFieldValue('id');
    var text_class = block.getFieldValue('class');
    var statements_style = generator.statementToCode(block, 'textStyle');
    
    // 过滤掉空值属性
    text_id = text_id ? `id="${text_id}"` : '';
    text_class = text_class ? `class="${text_class}"` : '';
    statements_style = statements_style ? `style="${statements_style}"` : '';
    
    // 组装HTML属性
    const attributes = [];
    if (text_id) attributes.push(text_id);
    if (text_class) attributes.push(text_class);
    if (statements_style) attributes.push(statements_style);
    const attributesStr = attributes.join(' ');

    // 生成完整的HTML代码
    var code = `
  <text${attributesStr ? ' ' + attributesStr : ''}>
    ${text_content}
  </text>
  `;
    
    // 获取项目存储
    const projectStore = useProjectStore();
    
    // 保存当前积木的唯一标识符
    const blockId = block.id;
    
    // 存储该积木生成的代码到映射表
    uiBlocksMap[blockId] = code;
    
    // 如果是新积木，或者interfaceCode为空，立即更新整个interfaceCode
    if (!block.hasAddedToInterfaceCode || !projectStore.interfaceCode) {
      block.hasAddedToInterfaceCode = true;
      // 重新构建整个interfaceCode
      const newInterfaceCode = Object.values(uiBlocksMap).join('');
      projectStore.interfaceCode = newInterfaceCode;
      console.log('Interface内容已初始化:', projectStore.interfaceCode);
    }
    
    return code;
  };
}

/**
 * 定义图片组件代码生成器
 */
function defineUIImageGenerator() {
  javascriptGenerator.forBlock['ui_image'] = function (block, generator) {
    var text_src = block.getFieldValue('src');
    var text_id = block.getFieldValue('id');
    var text_class = block.getFieldValue('class');
    var statements_style = generator.statementToCode(block, 'NAME'); // 使用NAME作为样式输入名，与boxy.js中的定义保持一致
    
    // 过滤掉空值属性
    text_id = text_id ? `id="${text_id}"` : '';
    text_class = text_class ? `class="${text_class}"` : '';
    statements_style = statements_style ? `style="${statements_style}"` : '';
    
    // 组装HTML属性
    const attributes = [];
    if (text_id) attributes.push(text_id);
    if (text_class) attributes.push(text_class);
    if (statements_style) attributes.push(statements_style);
    attributes.push(`src="${text_src}"`);
    attributes.push('alt="图片"'); // 默认alt属性
    const attributesStr = attributes.join(' ');

    // 生成完整的HTML代码
    var code = `
  <image ${attributesStr}>
  `;
    
    // 获取项目存储
    const projectStore = useProjectStore();
    
    // 保存当前积木的唯一标识符
    const blockId = block.id;
    
    // 存储该积木生成的代码到映射表
    uiBlocksMap[blockId] = code;
    
    // 如果是新积木，或者interfaceCode为空，立即更新整个interfaceCode
    if (!block.hasAddedToInterfaceCode || !projectStore.interfaceCode) {
      block.hasAddedToInterfaceCode = true;
      // 重新构建整个interfaceCode
      const newInterfaceCode = Object.values(uiBlocksMap).join('');
      projectStore.interfaceCode = newInterfaceCode;
      console.log('Interface内容已初始化:', projectStore.interfaceCode);
    }
    
    return code;
  };
};

javascriptGenerator.forBlock['interface_basic'] = function (block, generator) {
  var dropdown_name = block.getFieldValue('basicInterface');
  var code = `{
      "name": "system.${dropdown_name}"
    },\n`;
  return code;
};

// 样式积木代码生成器
javascriptGenerator.forBlock['block_style_background'] = function(block, generator) {
  var text_background = block.getFieldValue('background');
  var code = 'background: ' + text_background + ';';
  return code;
};

javascriptGenerator.forBlock['block_style_backgroundcolor'] = function(block, generator) {
  var text_backgroundcolor = block.getFieldValue('backgroundColor');
  var code = 'background-color: ' + text_backgroundcolor + ';';
  return code;
};

javascriptGenerator.forBlock['block_style_backgroundimage'] = function(block, generator) {
  var text_backgroundimage = block.getFieldValue('backgroundImage');
  var code = 'background-image: url("' + text_backgroundimage + '");';
  return code;
};

javascriptGenerator.forBlock['block_style_backgroundposition'] = function(block, generator) {
  var text_backgroundposition = block.getFieldValue('backgroundPosition');
  var code = 'background-position: ' + text_backgroundposition + ';';
  return code;
};

javascriptGenerator.forBlock['block_style_backgroundrepeat'] = function(block, generator) {
  var text_backgroundrepeat = block.getFieldValue('backgroundRepeat');
  var code = 'background-repeat: ' + text_backgroundrepeat + ';';
  return code;
};

javascriptGenerator.forBlock['block_style_backgroundsize'] = function(block, generator) {
  var text_backgroundsize = block.getFieldValue('backgroundSize');
  var code = 'background-size: ' + text_backgroundsize + ';';
  return code;
};

javascriptGenerator.forBlock['block_style_border'] = function(block, generator) {
  var text_border = block.getFieldValue('border');
  var code = 'border: ' + text_border + ';';
  return code;
};

javascriptGenerator.forBlock['block_style_bordercolor'] = function(block, generator) {
  var text_bordercolor = block.getFieldValue('borderColor');
  var code = 'border-color: ' + text_bordercolor + ';';
  return code;
};

javascriptGenerator.forBlock['block_style_borderradius'] = function(block, generator) {
  var text_borderradius = block.getFieldValue('borderRadius');
  var code = 'border-radius: ' + text_borderradius + ';';
  return code;
};

javascriptGenerator.forBlock['block_style_borderstyle'] = function(block, generator) {
  var text_borderstyle = block.getFieldValue('borderStyle');
  var code = 'border-style: ' + text_borderstyle + ';';
  return code;
};

javascriptGenerator.forBlock['block_style_borderwidth'] = function(block, generator) {
  var text_borderwidth = block.getFieldValue('borderWidth');
  var code = 'border-width: ' + text_borderwidth + ';';
  return code;
};

javascriptGenerator.forBlock['block_style_color'] = function(block, generator) {
  var text_color = block.getFieldValue('color');
  var code = 'color: ' + text_color + ';';
  return code;
};

javascriptGenerator.forBlock['block_style_cursor'] = function(block, generator) {
  var text_cursor = block.getFieldValue('cursor');
  var code = 'cursor: ' + text_cursor + ';';
  return code;
};

javascriptGenerator.forBlock['block_style_display'] = function(block, generator) {
  var text_display = block.getFieldValue('display');
  var code = 'display: ' + text_display + ';';
  return code;
};

javascriptGenerator.forBlock['block_style_fontfamily'] = function(block, generator) {
  var text_fontfamily = block.getFieldValue('fontFamily');
  var code = 'font-family: ' + text_fontfamily + ';';
  return code;
};

javascriptGenerator.forBlock['block_style_fontsize'] = function(block, generator) {
  var text_fontsize = block.getFieldValue('fontSize');
  var code = 'font-size: ' + text_fontsize + ';';
  return code;
};

javascriptGenerator.forBlock['block_style_fontstyle'] = function(block, generator) {
  var text_fontstyle = block.getFieldValue('fontStyle');
  var code = 'font-style: ' + text_fontstyle + ';';
  return code;
};

javascriptGenerator.forBlock['block_style_fontweight'] = function(block, generator) {
  var text_fontweight = block.getFieldValue('fontWeight');
  var code = 'font-weight: ' + text_fontweight + ';';
  return code;
};

javascriptGenerator.forBlock['block_style_height'] = function(block, generator) {
  var text_height = block.getFieldValue('height');
  var code = 'height: ' + text_height + ';';
  return code;
};

javascriptGenerator.forBlock['block_style_left'] = function(block, generator) {
  var text_left = block.getFieldValue('left');
  var code = 'left: ' + text_left + ';';
  return code;
};

javascriptGenerator.forBlock['block_style_lineheight'] = function(block, generator) {
  var text_lineheight = block.getFieldValue('lineHeight');
  var code = 'line-height: ' + text_lineheight + ';';
  return code;
};

javascriptGenerator.forBlock['block_style_margin'] = function(block, generator) {
  var text_margin = block.getFieldValue('margin');
  var code = 'margin: ' + text_margin + ';';
  return code;
};

javascriptGenerator.forBlock['block_style_marginbottom'] = function(block, generator) {
  var text_marginbottom = block.getFieldValue('marginBottom');
  var code = 'margin-bottom: ' + text_marginbottom + ';';
  return code;
};

javascriptGenerator.forBlock['block_style_marginleft'] = function(block, generator) {
  var text_marginleft = block.getFieldValue('marginLeft');
  var code = 'margin-left: ' + text_marginleft + ';';
  return code;
};

javascriptGenerator.forBlock['block_style_marginright'] = function(block, generator) {
  var text_marginright = block.getFieldValue('marginRight');
  var code = 'margin-right: ' + text_marginright + ';';
  return code;
};

javascriptGenerator.forBlock['block_style_margintop'] = function(block, generator) {
  var text_margintop = block.getFieldValue('marginTop');
  var code = 'margin-top: ' + text_margintop + ';';
  return code;
};

javascriptGenerator.forBlock['block_style_opacity'] = function(block, generator) {
  var text_opacity = block.getFieldValue('opacity');
  var code = 'opacity: ' + text_opacity + ';';
  return code;
};

javascriptGenerator.forBlock['block_style_overflow'] = function(block, generator) {
  var text_overflow = block.getFieldValue('overflow');
  var code = 'overflow: ' + text_overflow + ';';
  return code;
};

javascriptGenerator.forBlock['block_style_padding'] = function(block, generator) {
  var text_padding = block.getFieldValue('padding');
  var code = 'padding: ' + text_padding + ';';
  return code;
};

javascriptGenerator.forBlock['block_style_paddingbottom'] = function(block, generator) {
  var text_paddingbottom = block.getFieldValue('paddingBottom');
  var code = 'padding-bottom: ' + text_paddingbottom + ';';
  return code;
};

javascriptGenerator.forBlock['block_style_paddingleft'] = function(block, generator) {
  var text_paddingleft = block.getFieldValue('paddingLeft');
  var code = 'padding-left: ' + text_paddingleft + ';';
  return code;
};

javascriptGenerator.forBlock['block_style_paddingright'] = function(block, generator) {
  var text_paddingright = block.getFieldValue('paddingRight');
  var code = 'padding-right: ' + text_paddingright + ';';
  return code;
};

javascriptGenerator.forBlock['block_style_paddingtop'] = function(block, generator) {
  var text_paddingtop = block.getFieldValue('paddingTop');
  var code = 'padding-top: ' + text_paddingtop + ';';
  return code;
};

javascriptGenerator.forBlock['block_style_position'] = function(block, generator) {
  var text_position = block.getFieldValue('position');
  var code = 'position: ' + text_position + ';';
  return code;
};

javascriptGenerator.forBlock['block_style_right'] = function(block, generator) {
  var text_right = block.getFieldValue('right');
  var code = 'right: ' + text_right + ';';
  return code;
};

javascriptGenerator.forBlock['block_style_textalign'] = function(block, generator) {
  var text_textalign = block.getFieldValue('textAlign');
  var code = 'text-align: ' + text_textalign + ';';
  return code;
};

javascriptGenerator.forBlock['block_style_textdecoration'] = function(block, generator) {
  var text_textdecoration = block.getFieldValue('textDecoration');
  var code = 'text-decoration: ' + text_textdecoration + ';';
  return code;
};

javascriptGenerator.forBlock['block_style_textshadow'] = function(block, generator) {
  var text_textshadow = block.getFieldValue('textShadow');
  var code = 'text-shadow: ' + text_textshadow + ';';
  return code;
};

javascriptGenerator.forBlock['block_style_texttransform'] = function(block, generator) {
  var text_texttransform = block.getFieldValue('textTransform');
  var code = 'text-transform: ' + text_texttransform + ';';
  return code;
};

javascriptGenerator.forBlock['block_style_top'] = function(block, generator) {
  var text_top = block.getFieldValue('top');
  var code = 'top: ' + text_top + ';';
  return code;
};

javascriptGenerator.forBlock['block_style_width'] = function(block, generator) {
  var text_width = block.getFieldValue('width');
  var code = 'width: ' + text_width + ';';
  return code;
};

javascriptGenerator.forBlock['block_style_zindex'] = function(block, generator) {
  var text_zindex = block.getFieldValue('zIndex');
  var code = 'z-index: ' + text_zindex + ';';
  return code;
};



javascriptGenerator.forBlock['ui_div'] = function (block, generator) {
  var text_id = block.getFieldValue('id');
  var text_class = block.getFieldValue('class');
  var statements_style = generator.statementToCode(block, 'divStyle');
  var statements_component = generator.statementToCode(block, 'divInside');
  // 过滤掉空值属性，后续组装代码时可根据这些变量决定是否包含对应属性
  text_id = text_id ? `id="${text_id}"` : '';
  text_class = text_class ? `class="${text_class}"` : '';
  statements_style = statements_style ? `style="${statements_style}"` : '';
  statements_component = statements_component ? statements_component : ''
  
  // 组装HTML属性，只包含非空属性
  const attributes = [];
  if (text_id) attributes.push(text_id);
  if (text_class) attributes.push(text_class);
  if (statements_style) attributes.push(statements_style);
  const attributesStr = attributes.join(' ');

  // 生成完整的HTML代码
  var code = `
  <div${attributesStr ? ' ' + attributesStr : ''}>
  ${statements_component}</div>
  `;
  
  // 获取项目存储
  const projectStore = useProjectStore();
  
  // 保存当前积木的唯一标识符
  const blockId = block.id;
  
  // 存储该积木生成的代码到映射表
  uiBlocksMap[blockId] = code;
  
  // 为当前工作区添加变化监听器（如果还没有添加）
  const workspace = block.workspace;
  if (!workspace.hasChangeListener) {
    workspace.hasChangeListener = true;
    
    // 添加变化监听器
    workspace.addChangeListener((event) => {
      // 处理字段变化、移动、删除等事件
      if (event.blockId && uiBlocksMap[event.blockId]) {
        // 延迟一点时间，确保所有变化都已完成
        setTimeout(() => {
          try {
            // 重新生成所有UI积木的代码
            const updatedBlocks = {};
            const allBlocks = workspace.getAllBlocks(false);
            
            // 遍历所有积木，更新支持的UI类型积木的代码
            for (const b of allBlocks) {
              if (SUPPORTED_UI_TYPES.includes(b.type)) {
                // 确保生成器已初始化
                generator.init(workspace);
                // 生成更新后的代码
                const newCode = javascriptGenerator.forBlock[b.type](b, generator);
                updatedBlocks[b.id] = newCode;
              }
            }
            
            // 更新映射表
            uiBlocksMap = updatedBlocks;
            
            // 重新构建interfaceCode
            const newInterfaceCode = Object.values(uiBlocksMap).join('')
            console.log('生成的界面代码:', newInterfaceCode.substring(0, 200) + '...')
            
            // 更新到store中
            projectStore.interfaceCode = newInterfaceCode
            console.log('已更新interfaceCode到store')
            
            // 初始化日志输出
            console.log('工作区代码生成完成')
          } catch (error) {
            console.error('更新interfaceCode时出错:', error);
          }
        }, 100);
      }
    });
  }
  
  // 如果是新积木，或者interfaceCode为空，立即更新整个interfaceCode
  if (!block.hasAddedToInterfaceCode || !projectStore.interfaceCode) {
    block.hasAddedToInterfaceCode = true;
    // 重新构建整个interfaceCode
    const newInterfaceCode = Object.values(uiBlocksMap).join('');
    projectStore.interfaceCode = newInterfaceCode;
    console.log('Interface内容已初始化:', projectStore.interfaceCode);
  }
  
  // 立即保存到本地存储，防止数据丢失
  localStorage.setItem('boxy_project_data', JSON.stringify({
    timestamp: Date.now(),
    interfaceCode: projectStore.interfaceCode
  }));
};