<template lang="html">
    <div class="play">
        <div class="play-header">
            <h2 class="section-title">玩乐</h2>
        </div>

        <div class="attractions">
            <h3 class="subtitle">同城必玩景点</h3>
            <div class="attractions-slider">
                <div 
                    class="attraction-item" 
                    v-for="item in attractions" 
                    :key="item.id"
                    @click="goToAttractionDetail(item)"
                >
                    <div class="attraction-img-wrapper">
                        <img :src="item.img" :alt="item.title">
                    </div>
                    <div class="attraction-info">
                        <p class="attraction-title">{{item.title}}</p>
                        <p class="attraction-rating">
                            <span class="score">{{item.score}}</span>分 | {{item.comments}}条评价
                        </p>
                        <div class="price-section">
                            <span class="price" v-if="item.price > 0">¥{{item.price}}起</span>
                            <span class="price free" v-else>免费</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="performance">
            <h3 class="subtitle">精彩演出</h3>
            <div class="performance-tabs">
                <span 
                    class="performance-tab" 
                    :class="{'active': performanceTab === 'recommend'}"
                    @click="switchPerformanceTab('recommend')"
                >推荐排序</span>
                <span 
                    class="performance-tab" 
                    :class="{'active': performanceTab === 'discount'}"
                    @click="switchPerformanceTab('discount')"
                >限时优惠</span>
                <span 
                    class="performance-tab" 
                    :class="{'active': performanceTab === 'earlybird'}"
                    @click="switchPerformanceTab('earlybird')"
                >早鸟票</span>
            </div>
            <div class="performance-list">
                <div 
                    class="performance-item" 
                    v-for="item in filteredPerformance" 
                    :key="item.id"
                    @click="goToPerformanceDetail(item)"
                >
                    <div class="performance-img">
                        <img :src="item.img" :alt="item.title">
                        <div class="tag" v-if="item.tag">{{item.tag}}</div>
                    </div>
                    <div class="performance-info">
                        <h4 class="performance-title">{{item.title}}</h4>
                        <p class="performance-type">{{item.type}}</p>
                        <p class="performance-time"><i class="icon-time"></i>{{item.showTime}}</p>
                        <p class="performance-venue"><i class="icon-location"></i>{{item.venue}}</p>
                        <div class="price-section">
                            <div class="price-left">
                                <span class="price">¥{{item.minPrice}}起</span>
                                <div class="discount" v-if="item.discount">
                                    <span class="discount-tag">{{item.discount}}折</span>
                                    <span class="original-price">¥{{item.originalPrice}}</span>
                                </div>
                            </div>
                            <button class="buy-btn" @click.stop="handleBuyPerformance(item)">购票</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="nearby">
            <h3 class="subtitle">附近玩乐</h3>
            
            <div class="filter-section">
                <div class="filter-item">
                    <span class="filter-label">附近</span>
                    <div class="filter-options">
                        <span 
                            class="filter-option" 
                            :class="{'active': selectedDistance === '全城'}"
                            @click="selectDistance('全城')"
                        >全城</span>
                        <span 
                            class="filter-option" 
                            :class="{'active': selectedDistance === '1km'}"
                            @click="selectDistance('1km')"
                        >1km</span>
                        <span 
                            class="filter-option" 
                            :class="{'active': selectedDistance === '3km'}"
                            @click="selectDistance('3km')"
                        >3km</span>
                        <span 
                            class="filter-option" 
                            :class="{'active': selectedDistance === '5km'}"
                            @click="selectDistance('5km')"
                        >5km</span>
                    </div>
                </div>
                
                <div class="filter-item">
                    <span class="filter-label">分类</span>
                    <div class="filter-options">
                        <span 
                            class="filter-option" 
                            :class="{'active': selectedCategory === '全部'}"
                            @click="selectCategory('全部')"
                        >全部</span>
                        <span 
                            class="filter-option" 
                            :class="{'active': selectedCategory === 'KTV'}"
                            @click="selectCategory('KTV')"
                        >KTV</span>
                        <span 
                            class="filter-option" 
                            :class="{'active': selectedCategory === '桌游'}"
                            @click="selectCategory('桌游')"
                        >桌游</span>
                        <span 
                            class="filter-option" 
                            :class="{'active': selectedCategory === '密室逃脱'}"
                            @click="selectCategory('密室逃脱')"
                        >密室逃脱</span>
                        <span 
                            class="filter-option" 
                            :class="{'active': selectedCategory === '剧本杀'}"
                            @click="selectCategory('剧本杀')"
                        >剧本杀</span>
                        <span 
                            class="filter-option" 
                            :class="{'active': selectedCategory === '电竞'}"
                            @click="selectCategory('电竞')"
                        >电竞</span>
                    </div>
                </div>
                
                <div class="filter-item">
                    <span class="filter-label">推荐排序</span>
                    <div class="filter-options">
                        <span 
                            class="filter-option" 
                            :class="{'active': selectedSort === '综合排序'}"
                            @click="selectSort('综合排序')"
                        >综合排序</span>
                        <span 
                            class="filter-option" 
                            :class="{'active': selectedSort === '好评优先'}"
                            @click="selectSort('好评优先')"
                        >好评优先</span>
                        <span 
                            class="filter-option" 
                            :class="{'active': selectedSort === '距离最近'}"
                            @click="selectSort('距离最近')"
                        >距离最近</span>
                        <span 
                            class="filter-option" 
                            :class="{'active': selectedSort === '价格最低'}"
                            @click="selectSort('价格最低')"
                        >价格最低</span>
                    </div>
                </div>
            </div>

            <div class="nearby-list">
                <div 
                    class="nearby-item" 
                    v-for="item in filteredNearby" 
                    :key="item.id"
                    @click="goToNearbyDetail(item)"
                >
                    <div class="nearby-img">
                        <img :src="item.img" :alt="item.title">
                    </div>
                    <div class="nearby-info">
                        <h4 class="nearby-title">{{item.title}}</h4>
                        <div class="nearby-rating">
                            <span class="score">{{item.score}}</span>分
                            <span class="comments">{{item.comments}}条评价</span>
                        </div>
                        <p class="nearby-category">{{item.category}}</p>
                        <p class="nearby-distance"><i class="icon-location"></i>{{item.distance}}</p>
                        <div class="price-section">
                            <span class="price">¥{{item.price}}/人</span>
                            <button class="buy-btn" @click.stop="handleViewNearby(item)">查看</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="empty-tip" v-if="filteredNearby.length === 0">
                <p>暂无符合条件的商家</p>
                <button class="reset-btn" @click="resetFilters">重置筛选条件</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Play",
    created() {
        this.$store.commit("changeHt", "玩乐");
    },
    data() {
        return {
            performanceTab: "recommend",
            selectedDistance: "全城",
            selectedCategory: "全部",
            selectedSort: "综合排序",
            attractions: [
                {
                    id: 101,
                    title: "故宫博物院",
                    img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=北京故宫博物院紫禁城古建筑群&image_size=square",
                    score: 4.9,
                    comments: 12580,
                    price: 60,
                    description: "故宫博物院是中国最大的古代文化艺术博物馆，建立于1925年10月10日，位于北京故宫紫禁城内。它不仅是明清两代的皇家宫殿，也是中国古代宫廷建筑的精华。",
                    address: "北京市东城区景山前街4号",
                    openTime: "08:30-17:00",
                    phone: "010-85007421",
                    tags: ["5A景区", "历史古迹", "文化遗产"],
                    ticketTypes: [
                        { type: "成人票", price: 60, available: 500 },
                        { type: "学生票", price: 20, available: 300 },
                        { type: "老人票", price: 30, available: 200 }
                    ]
                },
                {
                    id: 102,
                    title: "八达岭长城",
                    img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=北京八达岭长城风景&image_size=square",
                    score: 4.8,
                    comments: 8920,
                    price: 40,
                    description: "八达岭长城是明长城中保存最好的一段，也是最具代表性的一段，是明代长城的精华。它建于1504年，是明长城中最早开放的地段。",
                    address: "北京市延庆区八达岭镇",
                    openTime: "06:30-19:00",
                    phone: "010-69121226",
                    tags: ["5A景区", "世界文化遗产", "自然风光"],
                    ticketTypes: [
                        { type: "成人票", price: 40, available: 800 },
                        { type: "学生票", price: 20, available: 400 }
                    ]
                },
                {
                    id: 103,
                    title: "上海迪士尼乐园",
                    img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=上海迪士尼乐园城堡烟花表演&image_size=square",
                    score: 4.7,
                    comments: 15680,
                    price: 399,
                    description: "上海迪士尼乐园是中国内地首座迪士尼主题乐园，于2016年6月16日正式开园。乐园拥有七大主题园区、两座主题酒店、一座地铁站，并有许多全球首发游乐项目。",
                    address: "上海市浦东新区川沙镇黄赵路310号",
                    openTime: "08:00-22:00",
                    phone: "400-180-0000",
                    tags: ["主题乐园", "亲子游", "网红打卡"],
                    ticketTypes: [
                        { type: "一日票", price: 399, available: 2000 },
                        { type: "两日票", price: 718, available: 1500 },
                        { type: "尊享票", price: 699, available: 500 }
                    ]
                },
                {
                    id: 104,
                    title: "西湖风景区",
                    img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=杭州西湖断桥雷峰塔风景&image_size=square",
                    score: 4.9,
                    comments: 20560,
                    price: 0,
                    description: "西湖是中国大陆首批国家重点风景名胜区和中国十大风景名胜之一。三面环山，一面濒城，杭州因西湖而名扬天下，西湖也因杭州而更加妩媚动人。",
                    address: "浙江省杭州市西湖区",
                    openTime: "全天开放",
                    phone: "0571-87179617",
                    tags: ["5A景区", "世界文化遗产", "自然风光"],
                    ticketTypes: [
                        { type: "景区门票", price: 0, available: 9999 },
                        { type: "游船票", price: 55, available: 500 },
                        { type: "雷峰塔门票", price: 40, available: 800 }
                    ]
                },
                {
                    id: 105,
                    title: "成都大熊猫基地",
                    img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=成都大熊猫基地可爱熊猫&image_size=square",
                    score: 4.8,
                    comments: 18920,
                    price: 55,
                    description: "成都大熊猫繁育研究基地，是中国政府实施大熊猫等濒危野生动物迁地保护工程的主要研究基地之一，国家AAAA级旅游景区。",
                    address: "四川省成都市成华区熊猫大道1375号",
                    openTime: "07:30-18:00",
                    phone: "028-83510033",
                    tags: ["4A景区", "动物保护", "亲子游"],
                    ticketTypes: [
                        { type: "成人票", price: 55, available: 1000 },
                        { type: "学生票", price: 27, available: 500 }
                    ]
                }
            ],
            performances: [
                {
                    id: 201,
                    title: "开心麻花爆笑舞台剧《乌龙山伯爵》",
                    img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=开心麻花舞台剧喜剧表演舞台&image_size=square",
                    type: "话剧·舞台剧",
                    showTime: "2026.04.25-05.10",
                    venue: "海淀剧院",
                    minPrice: 180,
                    maxPrice: 880,
                    tag: "热售中",
                    category: "recommend",
                    discount: null,
                    originalPrice: null,
                    description: "《乌龙山伯爵》是开心麻花的经典剧目，讲述了一个无房无车无存款的三无青年谢蟹，在三十岁生日这天意外得到了一百万美元的支票，由此引发的一系列爆笑故事。",
                    address: "北京市海淀区中关村大街28号",
                    phone: "010-62555188",
                    tags: ["爆笑喜剧", "开心麻花", "经典剧目"],
                    ticketTypes: [
                        { area: "普通区", price: 180, available: 200 },
                        { area: "舒适区", price: 380, available: 150 },
                        { area: "VIP区", price: 580, available: 80 },
                        { area: "至尊VIP", price: 880, available: 30 }
                    ]
                },
                {
                    id: 202,
                    title: "俄罗斯芭蕾舞团《天鹅湖》",
                    img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=芭蕾舞天鹅湖舞台表演优雅&image_size=square",
                    type: "舞蹈芭蕾",
                    showTime: "2026.05.01-05.03",
                    venue: "国家大剧院",
                    minPrice: 280,
                    maxPrice: 1280,
                    tag: "限时优惠",
                    category: "discount",
                    discount: 7.5,
                    originalPrice: 373,
                    description: "俄罗斯圣彼得堡芭蕾舞团带来经典芭蕾舞剧《天鹅湖》，柴可夫斯基的不朽名曲配以优雅的芭蕾舞蹈，为您呈现一场视觉与听觉的双重盛宴。",
                    address: "北京市西城区西长安街2号",
                    phone: "010-66550000",
                    tags: ["经典芭蕾", "俄罗斯舞团", "限时特惠"],
                    ticketTypes: [
                        { area: "池座", price: 280, available: 100 },
                        { area: "一层", price: 480, available: 120 },
                        { area: "二层", price: 680, available: 80 },
                        { area: "三层VIP", price: 1280, available: 40 }
                    ]
                },
                {
                    id: 203,
                    title: "德云社相声专场",
                    img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=德云社相声表演传统艺术&image_size=square",
                    type: "相声曲艺",
                    showTime: "2026.05.15-05.20",
                    venue: "广德楼戏园",
                    minPrice: 99,
                    maxPrice: 580,
                    tag: "早鸟票",
                    category: "earlybird",
                    discount: 8,
                    originalPrice: 124,
                    description: "德云社相声专场，郭德纲弟子倾情出演，传统与现代相结合的相声表演，让您笑足整晚，感受地道的北京相声文化。",
                    address: "北京市西城区大栅栏街39号",
                    phone: "010-63032278",
                    tags: ["德云社", "传统相声", "早鸟特惠"],
                    ticketTypes: [
                        { area: "散座", price: 99, available: 150 },
                        { area: "前排", price: 199, available: 100 },
                        { area: "包厢", price: 380, available: 40 },
                        { area: "VIP包厢", price: 580, available: 20 }
                    ]
                },
                {
                    id: 204,
                    title: "百老汇音乐剧《猫》中文版",
                    img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=音乐剧猫舞台表演奇幻&image_size=square",
                    type: "音乐剧",
                    showTime: "2026.06.01-06.30",
                    venue: "北京保利剧院",
                    minPrice: 380,
                    maxPrice: 1580,
                    tag: "即将开演",
                    category: "recommend",
                    discount: null,
                    originalPrice: null,
                    description: "百老汇经典音乐剧《猫》中文版震撼上演！安德鲁·劳埃德·韦伯的传世之作，讲述了一个杰里科猫族的故事，经典曲目《Memory》将再次感动全场。",
                    address: "北京市东城区东直门南大街14号",
                    phone: "010-65001188",
                    tags: ["百老汇经典", "音乐剧", "中文版"],
                    ticketTypes: [
                        { area: "普通票", price: 380, available: 300 },
                        { area: "优选票", price: 680, available: 200 },
                        { area: "VIP票", price: 980, available: 100 },
                        { area: "至尊VIP", price: 1580, available: 50 }
                    ]
                },
                {
                    id: 205,
                    title: "开心麻花《夏洛特烦恼》",
                    img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=开心麻花夏洛特烦恼舞台剧&image_size=square",
                    type: "话剧·舞台剧",
                    showTime: "2026.05.05-05.20",
                    venue: "朝阳9剧场",
                    minPrice: 150,
                    maxPrice: 680,
                    tag: "限时优惠",
                    category: "discount",
                    discount: 6.8,
                    originalPrice: 221,
                    description: "《夏洛特烦恼》是开心麻花的经典爆笑舞台剧，讲述了一个关于青春、爱情与梦想的故事。主人公夏洛意外穿越回高中时代，由此引发的一系列爆笑情节。",
                    address: "北京市朝阳区文化馆东三环中路34号",
                    phone: "010-85991188",
                    tags: ["开心麻花", "爆笑喜剧", "限时优惠"],
                    ticketTypes: [
                        { area: "普通区", price: 150, available: 180 },
                        { area: "舒适区", price: 280, available: 120 },
                        { area: "VIP区", price: 480, available: 60 },
                        { area: "至尊VIP", price: 680, available: 30 }
                    ]
                },
                {
                    id: 206,
                    title: "儿童剧《冰雪奇缘》",
                    img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=儿童剧冰雪奇缘舞台表演童话&image_size=square",
                    type: "儿童亲子",
                    showTime: "2026.06.01-06.15",
                    venue: "北京天桥艺术中心",
                    minPrice: 120,
                    maxPrice: 480,
                    tag: "早鸟票",
                    category: "earlybird",
                    discount: 7,
                    originalPrice: 171,
                    description: "大型全景互动儿童剧《冰雪奇缘》，根据迪士尼经典动画改编。绚丽的舞台效果、动人的音乐、精彩的互动环节，让小朋友们仿佛置身于冰雪王国。",
                    address: "北京市西城区天桥南大街9号",
                    phone: "010-83322788",
                    tags: ["儿童剧", "亲子互动", "早鸟特惠"],
                    ticketTypes: [
                        { area: "普通票", price: 120, available: 200 },
                        { area: "亲子套票", price: 200, available: 150 },
                        { area: "VIP票", price: 380, available: 80 },
                        { area: "至尊VIP", price: 480, available: 40 }
                    ]
                }
            ],
            nearbyItems: [
                {
                    id: 301,
                    title: "纯K KTV(三里屯店)",
                    img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=豪华KTV包厢装修现代&image_size=square",
                    score: 4.8,
                    comments: 3580,
                    category: "KTV",
                    distance: "800m",
                    price: 168,
                    description: "纯K是国内知名的高端KTV品牌，三里屯店拥有豪华包厢、专业音响设备和海量曲库。提供优质的K歌体验，是朋友聚会、生日派对的首选。",
                    address: "北京市朝阳区工人体育场北路甲6号",
                    phone: "010-65009898",
                    openTime: "10:00-次日06:00",
                    tags: ["豪华包厢", "专业音响", "海量曲库"],
                    packages: [
                        { name: "欢唱3小时套餐", price: 168, include: "小包 + 爆米花 + 饮料2杯" },
                        { name: "黄金场套餐", price: 298, include: "中包 + 啤酒6瓶 + 果盘" },
                        { name: "豪华派对套餐", price: 598, include: "大包 + 啤酒12瓶 + 豪华果盘" }
                    ]
                },
                {
                    id: 302,
                    title: "戏精学院·实景搜证剧本杀",
                    img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=剧本杀实景推理游戏&image_size=square",
                    score: 4.9,
                    comments: 2160,
                    category: "剧本杀",
                    distance: "1.2km",
                    price: 198,
                    description: "戏精学院是专业的实景搜证剧本杀店，拥有多个主题场景和丰富的剧本库。提供专业DM带场、精美服装、沉浸式体验，让您真正体验推理的乐趣。",
                    address: "北京市朝阳区朝外大街乙12号",
                    phone: "010-85656789",
                    openTime: "10:00-次日02:00",
                    tags: ["实景搜证", "沉浸式体验", "专业DM"],
                    packages: [
                        { name: "经典盒装本", price: 198, include: "盒装剧本 + 零食饮料" },
                        { name: "实景搜证本", price: 298, include: "实景主题 + 换装体验 + 专业道具" },
                        { name: "独家限定本", price: 398, include: "独家剧本 + 实景搜证 + 高级道具" }
                    ]
                },
                {
                    id: 303,
                    title: "超级异次元密室逃脱",
                    img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=密室逃脱恐怖场景解谜&image_size=square",
                    score: 4.7,
                    comments: 1890,
                    category: "密室逃脱",
                    distance: "2.3km",
                    price: 158,
                    description: "超级异次元密室逃脱拥有多个主题密室，包括恐怖、悬疑、冒险等多种风格。精致的机关设计、逼真的场景布置、专业的NPC互动，为您带来极致的密室体验。",
                    address: "北京市朝阳区建国路88号",
                    phone: "010-85806677",
                    openTime: "10:00-次日00:00",
                    tags: ["多主题", "机关密室", "NPC互动"],
                    packages: [
                        { name: "微恐主题", price: 158, include: "单主题 + 免费换装" },
                        { name: "中恐主题", price: 228, include: "单主题 + NPC互动 + 换装" },
                        { name: "重恐主题", price: 298, include: "单主题 + 追逐环节 + 专业NPC" }
                    ]
                },
                {
                    id: 304,
                    title: "聚友桌游吧",
                    img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=桌游吧聚会游戏狼人杀&image_size=square",
                    score: 4.6,
                    comments: 1250,
                    category: "桌游",
                    distance: "500m",
                    price: 68,
                    description: "聚友桌游吧拥有超过200款桌游，从经典的狼人杀、三国杀到最新的德式策略游戏应有尽有。提供舒适的游戏环境和专业的桌游讲解，适合朋友聚会。",
                    address: "北京市朝阳区三里屯路19号",
                    phone: "010-64167890",
                    openTime: "10:00-24:00",
                    tags: ["海量桌游", "免费讲解", "舒适环境"],
                    packages: [
                        { name: "单人畅玩", price: 68, include: "全天畅玩 + 免费饮料" },
                        { name: "3人套餐", price: 188, include: "全天畅玩 + 饮料3杯 + 小吃一份" },
                        { name: "5人套餐", price: 298, include: "全天畅玩 + 饮料5杯 + 豪华小吃" }
                    ]
                },
                {
                    id: 305,
                    title: "网鱼电竞网咖",
                    img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=电竞网咖高配置电脑&image_size=square",
                    score: 4.5,
                    comments: 3200,
                    category: "电竞",
                    distance: "600m",
                    price: 18,
                    description: "网鱼电竞网咖是国内知名电竞品牌，拥有高配置游戏电脑、专业电竞椅、千兆光纤网络。提供舒适的游戏环境，是电竞爱好者的天堂。",
                    address: "北京市朝阳区工人体育场北路13号",
                    phone: "010-65512345",
                    openTime: "24小时",
                    tags: ["高配置", "专业电竞", "24小时"],
                    packages: [
                        { name: "普通区", price: 18, include: "每小时单价" },
                        { name: "竞技区", price: 28, include: "每小时单价 + 机械键盘" },
                        { name: "VIP包间", price: 48, include: "每小时单价 + 独立空间" },
                        { name: "通宵套餐", price: 88, include: "22:00-次日10:00 + 免费夜宵" }
                    ]
                },
                {
                    id: 306,
                    title: "唱吧麦颂KTV",
                    img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=时尚KTV包厢灯光效果&image_size=square",
                    score: 4.7,
                    comments: 2890,
                    category: "KTV",
                    distance: "1.8km",
                    price: 128,
                    description: "唱吧麦颂是唱吧旗下KTV品牌，拥有智能点歌系统、专业音响设备。可以通过唱吧APP点歌，还能录制演唱作品分享到社交平台。",
                    address: "北京市朝阳区朝阳门外大街18号",
                    phone: "010-65889988",
                    openTime: "10:00-次日06:00",
                    tags: ["智能点歌", "唱吧联动", "时尚装修"],
                    packages: [
                        { name: "阳光场3小时", price: 128, include: "小包 + 饮料2杯" },
                        { name: "黄金场套餐", price: 268, include: "中包 + 啤酒6瓶 + 果盘" },
                        { name: "派对套餐", price: 498, include: "大包 + 啤酒12瓶 + 豪华果盘 + 小吃" }
                    ]
                },
                {
                    id: 307,
                    title: "推理大师·沉浸式剧本杀",
                    img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=沉浸式剧本杀换装体验&image_size=square",
                    score: 4.9,
                    comments: 4560,
                    category: "剧本杀",
                    distance: "3.1km",
                    price: 258,
                    description: "推理大师是国内顶级剧本杀品牌，拥有独家原创剧本、实景沉浸体验、专业DM团队。提供精美服装、道具和场地布置，让您完全沉浸在剧本世界中。",
                    address: "北京市朝阳区建国路93号",
                    phone: "010-85998877",
                    openTime: "10:00-次日02:00",
                    tags: ["独家剧本", "沉浸式", "换装体验"],
                    packages: [
                        { name: "精品盒装本", price: 258, include: "盒装剧本 + 换装 + 零食饮料" },
                        { name: "实景沉浸本", price: 398, include: "实景场地 + 全服装 + 专业道具" },
                        { name: "独家限定本", price: 528, include: "独家剧本 + 大型实景 + NPC互动" }
                    ]
                },
                {
                    id: 308,
                    title: "第七感·真人密室逃脱",
                    img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=真人密室逃脱机关道具&image_size=square",
                    score: 4.8,
                    comments: 1680,
                    category: "密室逃脱",
                    distance: "2.8km",
                    price: 178,
                    description: "第七感密室逃脱以创意机关和剧情体验著称，每个主题都有完整的故事线。高科技电子机关、逼真场景、专业NPC，让您体验真正的密室逃脱。",
                    address: "北京市朝阳区光华路9号",
                    phone: "010-65007766",
                    openTime: "10:00-23:00",
                    tags: ["创意机关", "剧情密室", "高科技"],
                    packages: [
                        { name: "初级主题", price: 178, include: "单主题 + 免费提示" },
                        { name: "中级主题", price: 238, include: "单主题 + 机关解谜 + 换装" },
                        { name: "高级主题", price: 298, include: "单主题 + NPC互动 + 沉浸式体验" }
                    ]
                }
            ]
        };
    },
    computed: {
        filteredPerformance() {
            if (this.performanceTab === "recommend") {
                return this.performances.filter(item => item.category === "recommend");
            } else if (this.performanceTab === "discount") {
                return this.performances.filter(item => item.category === "discount");
            } else {
                return this.performances.filter(item => item.category === "earlybird");
            }
        },
        filteredNearby() {
            let result = [...this.nearbyItems];
            
            if (this.selectedCategory !== "全部") {
                result = result.filter(item => item.category === this.selectedCategory);
            }
            
            if (this.selectedSort === "好评优先") {
                result.sort((a, b) => b.score - a.score);
            } else if (this.selectedSort === "价格最低") {
                result.sort((a, b) => a.price - b.price);
            } else if (this.selectedSort === "距离最近") {
                result.sort((a, b) => {
                    const getDistance = (d) => {
                        if (d.includes("km")) {
                            return parseFloat(d) * 1000;
                        }
                        return parseFloat(d);
                    };
                    return getDistance(a.distance) - getDistance(b.distance);
                });
            }
            
            return result;
        }
    },
    methods: {
        switchPerformanceTab(tab) {
            this.performanceTab = tab;
        },
        selectDistance(distance) {
            this.selectedDistance = distance;
        },
        selectCategory(category) {
            this.selectedCategory = category;
        },
        selectSort(sort) {
            this.selectedSort = sort;
        },
        resetFilters() {
            this.selectedDistance = "全城";
            this.selectedCategory = "全部";
            this.selectedSort = "综合排序";
        },
        goToAttractionDetail(item) {
            this.$router.push({
                path: '/attraction_detail/' + item.id,
                query: { data: JSON.stringify(item) }
            });
        },
        goToPerformanceDetail(item) {
            this.$router.push({
                path: '/performance_detail/' + item.id,
                query: { data: JSON.stringify(item) }
            });
        },
        goToNearbyDetail(item) {
            this.$router.push({
                path: '/nearby_detail/' + item.id,
                query: { data: JSON.stringify(item) }
            });
        },
        handleBuyPerformance(item) {
            this.goToPerformanceDetail(item);
        },
        handleViewNearby(item) {
            this.goToNearbyDetail(item);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/public.scss";

.play {
    background-color: #f5f5f5;
    min-height: 100vh;
    padding-bottom: 20px;
}

.play-header {
    background-color: #fff;
    padding: 15px;
    margin-bottom: 10px;
}

.section-title {
    font-size: 18px;
    font-weight: bold;
    color: #333;
}

.subtitle {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin-bottom: 12px;
}

.attractions {
    background-color: #fff;
    padding: 15px;
    margin-bottom: 10px;
}

.attractions-slider {
    display: flex;
    overflow-x: auto;
    padding-bottom: 10px;
    scrollbar-width: none;
    -ms-overflow-style: none;
    
    &::-webkit-scrollbar {
        display: none;
    }
}

.attraction-item {
    flex-shrink: 0;
    width: 140px;
    margin-right: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:last-child {
        margin-right: 0;
    }
    
    &:hover {
        transform: translateY(-4px);
        
        .attraction-img-wrapper {
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }
    }
    
    &:active {
        transform: scale(0.98);
    }
    
    .attraction-img-wrapper {
        position: relative;
        overflow: hidden;
        border-radius: 6px;
        transition: all 0.3s ease;
        
        img {
            width: 140px;
            height: 90px;
            border-radius: 6px;
            object-fit: cover;
            transition: transform 0.3s ease;
        }
        
        &:hover img {
            transform: scale(1.05);
        }
    }
}

.attraction-info {
    margin-top: 8px;
    
    .attraction-title {
        font-size: 14px;
        color: #333;
        font-weight: 500;
        margin-bottom: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    
    .attraction-rating {
        font-size: 12px;
        color: #999;
        margin-bottom: 4px;
        
        .score {
            color: $color_them;
            font-weight: bold;
        }
    }
    
    .price-section {
        .price {
            font-size: 14px;
            color: $color_them;
            font-weight: bold;
            
            &.free {
                color: #4caf50;
            }
        }
    }
}

.performance {
    background-color: #fff;
    padding: 15px;
    margin-bottom: 10px;
}

.performance-tabs {
    display: flex;
    margin-bottom: 15px;
    background-color: #f5f5f5;
    border-radius: 6px;
    padding: 4px;
}

.performance-tab {
    flex: 1;
    text-align: center;
    padding: 8px 0;
    font-size: 13px;
    color: #666;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.3s;
    
    &:hover:not(.active) {
        background-color: rgba(255, 255, 255, 0.5);
    }
    
    &.active {
        background-color: #fff;
        color: $color_them;
        font-weight: bold;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
}

.performance-list {
    display: flex;
    flex-direction: column;
}

.performance-item {
    display: flex;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:last-child {
        border-bottom: none;
    }
    
    &:hover {
        background-color: #fafafa;
        border-radius: 8px;
        padding-left: 8px;
        padding-right: 8px;
        margin-left: -8px;
        margin-right: -8px;
    }
    
    &:active {
        background-color: #f0f0f0;
    }
}

.performance-img {
    position: relative;
    flex-shrink: 0;
    overflow: hidden;
    border-radius: 6px;
    
    img {
        width: 120px;
        height: 80px;
        border-radius: 6px;
        object-fit: cover;
        transition: transform 0.3s ease;
    }
    
    &:hover img {
        transform: scale(1.05);
    }
    
    .tag {
        position: absolute;
        top: 5px;
        left: 5px;
        background-color: rgba(229, 72, 71, 0.9);
        color: #fff;
        font-size: 10px;
        padding: 2px 6px;
        border-radius: 3px;
    }
}

.performance-info {
    flex: 1;
    margin-left: 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.performance-title {
    font-size: 15px;
    font-weight: 500;
    color: #333;
    margin-bottom: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.performance-type {
    font-size: 12px;
    color: #666;
    margin-bottom: 4px;
}

.performance-time,
.performance-venue {
    font-size: 12px;
    color: #999;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    
    i {
        display: inline-block;
        width: 12px;
        height: 12px;
        margin-right: 4px;
        background-size: contain;
    }
    
    .icon-time {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23999'%3E%3Cpath d='M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z'/%3E%3C/svg%3E");
    }
    
    .icon-location {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23999'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5z'/%3E%3C/svg%3E");
    }
}

.price-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 6px;
    
    .price-left {
        display: flex;
        flex-direction: column;
        
        .price {
            font-size: 16px;
            color: $color_them;
            font-weight: bold;
        }
        
        .discount {
            display: flex;
            align-items: center;
            margin-top: 2px;
            
            .discount-tag {
                background-color: $color_them;
                color: #fff;
                font-size: 10px;
                padding: 2px 6px;
                border-radius: 3px;
                margin-right: 6px;
            }
            
            .original-price {
                font-size: 12px;
                color: #999;
                text-decoration: line-through;
            }
        }
    }
    
    .buy-btn {
        background-color: $color_them;
        color: #fff;
        border: none;
        padding: 6px 16px;
        border-radius: 15px;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover {
            background-color: #d63a3a;
            transform: scale(1.05);
        }
        
        &:active {
            transform: scale(0.95);
        }
    }
}

.nearby {
    background-color: #fff;
    padding: 15px;
    margin-bottom: 10px;
}

.filter-section {
    margin-bottom: 15px;
}

.filter-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f0f0f0;
    
    &:last-child {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
    }
}

.filter-label {
    flex-shrink: 0;
    width: 60px;
    font-size: 13px;
    color: #666;
    padding-top: 4px;
}

.filter-options {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.filter-option {
    display: inline-block;
    padding: 4px 12px;
    background-color: #f5f5f5;
    border-radius: 12px;
    font-size: 12px;
    color: #666;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover:not(.active) {
        background-color: #e8e8e8;
    }
    
    &:active {
        transform: scale(0.95);
    }
    
    &.active {
        background-color: $color_them;
        color: #fff;
    }
}

.nearby-list {
    display: flex;
    flex-direction: column;
}

.nearby-item {
    display: flex;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:last-child {
        border-bottom: none;
    }
    
    &:hover {
        background-color: #fafafa;
        border-radius: 8px;
        padding-left: 8px;
        padding-right: 8px;
        margin-left: -8px;
        margin-right: -8px;
    }
    
    &:active {
        background-color: #f0f0f0;
    }
}

.nearby-img {
    flex-shrink: 0;
    overflow: hidden;
    border-radius: 6px;
    
    img {
        width: 120px;
        height: 80px;
        border-radius: 6px;
        object-fit: cover;
        transition: transform 0.3s ease;
    }
    
    &:hover img {
        transform: scale(1.05);
    }
}

.nearby-info {
    flex: 1;
    margin-left: 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.nearby-title {
    font-size: 15px;
    font-weight: 500;
    color: #333;
    margin-bottom: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.nearby-rating {
    font-size: 12px;
    margin-bottom: 4px;
    
    .score {
        color: $color_them;
        font-weight: bold;
        margin-right: 4px;
    }
    
    .comments {
        color: #999;
    }
}

.nearby-category {
    font-size: 12px;
    color: #666;
    margin-bottom: 4px;
}

.nearby-distance {
    font-size: 12px;
    color: #999;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    
    i {
        display: inline-block;
        width: 12px;
        height: 12px;
        margin-right: 4px;
        background-size: contain;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23999'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5z'/%3E%3C/svg%3E");
    }
}

.empty-tip {
    text-align: center;
    padding: 40px 20px;
    
    p {
        font-size: 14px;
        color: #999;
        margin-bottom: 16px;
    }
    
    .reset-btn {
        padding: 8px 24px;
        background-color: $color_them;
        color: #fff;
        border: none;
        border-radius: 20px;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover {
            background-color: #d63a3a;
        }
        
        &:active {
            transform: scale(0.95);
        }
    }
}
</style>
