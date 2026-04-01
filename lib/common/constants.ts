export enum Type {
  Filetype = 1, //文件
  Threaddbtype, //数据库
}

// cid是否需要连接节点
export const cidNeedConnect = {
  NEED: 0,
  NOT_NEED: 1,
};

// openFlag 开放标志 
export enum OpenFlag {
  PUBLIC = 0, //公开 任何人可以读写,不建议使用,评论所产生的空间使用都由创建者承担
  PRIVATE = 1,//私密 只有拥有者可以读写
  AUTH = 2, //需要对评论进行鉴权，主要用于私聊群组，或者内部共享群组，对访问主题进行权限设置，有权限的用户才能访问
  AUTH_WRITE = 3, //需要对评论进行写鉴权,任何人都可以读
  REPORTED = 4, //被举报
}


export enum AIProxyUserPermission {
  QUERY = 8, //查询
  ADMIN = 4, //管理员
}


/**
 * 主题的操作权限
 */
export enum ThemePermission {
  /** 无权限 */
  NONE = 0,
  /** 申请权限 */
  APPLY,
  /** 读权限 */
  READ,
  /** 写权限 */
  WRITE,
  /** 管理员权限 */
  ADMIN,
  /** 
   * 只写权限
   * 不允许用户修改remark或者物联网设备上报数据使用
   * 权限后面跟随分组列表,以逗号分隔
   */
  ONLY_WRITE,
  /** 物联网管理人员相关权限,具体权限后续可扩展 */
  DEVICE,
  /** 不存在 */
  NOT_EXIST,
  /** 查询权限,系统可以查询数据,用户只能查询自己的授权数据 */
  QUERY
}

