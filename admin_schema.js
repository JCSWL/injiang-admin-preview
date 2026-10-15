window.ADMIN_SCHEMA = {
  "merchant": {
    "groups": [
      {
        "title": "商户资料字段",
        "fields": [
          {
            "label": "商户名",
            "type": "文本",
            "required": true,
            "hint": "≤ 30 字,同城市唯一",
            "readonly": false
          },
          {
            "label": "认证徽章",
            "type": "开关",
            "required": true,
            "hint": "开启后前端显示\"in疆认证 · 明码实价\"",
            "readonly": false
          },
          {
            "label": "类目",
            "type": "下拉",
            "required": true,
            "hint": "美食 / 景点 / 购物 / 娱乐",
            "readonly": false,
            "options": [
              "美食",
              "景点",
              "购物",
              "娱乐"
            ]
          },
          {
            "label": "人均消费",
            "type": "数字",
            "required": true,
            "hint": "单位:元",
            "readonly": false
          },
          {
            "label": "图片库",
            "type": "图片",
            "required": true,
            "hint": "至少 3 张,最多 8 张(店门 / 招牌菜 / 环境混合)",
            "readonly": false
          },
          {
            "label": "商圈",
            "type": "下拉",
            "required": true,
            "hint": "从 5.1 城市商圈选",
            "readonly": false
          },
          {
            "label": "地图坐标",
            "type": "文本",
            "required": true,
            "hint": "支持地图选点,用于 3.1 核销距离校验",
            "readonly": false
          },
          {
            "label": "详细地址",
            "type": "文本",
            "required": true,
            "hint": "≤ 100 字",
            "readonly": false
          },
          {
            "label": "交通说明",
            "type": "文本",
            "required": false,
            "hint": "≤ 200 字,例:\"地铁 1 号线大巴扎站 B 口步行 5 分钟\"",
            "readonly": false
          },
          {
            "label": "营业时间",
            "type": "文本",
            "required": true,
            "hint": "例:\"10:00-24:00 · 全年无休\"",
            "readonly": false
          },
          {
            "label": "到店高峰提示",
            "type": "文本",
            "required": false,
            "hint": "例:\"12:00-13:30 最挤,晚市 19:00 后需等位\"",
            "readonly": false
          },
          {
            "label": "招牌菜品列表",
            "type": "列表",
            "required": false,
            "hint": "每条:名称 + 价格 + 是否\"必点\"标签 + 图片,最多 10 条",
            "readonly": false
          },
          {
            "label": "联系电话",
            "type": "文本",
            "required": true,
            "hint": "手机或座机",
            "readonly": false
          },
          {
            "label": "会员卡折扣",
            "type": "数字",
            "required": true,
            "hint": "0.1-1.0,作用于全店(0.8 = 8 折)",
            "readonly": false
          },
          {
            "label": "招牌套餐折扣",
            "type": "数字",
            "required": false,
            "hint": "0.1-1.0,只作用于招牌套餐(例:\"本店招牌套餐 8.5 折\")",
            "readonly": false
          },
          {
            "label": "状态",
            "type": "开关",
            "required": true,
            "hint": "上架 / 下架 / 冻结",
            "readonly": false,
            "options": [
              "上架",
              "下架",
              "冻结"
            ]
          }
        ]
      }
    ]
  },
  "guide": {
    "groups": [
      {
        "title": "向导资料字段",
        "fields": [
          {
            "label": "姓名",
            "type": "文本",
            "required": true,
            "hint": "≤ 20 字",
            "readonly": false
          },
          {
            "label": "主体类型",
            "type": "下拉",
            "required": true,
            "hint": "个人向导 / 亲属名下团 / 外部合作旅行团",
            "readonly": false,
            "options": [
              "个人向导",
              "亲属名下团",
              "外部合作旅行团"
            ]
          },
          {
            "label": "向导标签",
            "type": "列表",
            "required": false,
            "hint": "最多 3 个,例:哈萨克向导 / 沙漠玩家 / 美食向导 / 摄影向导",
            "readonly": false
          },
          {
            "label": "实名材料",
            "type": "图片",
            "required": true,
            "hint": "个人向导传身份证正反面;合作旅行团传营业执照+负责人身份证;仅后台可见,加密存储",
            "readonly": false
          },
          {
            "label": "头像",
            "type": "图片",
            "required": true,
            "hint": "≤ 500KB",
            "readonly": false
          },
          {
            "label": "简介",
            "type": "富文本",
            "required": true,
            "hint": "≤ 500 字,例:\"土生土长 · 玩沙漠 8 年\"",
            "readonly": false
          },
          {
            "label": "认证徽章",
            "type": "开关",
            "required": true,
            "hint": "开启后前端显示\"实名认证本地人\"",
            "readonly": false
          },
          {
            "label": "评分",
            "type": "数字",
            "required": false,
            "hint": "0-5,运营可手动调",
            "readonly": false
          },
          {
            "label": "已带旅友数",
            "type": "数字",
            "required": false,
            "hint": "系统统计但可运营手动初始化,作信任背书(例:\"已带 320 位旅友上山\")",
            "readonly": true
          },
          {
            "label": "服务城市",
            "type": "多选",
            "required": true,
            "hint": "从启用城市中选",
            "readonly": false
          },
          {
            "label": "状态",
            "type": "开关",
            "required": true,
            "hint": "上架 / 下架",
            "readonly": false,
            "options": [
              "上架",
              "下架"
            ]
          }
        ]
      }
    ]
  },
  "guide_routes": {
    "groups": [
      {
        "title": "向导路线字段 (每个向导可挂载多条路线)",
        "fields": [
          {
            "label": "路线名",
            "type": "文本",
            "required": true,
            "hint": "≤ 30 字,例:\"天山天池 · 牧场深度一日\"",
            "readonly": false
          },
          {
            "label": "副标题标签",
            "type": "文本",
            "required": false,
            "hint": "例:\"SIGNATURE ROUTE\"、\"限定玩法\",卡片顶部小字",
            "readonly": false
          },
          {
            "label": "时长",
            "type": "文本",
            "required": true,
            "hint": "≤ 20 字,例:\"1 天\"、\"2 日\"、\"5 天 4 夜\"",
            "readonly": false
          },
          {
            "label": "接送方式",
            "type": "下拉",
            "required": true,
            "hint": "机场接送 / 酒店接送 / 自行前往",
            "readonly": false,
            "options": [
              "机场接送",
              "酒店接送",
              "自行前往"
            ]
          },
          {
            "label": "行程节点",
            "type": "列表",
            "required": true,
            "hint": "每条:Day X + 描述",
            "readonly": false
          },
          {
            "label": "精华景点亮点",
            "type": "列表",
            "required": false,
            "hint": "4 大必去精华景点,每条:景点名 + 一句描述",
            "readonly": false
          },
          {
            "label": "费用怎么算",
            "type": "富文本",
            "required": true,
            "hint": "已包含 / 不包含 两个清单",
            "readonly": false
          },
          {
            "label": "避坑指南",
            "type": "富文本",
            "required": false,
            "hint": "\"新手必看 少走弯路\"",
            "readonly": false
          },
          {
            "label": "是否纯玩不进店",
            "type": "开关",
            "required": true,
            "hint": "开启后前端显示\"纯玩不进店\"徽章",
            "readonly": false
          },
          {
            "label": "门市价",
            "type": "数字",
            "required": true,
            "hint": "单位:元",
            "readonly": false
          },
          {
            "label": "成团价",
            "type": "数字",
            "required": true,
            "hint": "≤ 门市价",
            "readonly": false
          },
          {
            "label": "最低成团人数",
            "type": "数字",
            "required": true,
            "hint": "例:\"3 人成团\"、\"2 人成行价\"",
            "readonly": false
          },
          {
            "label": "差人成团退款保障",
            "type": "开关",
            "required": true,
            "hint": "开启后前端显示\"差人成团全额退\"",
            "readonly": false
          },
          {
            "label": "退改规则",
            "type": "文本",
            "required": true,
            "hint": "≤ 500 字,例:\"出发前 3 天可免费改期\"",
            "readonly": false
          },
          {
            "label": "沿途商户挂载",
            "type": "多选",
            "required": false,
            "hint": "从 2.3 商户选",
            "readonly": false
          },
          {
            "label": "封面图",
            "type": "图片",
            "required": true,
            "hint": "建议横版",
            "readonly": false
          },
          {
            "label": "状态",
            "type": "开关",
            "required": true,
            "hint": "上架 / 下架",
            "readonly": false,
            "options": [
              "上架",
              "下架"
            ]
          }
        ]
      }
    ]
  },
  "activity": {
    "groups": [
      {
        "title": "活动字段",
        "fields": [
          {
            "label": "活动名",
            "type": "文本",
            "required": true,
            "hint": "≤ 30 字",
            "readonly": false
          },
          {
            "label": "类型",
            "type": "下拉",
            "required": true,
            "hint": "官方带队 / 向导带队 / 外部合作旅行团 / 用户自发起",
            "readonly": false,
            "options": [
              "官方带队",
              "向导带队",
              "外部合作旅行团",
              "用户自发起"
            ]
          },
          {
            "label": "用户自发活动发起人",
            "type": "下拉",
            "required": false,
            "hint": "类型为用户自发起时必填,从会员列表选",
            "readonly": false
          },
          {
            "label": "审核状态",
            "type": "下拉",
            "required": true,
            "hint": "待审 / 已通过 / 已拒绝(用户自发起强制走审核,其他跳过)",
            "readonly": true,
            "options": [
              "待审",
              "已通过",
              "已拒绝"
            ]
          },
          {
            "label": "关联向导",
            "type": "下拉",
            "required": false,
            "hint": "向导带队时必填",
            "readonly": false
          },
          {
            "label": "关联合作方",
            "type": "下拉",
            "required": false,
            "hint": "外部合作时必填,从 2.4 中主体类型为外部合作旅行团的记录选",
            "readonly": false
          },
          {
            "label": "副标题标签",
            "type": "文本",
            "required": false,
            "hint": "例:\"本周热门 No.1\"、\"限量 · 今日剩 5 名\"",
            "readonly": false
          },
          {
            "label": "路线/地点",
            "type": "文本",
            "required": true,
            "hint": "≤ 100 字",
            "readonly": false
          },
          {
            "label": "开始时间",
            "type": "日期",
            "required": true,
            "hint": "—",
            "readonly": false
          },
          {
            "label": "结束时间",
            "type": "日期",
            "required": true,
            "hint": "晚于开始时间",
            "readonly": false
          },
          {
            "label": "报名截止",
            "type": "日期",
            "required": true,
            "hint": "早于开始时间",
            "readonly": false
          },
          {
            "label": "人数上限",
            "type": "数字",
            "required": true,
            "hint": "≥ 2",
            "readonly": false
          },
          {
            "label": "最低成团人数",
            "type": "数字",
            "required": true,
            "hint": "≤ 人数上限",
            "readonly": false
          },
          {
            "label": "是否付费",
            "type": "下拉",
            "required": true,
            "hint": "付费 / 免费",
            "readonly": false,
            "options": [
              "付费",
              "免费"
            ]
          },
          {
            "label": "成人价",
            "type": "数字",
            "required": true,
            "hint": "免费时固定 0",
            "readonly": false
          },
          {
            "label": "儿童价",
            "type": "数字",
            "required": false,
            "hint": "≤ 成人价",
            "readonly": false
          },
          {
            "label": "活动看什么(亮点)",
            "type": "列表",
            "required": true,
            "hint": "每条:亮点标题 + 一句描述,最多 5 条",
            "readonly": false
          },
          {
            "label": "主办方介绍",
            "type": "富文本",
            "required": false,
            "hint": "例:\"玩沙漠 8 年的本地老炮...\"",
            "readonly": false
          },
          {
            "label": "退改规则",
            "type": "文本",
            "required": true,
            "hint": "≤ 500 字",
            "readonly": false
          },
          {
            "label": "封面图",
            "type": "图片",
            "required": true,
            "hint": "—",
            "readonly": false
          },
          {
            "label": "活动描述",
            "type": "富文本",
            "required": true,
            "hint": "—",
            "readonly": false
          },
          {
            "label": "关联城市",
            "type": "下拉",
            "required": true,
            "hint": "从启用城市选",
            "readonly": false
          },
          {
            "label": "状态",
            "type": "开关",
            "required": true,
            "hint": "上架 / 下架",
            "readonly": false,
            "options": [
              "上架",
              "下架"
            ]
          }
        ]
      }
    ]
  },
  "activity_signup": {
    "groups": [
      {
        "title": "报名管理页 (只读列表)",
        "fields": []
      }
    ]
  },
  "destination": {
    "groups": [
      {
        "title": "目的地字段",
        "fields": [
          {
            "label": "目的地名",
            "type": "文本",
            "required": true,
            "hint": "≤ 20 字,例:\"喀什老城\"、\"喀纳斯神仙湾\"",
            "readonly": false
          },
          {
            "label": "主题类型",
            "type": "下拉",
            "required": true,
            "hint": "绝美秘境 / 出片圣地 / 限定玩法 / 必吃美食",
            "readonly": false,
            "options": [
              "绝美秘境",
              "出片圣地",
              "限定玩法",
              "必吃美食"
            ]
          },
          {
            "label": "副标题",
            "type": "文本",
            "required": true,
            "hint": "≤ 30 字,例:\"土黄巷子 · 千年烟火\"",
            "readonly": false
          },
          {
            "label": "关联城市",
            "type": "下拉",
            "required": true,
            "hint": "从启用城市选",
            "readonly": false
          },
          {
            "label": "关联商圈",
            "type": "下拉",
            "required": false,
            "hint": "—",
            "readonly": false
          },
          {
            "label": "封面图",
            "type": "图片",
            "required": true,
            "hint": "建议横版",
            "readonly": false
          },
          {
            "label": "详情图组",
            "type": "图片",
            "required": false,
            "hint": "最多 8 张",
            "readonly": false
          },
          {
            "label": "详细介绍",
            "type": "富文本",
            "required": true,
            "hint": "≤ 5000 字",
            "readonly": false
          },
          {
            "label": "挂载商户",
            "type": "多选",
            "required": false,
            "hint": "从 2.3 商户选,前端显示\"在这里可去的好店\"",
            "readonly": false
          },
          {
            "label": "挂载向导路线",
            "type": "多选",
            "required": false,
            "hint": "从 2.4 向导路线选,前端显示\"跟本地人玩这里\"",
            "readonly": false
          },
          {
            "label": "挂载活动",
            "type": "多选",
            "required": false,
            "hint": "从 2.5 活动选,前端显示\"这里有什么局\"",
            "readonly": false
          },
          {
            "label": "排序权重",
            "type": "数字",
            "required": true,
            "hint": "数字越小越前",
            "readonly": false
          },
          {
            "label": "状态",
            "type": "开关",
            "required": true,
            "hint": "上架 / 下架",
            "readonly": false,
            "options": [
              "上架",
              "下架"
            ]
          }
        ]
      }
    ]
  },
  "ranking": {
    "groups": [
      {
        "title": "玩法榜单字段",
        "fields": [
          {
            "label": "榜单名",
            "type": "文本",
            "required": true,
            "hint": "例:\"热门玩法 Top 10 · 本周\"",
            "readonly": false
          },
          {
            "label": "主题类型",
            "type": "下拉",
            "required": true,
            "hint": "限定玩法 / 绝美秘境 / 必吃美食 / 出片圣地",
            "readonly": false,
            "options": [
              "限定玩法",
              "绝美秘境",
              "必吃美食",
              "出片圣地"
            ]
          },
          {
            "label": "关联城市",
            "type": "下拉",
            "required": true,
            "hint": "从启用城市选",
            "readonly": false
          },
          {
            "label": "上榜项",
            "type": "列表",
            "required": true,
            "hint": "至少 3 条,每条:关联对象(可选:向导路线 / 活动 / 目的地 / 商户)+ 排名 + 副标题标签",
            "readonly": false
          },
          {
            "label": "更新频率",
            "type": "下拉",
            "required": true,
            "hint": "每周 / 每月 / 手动",
            "readonly": false,
            "options": [
              "每周",
              "每月",
              "手动"
            ]
          },
          {
            "label": "封面图",
            "type": "图片",
            "required": false,
            "hint": "—",
            "readonly": false
          },
          {
            "label": "状态",
            "type": "开关",
            "required": true,
            "hint": "上架 / 下架",
            "readonly": false,
            "options": [
              "上架",
              "下架"
            ]
          }
        ]
      }
    ]
  },
  "shop": {
    "groups": [
      {
        "title": "商品字段",
        "fields": [
          {
            "label": "商品名",
            "type": "文本",
            "required": true,
            "hint": "≤ 40 字",
            "readonly": false
          },
          {
            "label": "类目",
            "type": "下拉",
            "required": true,
            "hint": "干果蜜饯 / 奶制品 / 馕与主食 / 手工艺",
            "readonly": false,
            "options": [
              "干果蜜饯",
              "奶制品",
              "馕与主食",
              "手工艺"
            ]
          },
          {
            "label": "主图",
            "type": "图片",
            "required": true,
            "hint": "至少 1 张,最多 8 张",
            "readonly": false
          },
          {
            "label": "详情图",
            "type": "图片",
            "required": false,
            "hint": "最多 15 张,商品详情页轮播",
            "readonly": false
          },
          {
            "label": "产地故事标签",
            "type": "文本",
            "required": false,
            "hint": "≤ 12 字,例:\"油脂香浓 · 当地待客果盘\"、\"浓缩阳光 · 手工熬制一夏\"",
            "readonly": false
          },
          {
            "label": "产地",
            "type": "文本",
            "required": true,
            "hint": "≤ 30 字,例:和田 / 阿克苏 / 伊犁牧场",
            "readonly": false
          },
          {
            "label": "品牌/合作社",
            "type": "文本",
            "required": false,
            "hint": "例:\"买买提大叔精选枣\"",
            "readonly": false
          },
          {
            "label": "产地故事",
            "type": "富文本",
            "required": false,
            "hint": "≤ 3000 字",
            "readonly": false
          },
          {
            "label": "关联城市",
            "type": "下拉",
            "required": true,
            "hint": "从启用城市选",
            "readonly": false
          },
          {
            "label": "支持退换",
            "type": "开关",
            "required": true,
            "hint": "未开封 7 天可退换",
            "readonly": false
          },
          {
            "label": "支持新人券抵扣",
            "type": "开关",
            "required": true,
            "hint": "关联 3.4 优惠券 · 市集欢迎礼",
            "readonly": false
          },
          {
            "label": "支持旅友会员优惠",
            "type": "开关",
            "required": true,
            "hint": "关联 3.4 优惠券 · 会员专享券",
            "readonly": false
          },
          {
            "label": "状态",
            "type": "开关",
            "required": true,
            "hint": "上架 / 下架",
            "readonly": false,
            "options": [
              "上架",
              "下架"
            ]
          }
        ]
      }
    ]
  },
  "shop_specs": {
    "groups": [
      {
        "title": "商品规格字段 (一个商品至少 1 个,最多 5 个规格)",
        "fields": [
          {
            "label": "规格名",
            "type": "文本",
            "required": true,
            "hint": "≤ 30 字,例:\"500g/盒\"、\"1kg 礼盒装\"",
            "readonly": false
          },
          {
            "label": "规格编码",
            "type": "文本",
            "required": true,
            "hint": "唯一,可自动生成",
            "readonly": true
          },
          {
            "label": "价格",
            "type": "数字",
            "required": true,
            "hint": "单位:元",
            "readonly": false
          },
          {
            "label": "划线价",
            "type": "数字",
            "required": false,
            "hint": "≥ 价格",
            "readonly": false
          },
          {
            "label": "库存",
            "type": "数字",
            "required": true,
            "hint": "≥ 0",
            "readonly": false
          },
          {
            "label": "规格图",
            "type": "图片",
            "required": false,
            "hint": "单张,购物车展示",
            "readonly": false
          },
          {
            "label": "状态",
            "type": "开关",
            "required": true,
            "hint": "上架 / 下架(单个规格级)",
            "readonly": false,
            "options": [
              "上架",
              "下架"
            ]
          }
        ]
      }
    ]
  },
  "content": {
    "groups": [
      {
        "title": "2.2 攻略图文",
        "fields": [
          {
            "label": "标题",
            "type": "文本",
            "required": true,
            "hint": "≤ 30 字",
            "readonly": false
          },
          {
            "label": "分类",
            "type": "下拉",
            "required": true,
            "hint": "美食 / 景点 / 交通 / 自驾 / 自由行",
            "readonly": false,
            "options": [
              "美食",
              "景点",
              "交通",
              "自驾",
              "自由行"
            ]
          },
          {
            "label": "封面图",
            "type": "图片",
            "required": true,
            "hint": "≤ 500KB",
            "readonly": false
          },
          {
            "label": "正文",
            "type": "富文本",
            "required": true,
            "hint": "图文混排,≤ 20000 字",
            "readonly": false
          },
          {
            "label": "关联商户",
            "type": "多选",
            "required": false,
            "hint": "从 2.3 商户表选,正文中以卡片形式插入",
            "readonly": false
          },
          {
            "label": "排序权重",
            "type": "数字",
            "required": true,
            "hint": "数字越小越前",
            "readonly": false
          },
          {
            "label": "状态",
            "type": "开关",
            "required": true,
            "hint": "上架 / 下架",
            "readonly": false,
            "options": [
              "上架",
              "下架"
            ]
          }
        ]
      }
    ]
  },
  "member": {
    "groups": [
      {
        "title": "会员详情字段 (展示为主,少数字段可编辑)",
        "fields": [
          {
            "label": "昵称 / 头像 / 手机号",
            "type": "文本",
            "required": false,
            "hint": "微信授权获取,只读",
            "readonly": true
          },
          {
            "label": "会员编号",
            "type": "文本",
            "required": false,
            "hint": "系统生成,格式 IJ-XXXXXX(例:\"IJ-7K2Q9F\")",
            "readonly": true
          },
          {
            "label": "来源渠道",
            "type": "文本",
            "required": false,
            "hint": "自动记录:直接注册 / 各推广码 / 分享裂变",
            "readonly": true
          },
          {
            "label": "来自城市",
            "type": "文本",
            "required": false,
            "hint": "注册时用户选择",
            "readonly": true
          },
          {
            "label": "停留天数",
            "type": "数字",
            "required": false,
            "hint": "用户填写\"这趟待几天\"(可在我的页编辑)",
            "readonly": true
          },
          {
            "label": "兴趣标签",
            "type": "文本",
            "required": false,
            "hint": "注册引导时采集(代码写死的选项集);用户可在我的页编辑自己的选择",
            "readonly": true
          },
          {
            "label": "注册时间",
            "type": "日期",
            "required": false,
            "hint": "只读",
            "readonly": true
          },
          {
            "label": "当前等级",
            "type": "下拉",
            "required": false,
            "hint": "旅友 / 常客 LV.2 / 挚友 LV.3",
            "readonly": true,
            "options": [
              "旅友",
              "常客 LV.2",
              "挚友 LV.3"
            ]
          },
          {
            "label": "累计到店打卡数",
            "type": "数字",
            "required": false,
            "hint": "决定等级晋升",
            "readonly": true
          },
          {
            "label": "累计付费金额",
            "type": "数字",
            "required": false,
            "hint": "参考数据",
            "readonly": true
          },
          {
            "label": "累计积分",
            "type": "数字",
            "required": false,
            "hint": "只累计不兑换",
            "readonly": true
          },
          {
            "label": "收藏商户/玩法/目的地数",
            "type": "数字",
            "required": false,
            "hint": "用户在小程序的收藏",
            "readonly": true
          },
          {
            "label": "足迹地点数 + 累计公里数",
            "type": "文本",
            "required": false,
            "hint": "由 3.1 核销数据 + 目的地关联自动统计",
            "readonly": true
          },
          {
            "label": "收货地址",
            "type": "文本",
            "required": false,
            "hint": "用户在我的页维护; 运营端脱敏显示 (例:\"上海 · 徐汇区 ****\"),不看完整地址",
            "readonly": true
          },
          {
            "label": "行为记录",
            "type": "列表",
            "required": false,
            "hint": "列表:注册、打卡、报名、支付、评价、收藏",
            "readonly": true
          },
          {
            "label": "运营标签",
            "type": "多选",
            "required": false,
            "hint": "运营手动打,多选 + 自定义",
            "readonly": false
          },
          {
            "label": "备注",
            "type": "文本",
            "required": false,
            "hint": "运营内部,≤ 500 字",
            "readonly": false
          },
          {
            "label": "状态",
            "type": "下拉",
            "required": false,
            "hint": "正常 / 封禁",
            "readonly": false,
            "options": [
              "正常",
              "封禁"
            ]
          }
        ]
      }
    ]
  },
  "coupon": {
    "groups": [
      {
        "title": "券配置字段",
        "fields": [
          {
            "label": "券名",
            "type": "文本",
            "required": true,
            "hint": "例:\"山海市集新人券\"",
            "readonly": false
          },
          {
            "label": "券类型",
            "type": "下拉",
            "required": true,
            "hint": "新人券 / 会员券 / 活动券",
            "readonly": false,
            "options": [
              "新人券",
              "会员券",
              "活动券"
            ]
          },
          {
            "label": "优惠类型",
            "type": "下拉",
            "required": true,
            "hint": "满减 / 折扣 / 立减",
            "readonly": false,
            "options": [
              "满减",
              "折扣",
              "立减"
            ]
          },
          {
            "label": "优惠数值",
            "type": "数字",
            "required": true,
            "hint": "满减:满 X 减 Y;折扣:0.1-0.99;立减:Y 元",
            "readonly": false
          },
          {
            "label": "使用门槛",
            "type": "数字",
            "required": false,
            "hint": "例:满 89 减 15",
            "readonly": false
          },
          {
            "label": "适用范围",
            "type": "下拉",
            "required": true,
            "hint": "全部商品 / 指定类目 / 指定商品 / 全部活动 / 指定活动",
            "readonly": false,
            "options": [
              "全部商品",
              "指定类目",
              "指定商品",
              "全部活动",
              "指定活动"
            ]
          },
          {
            "label": "指定对象",
            "type": "多选",
            "required": false,
            "hint": "适用范围为\"指定\"时必填",
            "readonly": false
          },
          {
            "label": "领取上限(人均)",
            "type": "数字",
            "required": true,
            "hint": "例:1 张",
            "readonly": false
          },
          {
            "label": "有效期类型",
            "type": "下拉",
            "required": true,
            "hint": "固定日期 / 领取后 N 天有效",
            "readonly": false,
            "options": [
              "固定日期",
              "领取后 N 天有效"
            ]
          },
          {
            "label": "生效期",
            "type": "日期",
            "required": true,
            "hint": "按有效期类型",
            "readonly": false
          },
          {
            "label": "库存",
            "type": "数字",
            "required": true,
            "hint": "总发放量",
            "readonly": false
          },
          {
            "label": "状态",
            "type": "开关",
            "required": true,
            "hint": "启用 / 停用",
            "readonly": false,
            "options": [
              "启用",
              "停用"
            ]
          }
        ]
      }
    ]
  },
  "promo": {
    "groups": [
      {
        "title": "渠道类型字段",
        "fields": [
          {
            "label": "渠道类型名",
            "type": "文本",
            "required": true,
            "hint": "≤ 20 字,唯一,例:出租车 / 酒店 / 大巴扎 / 导游",
            "readonly": false
          },
          {
            "label": "统一分成比例",
            "type": "数字",
            "required": true,
            "hint": "0-100,两位小数(1 = 1%)",
            "readonly": false
          },
          {
            "label": "备注",
            "type": "文本",
            "required": false,
            "hint": "≤ 200 字,例:\"与市出租车协会合作\"",
            "readonly": false
          },
          {
            "label": "状态",
            "type": "开关",
            "required": true,
            "hint": "启用 / 停用",
            "readonly": false,
            "options": [
              "启用",
              "停用"
            ]
          }
        ]
      },
      {
        "title": "通用落地页字段 (一期只做一个)",
        "fields": [
          {
            "label": "顶部图片",
            "type": "图片",
            "required": true,
            "hint": "≤ 500KB",
            "readonly": false
          },
          {
            "label": "主文案",
            "type": "文本",
            "required": true,
            "hint": "≤ 30 字,例:\"欢迎来到新疆\"",
            "readonly": false
          },
          {
            "label": "副文案",
            "type": "文本",
            "required": false,
            "hint": "≤ 200 字",
            "readonly": false
          },
          {
            "label": "主按钮文案",
            "type": "文本",
            "required": true,
            "hint": "例:\"先随便逛逛 ›\"",
            "readonly": false
          },
          {
            "label": "跳转目标",
            "type": "下拉",
            "required": true,
            "hint": "默认首页",
            "readonly": false
          }
        ]
      },
      {
        "title": "批量生成推广码",
        "fields": [
          {
            "label": "批次名",
            "type": "文本",
            "required": true,
            "hint": "≤ 30 字,例:\"202609 出租车首批\"",
            "readonly": false
          },
          {
            "label": "渠道类型",
            "type": "下拉",
            "required": true,
            "hint": "从上表选",
            "readonly": false
          },
          {
            "label": "生成数量",
            "type": "数字",
            "required": true,
            "hint": "1-5000",
            "readonly": false
          },
          {
            "label": "分发对象登记表",
            "type": "列表",
            "required": false,
            "hint": "含\"码 ID + 分发对象姓名 + 电话\"栏,可后补",
            "readonly": false
          }
        ]
      },
      {
        "title": "追踪列表 (自动统计)",
        "fields": [
          {
            "label": "码 ID",
            "type": "文本",
            "required": false,
            "hint": "唯一识别",
            "readonly": true
          },
          {
            "label": "所属批次 / 渠道",
            "type": "文本",
            "required": false,
            "hint": "—",
            "readonly": true
          },
          {
            "label": "分发对象",
            "type": "文本",
            "required": false,
            "hint": "从登记表导入",
            "readonly": true
          },
          {
            "label": "扫码次数",
            "type": "数字",
            "required": false,
            "hint": "累计打开",
            "readonly": true
          },
          {
            "label": "注册会员数",
            "type": "数字",
            "required": false,
            "hint": "通过此码首次进入并注册的人数",
            "readonly": true
          },
          {
            "label": "累计消费金额",
            "type": "数字",
            "required": false,
            "hint": "该码带来的会员产生的付费订单总额",
            "readonly": true
          },
          {
            "label": "参考应分金额",
            "type": "数字",
            "required": false,
            "hint": "累计消费 × 分成比例,仅供运营对账参考,实际发放线下 Excel 处理",
            "readonly": true
          }
        ]
      }
    ]
  },
  "home": {
    "groups": [
      {
        "title": "顶部主图区字段",
        "fields": [
          {
            "label": "背景图",
            "type": "图片",
            "required": true,
            "hint": "建议雪山/沙漠/草原横版,≤ 1MB",
            "readonly": false
          },
          {
            "label": "主标题第 1 行",
            "type": "文本",
            "required": true,
            "hint": "≤ 10 字,例:\"在新疆\"",
            "readonly": false
          },
          {
            "label": "主标题第 2 行",
            "type": "文本",
            "required": true,
            "hint": "≤ 10 字,例:\"本地人\"",
            "readonly": false
          },
          {
            "label": "主标题第 3 行",
            "type": "文本",
            "required": true,
            "hint": "≤ 10 字,例:\"一样活几天\"",
            "readonly": false
          },
          {
            "label": "副标题",
            "type": "文本",
            "required": true,
            "hint": "≤ 40 字,例:\"不赶景点、不进购物店。有问题,先问在地的人。\"",
            "readonly": false
          },
          {
            "label": "天气数据源",
            "type": "下拉",
            "required": true,
            "hint": "心知天气 / 和风天气",
            "readonly": false,
            "options": [
              "心知天气",
              "和风天气"
            ]
          },
          {
            "label": "天气 API Key",
            "type": "文本",
            "required": true,
            "hint": "从对应服务商后台获取",
            "readonly": false
          },
          {
            "label": "天气默认城市",
            "type": "下拉",
            "required": true,
            "hint": "未定位时的兜底城市",
            "readonly": false
          }
        ]
      },
      {
        "title": "会员卡横条字段",
        "fields": [
          {
            "label": "横条文案",
            "type": "文本",
            "required": true,
            "hint": "例:\"免费成为 in 旅友 · 本地人帮你规划 · 认证好店到店即享\"",
            "readonly": false
          },
          {
            "label": "角标文案",
            "type": "文本",
            "required": false,
            "hint": "例:\"限量 · 今日剩 5 名\"",
            "readonly": false
          },
          {
            "label": "跳转目标",
            "type": "下拉",
            "required": true,
            "hint": "默认会员中心",
            "readonly": false
          }
        ]
      },
      {
        "title": "快捷入口字段 (4 个图标)",
        "fields": [
          {
            "label": "图标 SVG",
            "type": "图片",
            "required": true,
            "hint": "≤ 50KB",
            "readonly": false
          },
          {
            "label": "名称",
            "type": "文本",
            "required": true,
            "hint": "≤ 6 字,例:\"热门玩法\"",
            "readonly": false
          },
          {
            "label": "跳转目标",
            "type": "下拉",
            "required": true,
            "hint": "从下列页选:热门玩法 / 本地美食 / 热门目的地 / 活动日历 / 同游",
            "readonly": false,
            "options": [
              "热门玩法",
              "本地美食",
              "热门目的地",
              "活动日历",
              "同游"
            ]
          },
          {
            "label": "排序",
            "type": "数字",
            "required": true,
            "hint": "1-4",
            "readonly": false
          }
        ]
      },
      {
        "title": "4 大板块内容池 (每板块独立配置)",
        "fields": [
          {
            "label": "板块名",
            "type": "文本",
            "required": true,
            "hint": "≤ 20 字(可覆盖默认)",
            "readonly": false
          },
          {
            "label": "副标题",
            "type": "文本",
            "required": true,
            "hint": "≤ 40 字,例:\"先挑对的人 · 纯玩不进店 · 认证向导亲带\"",
            "readonly": false
          },
          {
            "label": "上榜项",
            "type": "列表",
            "required": true,
            "hint": "从挂载对象中选,支持拖拽排序",
            "readonly": false
          },
          {
            "label": "\"全部\"跳转",
            "type": "下拉",
            "required": true,
            "hint": "对应\"全部 →\"按钮的目标页",
            "readonly": false
          },
          {
            "label": "状态",
            "type": "开关",
            "required": true,
            "hint": "上架 / 下架",
            "readonly": false,
            "options": [
              "上架",
              "下架"
            ]
          }
        ]
      }
    ]
  },
  "notify": {
    "groups": [
      {
        "title": "订阅消息模板字段",
        "fields": [
          {
            "label": "模板名",
            "type": "文本",
            "required": true,
            "hint": "≤ 30 字",
            "readonly": false
          },
          {
            "label": "触发时机",
            "type": "下拉",
            "required": true,
            "hint": "报名成功 / 活动开始前 24h / 活动变更 / 打卡成功 / 评价提醒 / 用户自发活动审核结果 / 订单发货",
            "readonly": false,
            "options": [
              "报名成功",
              "活动开始前 24h",
              "活动变更",
              "打卡成功",
              "评价提醒",
              "用户自发活动审核结果",
              "订单发货"
            ]
          },
          {
            "label": "微信订阅消息模板 ID",
            "type": "文本",
            "required": true,
            "hint": "从微信公众平台复制",
            "readonly": true
          },
          {
            "label": "变量映射",
            "type": "列表",
            "required": true,
            "hint": "模板占位符 → 系统字段",
            "readonly": false
          },
          {
            "label": "状态",
            "type": "开关",
            "required": true,
            "hint": "启用 / 停用",
            "readonly": false,
            "options": [
              "启用",
              "停用"
            ]
          }
        ]
      }
    ]
  },
  "service": {
    "groups": [
      {
        "title": "AI in向导配置",
        "fields": [
          {
            "label": "悬浮球开关",
            "type": "开关",
            "required": true,
            "hint": "一期默认开启",
            "readonly": false
          },
          {
            "label": "AI 服务商",
            "type": "下拉",
            "required": true,
            "hint": "DeepSeek / GPT-4 / Claude(技术侧配置,一期起步 DeepSeek)",
            "readonly": false,
            "options": [
              "DeepSeek",
              "GPT-4",
              "Claude"
            ]
          },
          {
            "label": "知识库同步频率",
            "type": "下拉",
            "required": true,
            "hint": "每小时 / 每天 / 手动",
            "readonly": false,
            "options": [
              "每小时",
              "每天",
              "手动"
            ]
          },
          {
            "label": "未命中兜底",
            "type": "下拉",
            "required": true,
            "hint": "直接转人工 / 请用户再问一次",
            "readonly": false,
            "options": [
              "直接转人工",
              "请用户再问一次"
            ]
          },
          {
            "label": "月成本预算",
            "type": "数字",
            "required": true,
            "hint": "单位:元,默认 100;超预算自动降级到\"转人工\"回复",
            "readonly": false
          }
        ]
      },
      {
        "title": "企微客服号配置",
        "fields": [
          {
            "label": "客服企微二维码",
            "type": "图片",
            "required": true,
            "hint": "≤ 500KB",
            "readonly": false
          },
          {
            "label": "客服号显示名",
            "type": "文本",
            "required": true,
            "hint": "≤ 20 字",
            "readonly": false
          },
          {
            "label": "服务时间说明",
            "type": "文本",
            "required": false,
            "hint": "≤ 100 字",
            "readonly": false
          }
        ]
      }
    ]
  },
  "city": {
    "groups": [
      {
        "title": "城市字段",
        "fields": [
          {
            "label": "城市名",
            "type": "文本",
            "required": true,
            "hint": "≤ 20 字",
            "readonly": false
          },
          {
            "label": "城市代码",
            "type": "文本",
            "required": true,
            "hint": "唯一,字母数字,例:urumqi",
            "readonly": false
          },
          {
            "label": "状态",
            "type": "开关",
            "required": true,
            "hint": "启用 / 停用",
            "readonly": false,
            "options": [
              "启用",
              "停用"
            ]
          },
          {
            "label": "封面图",
            "type": "图片",
            "required": false,
            "hint": "启用状态必填",
            "readonly": false
          },
          {
            "label": "商圈列表",
            "type": "列表",
            "required": true,
            "hint": "每条:商圈名 ≤ 20 字,至少 1 个",
            "readonly": false
          },
          {
            "label": "排序",
            "type": "数字",
            "required": true,
            "hint": "数字越小越前",
            "readonly": false
          }
        ]
      }
    ]
  },
  "account": {
    "groups": [
      {
        "title": "账号字段",
        "fields": [
          {
            "label": "账号名",
            "type": "文本",
            "required": true,
            "hint": "≤ 20 字,唯一",
            "readonly": false
          },
          {
            "label": "姓名",
            "type": "文本",
            "required": true,
            "hint": "≤ 20 字",
            "readonly": false
          },
          {
            "label": "手机号",
            "type": "文本",
            "required": true,
            "hint": "登录短信验证用",
            "readonly": false
          },
          {
            "label": "角色",
            "type": "下拉",
            "required": true,
            "hint": "超级管理员 / 运营人员 / 管理层",
            "readonly": false,
            "options": [
              "超级管理员",
              "运营人员",
              "管理层"
            ]
          },
          {
            "label": "授权城市",
            "type": "多选",
            "required": true,
            "hint": "从启用城市中选;管理层不限制,默认全部",
            "readonly": false
          },
          {
            "label": "状态",
            "type": "开关",
            "required": true,
            "hint": "启用 / 停用",
            "readonly": false,
            "options": [
              "启用",
              "停用"
            ]
          }
        ]
      }
    ]
  },
  "checkin": {
    "groups": [
      {
        "title": "核销规则字段",
        "fields": [
          {
            "label": "评价推送延迟",
            "type": "数字",
            "required": true,
            "hint": "3 小时",
            "readonly": false
          },
          {
            "label": "评价确认有效期",
            "type": "数字",
            "required": true,
            "hint": "24 小时",
            "readonly": false
          },
          {
            "label": "每人每店日限打卡次数",
            "type": "整数",
            "required": true,
            "hint": "1",
            "readonly": false
          }
        ]
      },
      {
        "title": "核销记录列表 (只读)",
        "fields": []
      }
    ]
  }
};
