import Blockly from 'blockly'

Blockly.defineBlocksWithJsonArray([
  {
    type: 'controls_forever',
    message0: '%1',
    args0: [
      {
        type: 'field_label',
        text: '永远 循环'
      }
    ],
    message1: '%1',
    args1: [
      {
        type: 'input_statement',
        name: 'DO'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    style: 'controller',
    tooltip: '重复执行。'
  },
  {
    type: 'math_evenly_divisible',
    message0: '%1 能被 %2 整除',
    args0: [
      {
        type: 'input_value',
        name: 'DIVIDEND',
        check: 'Number',
        value: 0
      },
      {
        type: 'input_value',
        name: 'DIVISOR',
        check: 'Number',
        value: 0
      }
    ],
    output: 'Boolean',
    style: 'calculation',
    tooltip: '判断第一个数是否恰好被第二个数整除。'
  },
  {
    type: 'lists_split',
    message0: '把 %1 按 %2 %3',
    args0: [
      {
        type: 'input_value',
        name: 'INPUT',
        check: ['String', 'Array']
      },
      {
        type: 'input_value',
        name: 'DELIM',
        check: 'String'
      },
      {
        type: 'field_dropdown',
        name: 'MODE',
        options: [
          ['分开成列表', 'SPLIT'],
          ['合并为文本', 'JOIN']
        ]
      }
    ],
    output: ['String', 'Array'],
    style: 'calculation',
    tooltip: '将文本分开成列表或将列表合并为文本。'
  },
  {
    type: 'text_charAt',
    message0: '取 %1 %2 第 %3 个字符',
    args0: [
      {
        type: 'input_value',
        name: 'VALUE',
        check: 'String'
      },
      {
        type: 'field_dropdown',
        name: 'WHERE',
        options: [
          ['正数', 'FROM_START'],
          ['倒数', 'FROM_END']
        ]
      },
      {
        type: 'input_value',
        name: 'INDEX',
        check: 'Number'
      }
    ],
    output: 'String',
    style: 'calculation',
    tooltip: '取文本指定位置的字符。'
  },
  {
    type: 'text_getSubstring',
    message0: '取 %1 %2 第 %3 到 %4 第 %5 个字符',
    args0: [
      {
        type: 'input_value',
        name: 'VALUE',
        check: 'String'
      },
      {
        type: 'field_dropdown',
        name: 'WHERE1',
        options: [
          ['正数', 'FROM_START'],
          ['倒数', 'FROM_END']
        ]
      },
      {
        type: 'input_value',
        name: 'INDEX1',
        check: 'Number'
      },
      {
        type: 'field_dropdown',
        name: 'WHERE2',
        options: [
          ['正数', 'FROM_START'],
          ['倒数', 'FROM_END']
        ]
      },
      {
        type: 'input_value',
        name: 'INDEX2',
        check: 'Number'
      }
    ],
    output: 'String',
    style: 'calculation',
    tooltip: '取文本指定位置的字符。'
  },
  {
    type: 'math_types',
    message0: '把 %1 转换为 %2 类型',
    args0: [
      {
        type: 'input_value',
        name: 'VALUE'
      },
      {
        type: 'field_dropdown',
        name: 'TYPE',
        options: [
          ['字符串', 'STRING'],
          ['数值', 'NUMBER'],
          ['布尔', 'BOOLEAN']
        ]
      }
    ],
    output: 'String',
    style: 'calculation',
    tooltip: '将对象转换为指定类型。'
  },
  {
    type: 'lists_push',
    message0: '添加 %1 到 %2 末尾',
    args0: [
      {
        type: 'input_value',
        name: 'VALUE',
        check: 'Number'
      },
      {
        type: 'input_value',
        name: 'LIST',
        check: 'Array'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    style: 'lists',
    tooltip: '添加值到列表的末尾。'
  },
  {
    type: 'lists_insert',
    message0: '插入 %1 到 %2 %3 第 %4 项后面',
    args0: [
      {
        type: 'input_value',
        name: 'VALUE'
      },
      {
        type: 'input_value',
        name: 'LIST',
        check: 'Array'
      },
      {
        type: 'field_dropdown',
        name: 'WHERE',
        options: [
          ['正数', 'FROM_START'],
          ['倒数', 'FROM_END']
        ]
      },
      {
        type: 'input_value',
        name: 'INDEX',
        check: 'Number'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    style: 'lists',
    tooltip: '添加值到列表的末尾。'
  },
  {
    type: 'lists_delete',
    message0: '删除 %1 %2 第 %3 项',
    args0: [
      {
        type: 'input_value',
        name: 'LIST',
        check: 'Array'
      },
      {
        type: 'field_dropdown',
        name: 'WHERE',
        options: [
          ['正数', 'FROM_START'],
          ['倒数', 'FROM_END']
        ]
      },
      {
        type: 'input_value',
        name: 'INDEX',
        check: 'Number'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    style: 'lists_delete',
    tooltip: '删除列表的指定项。'
  },
  {
    type: 'lists_set',
    message0: '替换 %1 %2 第 %3 项为 %4',
    args0: [
      {
        type: 'input_value',
        name: 'LIST',
        check: 'Array'
      },
      {
        type: 'field_dropdown',
        name: 'WHERE',
        options: [
          ['正数', 'FROM_START'],
          ['倒数', 'FROM_END']
        ]
      },
      {
        type: 'input_value',
        name: 'INDEX',
        check: 'Number'
      },
      {
        type: 'input_value',
        name: 'VALUE'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    style: 'lists',
    tooltip: '替换列表的指定项。'
  },
  {
    type: 'lists_get',
    message0: '%1 %2 第 %3 项',
    args0: [
      {
        type: 'input_value',
        name: 'LIST',
        check: 'Array'
      },
      {
        type: 'field_dropdown',
        name: 'WHERE',
        options: [
          ['正数', 'FROM_START'],
          ['倒数', 'FROM_END']
        ]
      },
      {
        type: 'input_value',
        name: 'INDEX',
        check: 'Number'
      }
    ],
    output: 'Any',
    style: 'lists',
    tooltip: '获取列表的指定项。'
  },
  {
    type: 'lists_index',
    message0: '%1 中 %2 %3 的位置',
    args0: [
      {
        type: 'input_value',
        name: 'LIST',
        check: 'Array'
      },
      {
        type: 'field_dropdown',
        name: 'WHICH',
        options: [
          ['第一个', 'FIRST'],
          ['最后一个', 'LAST']
        ]
      },
      {
        type: 'input_value',
        name: 'VALUE'
      }
    ],
    output: 'Number',
    style: 'lists',
    tooltip: '返回在列表中的第一个/最后一个匹配项的索引值，如果找不到项目则返回列表本身。'
  },
  {
    type: 'lists_includes',
    message0: '%1 中包含 %2',
    args0: [
      {
        type: 'input_value',
        name: 'LIST',
        check: 'Array'
      },
      {
        type: 'input_value',
        name: 'VALUE'
      }
    ],
    output: 'Boolean',
    style: 'lists',
    tooltip: '列表中是否包含指定项。'
  },
  {
    "type": "construct_start",
    "message0": "创建 Vela JS 快应用 %1 应用名称 %2 应用包名 %3 图标 %4 %5 版本号 %6 最小平台支持版本（尽量不要修改) %7 %8 接口声明 %9 %10",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "field_input",
        "name": "appName",
        "text": "Veloxi"
      },
      {
        "type": "field_input",
        "name": "packageName",
        "text": "com.veloxi.default"
      },
      {
        "type": "field_input",
        "name": "appIcon",
        "text": "https://iot.mi.com/vela/quickapp/logo.png"
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_input",
        "name": "versionName",
        "text": "1.0.0"
      },
      {
        "type": "field_input",
        "name": "minPlatformVersion",
        "text": "1000"
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "api"
      }
    ],
    "nextStatement": null,
    "style": 'construction',
    "tooltip": "在 Veloxi 中，创建 Vela JS 快应用",
    "helpUrl": ""
  },
  {
    "type": "interface_basic",
    "message0": "声明基础权限 %1",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "basicInterface",
        "options": [
          [
            "设备信息 (device)",
            "device"
          ],
          [
            "应用配置 (configuration)",
            "configuration"
          ],
          [
            "设备通信 (interconnect)",
            "interconnect"
          ],
          [
            "数据存储 (storage)",
            "storage"
          ]
        ]
      }
    ],
    "style": 'construction',
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "style_color",
    "message0": "颜色 %1",
    "args0": [
      {
        "type": "field_input",
        "name": "color",
        "colour": "#999900"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
    "tooltip": "用于设置元素的颜色，例如文本颜色",
    "helpUrl": ""
  },
  {
    "type": "block_style_diystyle",
    "message0": "%1 : %2",
    "args0": [
      {
        "type": "field_input",
        "name": "name",
        "text": "属性名"
      },
      {
        "type": "field_input",
        "name": "value",
        "text": "属性值"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "style": 'style',
    "tooltip": "如果这里没有你想要的 CSS 属性，可使用这个积木自行添加",
    "helpUrl": ""
  },
  {
    "type": "block_style_font",
    "message0": "文字（复合属性） %1",
    "args0": [
      {
        "type": "field_input",
        "name": "font",
        "text": "italic"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "style": 'style',
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "block_style_fontstyle",
    "message0": "文本样式 %1",
    "args0": [
      {
        "type": "field_input",
        "name": "fontStyle",
        "text": "italic"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "style": 'style',
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "block_style_fontweight",
    "message0": "字重 %1",
    "args0": [
      {
        "type": "field_input",
        "name": "fontWeight",
        "text": "600"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "style": 'style',
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "block_style_fontsize",
    "message0": "字号 %1",
    "args0": [
      {
        "type": "field_input",
        "name": "fontSize",
        "text": "16px"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "style": 'style',
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "block_style_fontfamily",
    "message0": "字体 %1",
    "args0": [
      {
        "type": "field_input",
        "name": "fontFamily",
        "text": "MiSans"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "style": 'style',
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "block_style_opacity",
    "message0": "透明度 %1",
    "args0": [
      {
        "type": "field_input",
        "name": "opacity",
        "text": "0.6"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "style": 'style',
    "tooltip": "",
    "helpUrl": ""
  },

  {
    "type": 'block_style_backgroundcolor',
    "message0": '背景颜色 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'backgroundColor',
        'text': '#333'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": 'style'
  },

  {
    "type": 'block_style_backgroundimage',
    "message0": '背景图片 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'backgroundImage',
        'text': 'veloxi.png'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": 'style'
  },

  {
    "type": 'block_style_backgroundposition',
    "message0": '背景位置 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'backgroundPosition',
        'text': 'center'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_backgroundrepeat',
    "message0": '背景重复方式 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'backgroundRepeat',
        'text': 'no-repeat'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_backgroundsize',
    "message0": '背景尺寸 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'backgroundSize',
        'text': 'cover'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_background',
    "message0": '背景 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'background',
        'text': '#333'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_bordercolor',
    "message0": '边框颜色 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'borderColor',
        'text': '#FFF'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_borderradius',
    "message0": '圆角 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'borderRadius',
        'text': '10px 10px 10px 10px'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_borderstyle',
    "message0": '边框样式 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'borderStyle',
        'text': 'solid'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_borderwidth',
    "message0": '边框宽度 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'borderWidth',
        'text': '1px'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_border',
    "message0": '边框 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'border',
        'text': '1px solid #FFF'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_color',
    "message0": '文本颜色 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'color',
        'text': '#FFF'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_diystyle',
    "message0": '%1 : %2',
    "args0": [
      {
        "type": 'field_input',
        'name': 'name',
        'text': '属性名'
      },
      {
        "type": 'field_input',
        'name': 'value',
        'text': '属性值'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_fontfamily',
    "message0": '字体 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'fontFamily',
        'text': 'MiSans'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_fontsize',
    "message0": '字号 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'fontSize',
        'text': '16px'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_fontstyle',
    "message0": '文本样式 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'fontStyle',
        'text': 'italic'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_fontweight',
    "message0": '字重 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'fontWeight',
        'text': '600'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_font',
    "message0": '文字（复合属性） %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'font',
        'text': 'italic'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_height',
    "message0": '高度 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'height',
        'text': '100px'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_marginbottom',
    "message0": '外间距下 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'marginBottom',
        'text': '20px'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_marginleft',
    "message0": '外间距左 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'marginLeft',
        'text': '20px'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_marginright',
    "message0": '外间距右 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'marginRight',
        'text': '20px'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_margintop',
    "message0": '外间距上 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'marginTop',
        'text': '20px'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_margin',
    "message0": '外间距 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'margin',
        'text': '20px'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_maxheight',
    "message0": '最大高度 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'maxHeight',
        'text': '100px'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_maxwidth',
    "message0": '最大宽度 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'maxWidth',
        'text': '100px'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_minheight',
    "message0": '最小高度 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'minHeight',
        'text': '100px'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_minwidth',
    "message0": '最小宽度 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'minWidth',
        'text': '100px'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_opacity',
    "message0": '透明度 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'opacity',
        'text': '0.6'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_paddingbottom',
    "message0": '内间距下 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'paddingBottom',
        'text': '20px'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_paddingleft',
    "message0": '内间距左 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'paddingLeft',
        'text': '20px'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_paddingright',
    "message0": '内间距右 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'paddingRight',
        'text': '20px'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_paddingtop',
    "message0": '内间距上 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'paddingTop',
        'text': '20px'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_padding',
    "message0": '内间距 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'padding',
        'text': '20px'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_backgroundcolor',
    "message0": '背景颜色 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'backgroundColor',
        'text': '#333'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_backgroundimage',
    "message0": '背景图片 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'backgroundImage',
        'text': 'veloxi.png'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_backgroundposition',
    "message0": '背景位置 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'backgroundPosition',
        'text': 'center'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_backgroundrepeat',
    "message0": '背景重复方式 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'backgroundRepeat',
        'text': 'no-repeat'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_backgroundsize',
    "message0": '背景尺寸 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'backgroundSize',
        'text': 'cover'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_background',
    "message0": '背景 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'background',
        'text': '#333'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_bordercolor',
    "message0": '边框颜色 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'borderColor',
        'text': '#FFF'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_borderradius',
    "message0": '圆角 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'borderRadius',
        'text': '10px 10px 10px 10px'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_borderstyle',
    "message0": '边框样式 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'borderStyle',
        'text': 'solid'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_borderwidth',
    "message0": '边框宽度 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'borderWidth',
        'text': '1px'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_border',
    "message0": '边框 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'border',
        'text': '1px solid #FFF'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_color',
    "message0": '文本颜色 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'color',
        'text': '#FFF'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_diystyle',
    "message0": '%1 : %2',
    "args0": [
      {
        "type": 'field_input',
        'name': 'name',
        'text': '属性名'
      },
      {
        "type": 'field_input',
        'name': 'value',
        'text': '属性值'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_fontfamily',
    "message0": '字体 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'fontFamily',
        'text': 'MiSans'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_fontsize',
    "message0": '字号 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'fontSize',
        'text': '16px'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_fontstyle',
    "message0": '文本样式 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'fontStyle',
        'text': 'italic'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_fontweight',
    "message0": '字重 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'fontWeight',
        'text': '600'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_font',
    "message0": '文字（复合属性） %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'font',
        'text': 'italic'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_height',
    "message0": '高度 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'height',
        'text': '100px'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_marginbottom',
    "message0": '外间距下 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'marginBottom',
        'text': '20px'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_marginleft',
    "message0": '外间距左 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'marginLeft',
        'text': '20px'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_marginright',
    "message0": '外间距右 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'marginRight',
        'text': '20px'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_margintop',
    "message0": '外间距上 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'marginTop',
        'text': '20px'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_margin',
    "message0": '外间距 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'margin',
        'text': '20px'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_maxheight',
    "message0": '最大高度 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'maxHeight',
        'text': '100px'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_maxwidth',
    "message0": '最大宽度 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'maxWidth',
        'text': '100px'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_minheight',
    "message0": '最小高度 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'minHeight',
        'text': '100px'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_minwidth',
    "message0": '最小宽度 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'minWidth',
        'text': '100px'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_opacity',
    "message0": '透明度 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'opacity',
        'text': '0.6'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_paddingbottom',
    "message0": '内间距下 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'paddingBottom',
        'text': '20px'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_paddingleft',
    "message0": '内间距左 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'paddingLeft',
        'text': '20px'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_paddingright',
    "message0": '内间距右 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'paddingRight',
        'text': '20px'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_paddingtop',
    "message0": '内间距上 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'paddingTop',
        'text': '20px'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_padding',
    "message0": '内间距 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'padding',
        'text': '20px'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_width',
    "message0": '宽度 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'width',
        'text': '100px'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  },

  {
    "type": 'block_style_width',
    "message0": '宽度 %1',
    "args0": [
      {
        "type": 'field_input',
        'name': 'width',
        'text': '100px'
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": '',
    "helpUrl": '',
    "style": "style"
  }

])