export const QWEN_VOICE_OPTIONS = [
  { value: "Tina", label: "甜甜 Tina", desc: "我的声音像温热的奶茶，甜甜的..." },
  { value: "Cindy", label: "林欣宜 Cindy", desc: "台湾说话嗲嗲的小姐姐" },
  { value: "Liora Mira", label: "清欢 Liora Mira", desc: "用声音织就烟火人间的温柔" },
  { value: "Sunnybobi", label: "知芝 Sunnybobi", desc: "大大咧咧的社恐邻家姑娘" },
  { value: "Raymond", label: "林川野 Raymond", desc: "声音清亮，爱吃外卖的宅男" },
  { value: "Ethan", label: "晨煦 Ethan", desc: "标准普通话，带部分北方口音。阳光 温暖 活力 朝气" },
  { value: "Theo Calm", label: "予安 Theo Calm", desc: "在静默处传递理解，在言语间疗愈人心。" },
  { value: "Serena", label: "苏瑶 Serena", desc: "温柔小姐姐" },
  { value: "Harvey", label: "厚 Harvey", desc: "低沉、温和，带着一点咖啡与旧书的气息。" },
  { value: "Maia", label: "四月 Maia", desc: "知性与温柔的碰撞" },
  { value: "Evan", label: "江晨 Evan", desc: "男大学生，年下奶狗" },
  { value: "Qiao", label: "小乔妹 Qiao", desc: "表面甜妹，个性十足" },
  { value: "Momo", label: "茉兔 Momo", desc: "撒娇搞怪，逗你开心" },
  { value: "Wil", label: "伟伦 Wil", desc: "在深圳长大的港台腔小哥哥" },
  { value: "Angel", label: "台普 - 安琪 Angel", desc: "略带台式口音，她超甜的哦！" },
  { value: "Li Cassian", label: "东厂 - 李公公 Li Cassian", desc: "话中三分留白、七分察言观色" },
  { value: "Mia", label: "温柔生活博主 - 舒然 Mia", desc: "传递慢生活美学与日常治愈力量" },
  { value: "Joyner", label: "喜剧担当 - 阿逗 Joyner", desc: "搞笑、夸张、接地气" },
  { value: "Gold", label: "金爷 Gold", desc: "西海岸黑人 Rapper" },
  { value: "Katerina", label: "卡捷琳娜 Katerina", desc: "御姐音色，韵律回味十足" },
  { value: "Ryan", label: "甜茶 Ryan", desc: "节奏拉满，戏感炸裂，真实与张力共舞" },
  { value: "Jennifer", label: "詹妮弗 Jennifer", desc: "品牌级、电影质感般美语女声" },
  { value: "Aiden", label: "艾登 Aiden", desc: "精通厨艺的美语大男孩" },
  { value: "Mione", label: "敏儿 Mione", desc: "成熟，知性英国邻家妹妹" },
  { value: "Sunny", label: "四川 - 晴儿 Sunny", desc: "甜到你心里的川妹子" },
  { value: "Dylan", label: "北京 - 晓东 Dylan", desc: "北京胡同里长大的少年" },
  { value: "Eric", label: "四川 - 程川 Eric", desc: "一个跳脱市井的四川成都男子" },
  { value: "Peter", label: "天津 - 李彼得 Peter", desc: "天津相声，专业捧哏" },
  { value: "Joseph Chen", label: "阿樸伯 Joseph Chen", desc: "本名陳志樸，南洋老華僑" },
  { value: "Marcus", label: "陕西 - 秦川 Marcus", desc: "面宽话短，心实声沉" },
  { value: "Li", label: "南京 - 老李 Li", desc: "骂骂咧咧的伯伯" },
  { value: "Rocky", label: "粤语 - 阿强 Rocky", desc: "幽默风趣的阿强，在线陪聊" },
  { value: "Sohee", label: "素熙 Sohee", desc: "温柔开朗，情绪丰富的韩国欧尼" },
  { value: "Lenn", label: "莱恩 Lenn", desc: "穿西装也听后朋克的德国青年" },
  { value: "Ono Anna", label: "小野杏 Ono Anna", desc: "鬼灵精怪的青梅竹马" },
  { value: "Sonrisa", label: "索尼莎 Sonrisa", desc: "热情开朗的拉美大姐" },
  { value: "Bodega", label: "博德加 Bodega", desc: "热情的西班牙大叔" },
  { value: "Emilien", label: "埃米尔安 Emilien", desc: "浪漫的法国大哥哥" },
  { value: "Andre", label: "安德雷 Andre", desc: "声音磁性，自然舒服、沉稳男生" },
  { value: "Radio Gol", label: "拉迪奥·戈尔 Radio Gol", desc: "足球诗人，激情解说" },
  { value: "Alek", label: "阿列克 Alek", desc: "战斗民族的冷与毛呢大衣下的暖" },
  { value: "Rizky", label: "阿力 Rizky", desc: "印尼的青年小伙，声线个性" },
  { value: "Roya", label: "萝雅 Roya", desc: "热爱运动的女孩，自由的心" },
  { value: "Arda", label: "阿尔达 Arda", desc: "干净利落中带着温润的气质" },
  { value: "Hana", label: "阿幸 Hana", desc: "爱狗狗的越南成熟姐姐" },
  { value: "Dolce", label: "多尔切 Dolce", desc: "慵懒的意大利大叔" },
  { value: "Jakub", label: "雅克 Jakub", desc: "波兰小镇文艺青年" },
  { value: "Griet", label: "海娜 Griet", desc: "荷兰成熟又文艺的女性" },
  { value: "Eliška", label: "艾莉卡 Eliška", desc: "传递中欧的匠心与温度" },
  { value: "Marina", label: "玛丽娜 Marina", desc: "在多元文化城市中长大的女孩" },
  { value: "Siiri", label: "西芮 Siiri", desc: "内敛温柔，语速舒缓" },
  { value: "Ingrid", label: "林恩 Ingrid", desc: "挪威乡村姑娘" },
  { value: "Sigga", label: "海娜 Sigga", desc: "冰岛小镇的知性女青年" },
  { value: "Bea", label: "雅娜 Bea", desc: "爱喝咖啡的菲律宾小姐姐" },
  { value: "Chloe", label: "思怡 Chloe", desc: "马来西亚白领女生" }
];

