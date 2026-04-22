const concertData = {
  hotRecommendations: [
    {
      id: 1,
      name: "周杰伦 2024 嘉年华世界巡回演唱会",
      artist: "周杰伦",
      date: "2024-06-15",
      time: "19:30",
      venue: "北京工人体育场",
      city: "北京",
      price: 880,
      maxPrice: 2880,
      image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=周杰伦演唱会舞台海报%2C%20嘉年华主题%2C%20华丽灯光效果%2C%20演唱会宣传图&image_size=square_hd",
      tags: ["热门", "售罄预警"],
      description: "华语乐坛天王周杰伦2024嘉年华世界巡回演唱会，带你重温经典，见证奇迹！"
    },
    {
      id: 2,
      name: "林俊杰 JJ20 世界巡回演唱会",
      artist: "林俊杰",
      date: "2024-07-20",
      time: "20:00",
      venue: "上海梅赛德斯奔驰文化中心",
      city: "上海",
      price: 680,
      maxPrice: 1880,
      image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=林俊杰演唱会舞台%2C%20JJ20主题%2C%20绚丽舞台设计%2C%20演唱会宣传海报&image_size=square_hd",
      tags: ["热门"],
      description: "JJ出道20周年纪念演唱会，精选20年经典曲目，打造视听盛宴！"
    },
    {
      id: 3,
      name: "邓紫棋 I AM GLORIA 世界巡回演唱会",
      artist: "邓紫棋",
      date: "2024-08-10",
      time: "19:00",
      venue: "广州天河体育中心",
      city: "广州",
      price: 580,
      maxPrice: 1680,
      image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=邓紫棋演唱会%2C%20GLORIA主题%2C%20震撼舞台效果%2C%20演唱会宣传图&image_size=square_hd",
      tags: ["火爆预售"],
      description: "亚洲天后邓紫棋全新巡演，展现天后魅力，唱响全亚洲！"
    }
  ],
  concerts: [
    {
      id: 1,
      name: "周杰伦 2024 嘉年华世界巡回演唱会",
      artist: "周杰伦",
      date: "2024-06-15",
      time: "19:30",
      venue: "北京工人体育场",
      city: "北京",
      price: 880,
      maxPrice: 2880,
      image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=周杰伦演唱会舞台海报%2C%20嘉年华主题%2C%20华丽灯光效果%2C%20演唱会宣传图&image_size=square_hd",
      tags: ["热门", "售罄预警"],
      description: "华语乐坛天王周杰伦2024嘉年华世界巡回演唱会，带你重温经典，见证奇迹！",
      seats: [
        { area: "内场A区", price: 2880, available: 120 },
        { area: "内场B区", price: 2280, available: 200 },
        { area: "看台VIP", price: 1580, available: 300 },
        { area: "看台A区", price: 1280, available: 500 },
        { area: "看台B区", price: 880, available: 800 }
      ]
    },
    {
      id: 2,
      name: "林俊杰 JJ20 世界巡回演唱会",
      artist: "林俊杰",
      date: "2024-07-20",
      time: "20:00",
      venue: "上海梅赛德斯奔驰文化中心",
      city: "上海",
      price: 680,
      maxPrice: 1880,
      image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=林俊杰演唱会舞台%2C%20JJ20主题%2C%20绚丽舞台设计%2C%20演唱会宣传海报&image_size=square_hd",
      tags: ["热门"],
      description: "JJ出道20周年纪念演唱会，精选20年经典曲目，打造视听盛宴！",
      seats: [
        { area: "内场VIP", price: 1880, available: 150 },
        { area: "内场A区", price: 1480, available: 250 },
        { area: "看台VIP", price: 1280, available: 400 },
        { area: "看台A区", price: 980, available: 600 },
        { area: "看台B区", price: 680, available: 1000 }
      ]
    },
    {
      id: 3,
      name: "邓紫棋 I AM GLORIA 世界巡回演唱会",
      artist: "邓紫棋",
      date: "2024-08-10",
      time: "19:00",
      venue: "广州天河体育中心",
      city: "广州",
      price: 580,
      maxPrice: 1680,
      image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=邓紫棋演唱会%2C%20GLORIA主题%2C%20震撼舞台效果%2C%20演唱会宣传图&image_size=square_hd",
      tags: ["火爆预售"],
      description: "亚洲天后邓紫棋全新巡演，展现天后魅力，唱响全亚洲！",
      seats: [
        { area: "内场VIP", price: 1680, available: 180 },
        { area: "内场A区", price: 1280, available: 300 },
        { area: "看台VIP", price: 980, available: 500 },
        { area: "看台A区", price: 780, available: 700 },
        { area: "看台B区", price: 580, available: 1200 }
      ]
    },
    {
      id: 4,
      name: "薛之谦 天外来物 巡回演唱会",
      artist: "薛之谦",
      date: "2024-06-22",
      time: "19:30",
      venue: "深圳大运中心体育场",
      city: "深圳",
      price: 517,
      maxPrice: 1717,
      image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=薛之谦演唱会%2C%20天外来物主题%2C%20科幻舞台设计%2C%20演唱会宣传海报&image_size=square_hd",
      tags: ["热销"],
      description: "薛之谦天外来物巡回演唱会，用音乐讲述奇幻故事，带来沉浸式体验！",
      seats: [
        { area: "内场VIP", price: 1717, available: 200 },
        { area: "内场A区", price: 1317, available: 350 },
        { area: "看台VIP", price: 1017, available: 550 },
        { area: "看台A区", price: 717, available: 800 },
        { area: "看台B区", price: 517, available: 1500 }
      ]
    },
    {
      id: 5,
      name: "华晨宇 火星演唱会",
      artist: "华晨宇",
      date: "2024-09-15",
      time: "19:30",
      venue: "杭州奥体中心体育场",
      city: "杭州",
      price: 380,
      maxPrice: 1280,
      image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=华晨宇演唱会%2C%20火星主题%2C%20红色灯光效果%2C%20演唱会宣传图&image_size=square_hd",
      tags: ["火星狂欢"],
      description: "华晨宇火星演唱会，音乐鬼才带你进入他的音乐世界，感受独特魅力！",
      seats: [
        { area: "内场VIP", price: 1280, available: 220 },
        { area: "内场A区", price: 980, available: 400 },
        { area: "看台VIP", price: 780, available: 600 },
        { area: "看台A区", price: 580, available: 900 },
        { area: "看台B区", price: 380, available: 1800 }
      ]
    },
    {
      id: 6,
      name: "陈奕迅 Fear and Dreams 世界巡回演唱会",
      artist: "陈奕迅",
      date: "2024-10-26",
      time: "20:00",
      venue: "成都凤凰山体育公园专业足球场",
      city: "成都",
      price: 480,
      maxPrice: 1880,
      image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=陈奕迅演唱会%2C%20Fear%20and%20Dreams主题%2C%20艺术舞台设计%2C%20演唱会宣传海报&image_size=square_hd",
      tags: ["经典重现"],
      description: "歌神陈奕迅全新巡演，Fear and Dreams主题，用歌声讲述人生故事！",
      seats: [
        { area: "内场VIP", price: 1880, available: 160 },
        { area: "内场A区", price: 1480, available: 280 },
        { area: "看台VIP", price: 1180, available: 450 },
        { area: "看台A区", price: 880, available: 700 },
        { area: "看台B区", price: 480, available: 1300 }
      ]
    },
    {
      id: 7,
      name: "鹿晗 2024 三巡演唱会",
      artist: "鹿晗",
      date: "2024-11-09",
      time: "19:30",
      venue: "南京奥体中心体育场",
      city: "南京",
      price: 420,
      maxPrice: 1377,
      image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=鹿晗演唱会%2C%20三巡主题%2C%20青春活力舞台%2C%20演唱会宣传图&image_size=square_hd",
      tags: ["青春回忆"],
      description: "鹿晗2024三巡演唱会，舞台王者归来，展现最完美的舞台表演！",
      seats: [
        { area: "内场VIP", price: 1377, available: 250 },
        { area: "内场A区", price: 1077, available: 400 },
        { area: "看台VIP", price: 877, available: 600 },
        { area: "看台A区", price: 677, available: 900 },
        { area: "看台B区", price: 420, available: 1500 }
      ]
    },
    {
      id: 8,
      name: "汪苏泷 世纪派对 巡回演唱会",
      artist: "汪苏泷",
      date: "2024-12-14",
      time: "19:30",
      venue: "武汉光谷国际网球中心",
      city: "武汉",
      price: 380,
      maxPrice: 1280,
      image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=汪苏泷演唱会%2C%20世纪派对主题%2C%20欢乐舞台氛围%2C%20演唱会宣传海报&image_size=square_hd",
      tags: ["青春派对"],
      description: "汪苏泷世纪派对巡回演唱会，带你回到青春时光，一起嗨翻全场！",
      seats: [
        { area: "内场VIP", price: 1280, available: 200 },
        { area: "内场A区", price: 980, available: 350 },
        { area: "看台VIP", price: 780, available: 550 },
        { area: "看台A区", price: 580, available: 850 },
        { area: "看台B区", price: 380, available: 1400 }
      ]
    }
  ],
  artists: [
    { id: 1, name: "周杰伦", city: "北京", genre: "流行", concerts: 2 },
    { id: 2, name: "林俊杰", city: "上海", genre: "流行", concerts: 1 },
    { id: 3, name: "邓紫棋", city: "广州", genre: "流行", concerts: 1 },
    { id: 4, name: "薛之谦", city: "深圳", genre: "流行", concerts: 1 },
    { id: 5, name: "华晨宇", city: "杭州", genre: "流行/摇滚", concerts: 1 },
    { id: 6, name: "陈奕迅", city: "成都", genre: "流行", concerts: 1 },
    { id: 7, name: "鹿晗", city: "南京", genre: "流行", concerts: 1 },
    { id: 8, name: "汪苏泷", city: "武汉", genre: "流行", concerts: 1 }
  ],
  cities: [
    { id: 1, name: "北京", code: "beijing" },
    { id: 2, name: "上海", code: "shanghai" },
    { id: 3, name: "广州", code: "guangzhou" },
    { id: 4, name: "深圳", code: "shenzhen" },
    { id: 5, name: "杭州", code: "hangzhou" },
    { id: 6, name: "成都", code: "chengdu" },
    { id: 7, name: "南京", code: "nanjing" },
    { id: 8, name: "武汉", code: "wuhan" },
    { id: 9, name: "西安", code: "xian" },
    { id: 10, name: "重庆", code: "chongqing" }
  ]
};

export default concertData;
