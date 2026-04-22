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
                >
                    <img :src="item.img" :alt="item.title">
                    <div class="attraction-info">
                        <p class="attraction-title">{{item.title}}</p>
                        <p class="attraction-rating">
                            <span class="score">{{item.score}}</span>分 | {{item.comments}}条评价
                        </p>
                        <div class="price-section">
                            <span class="price">¥{{item.price}}起</span>
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
                            <span class="price">¥{{item.minPrice}}起</span>
                            <div class="discount" v-if="item.discount">
                                <span class="discount-tag">{{item.discount}}折</span>
                                <span class="original-price">¥{{item.originalPrice}}</span>
                            </div>
                            <button class="buy-btn">购票</button>
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
                            <button class="buy-btn">查看</button>
                        </div>
                    </div>
                </div>
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
                    price: 60
                },
                {
                    id: 102,
                    title: "八达岭长城",
                    img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=北京八达岭长城风景&image_size=square",
                    score: 4.8,
                    comments: 8920,
                    price: 40
                },
                {
                    id: 103,
                    title: "上海迪士尼乐园",
                    img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=上海迪士尼乐园城堡烟花表演&image_size=square",
                    score: 4.7,
                    comments: 15680,
                    price: 399
                },
                {
                    id: 104,
                    title: "西湖风景区",
                    img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=杭州西湖断桥雷峰塔风景&image_size=square",
                    score: 4.9,
                    comments: 20560,
                    price: 0
                },
                {
                    id: 105,
                    title: "成都大熊猫基地",
                    img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=成都大熊猫基地可爱熊猫&image_size=square",
                    score: 4.8,
                    comments: 18920,
                    price: 55
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
                    originalPrice: null
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
                    originalPrice: 373
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
                    originalPrice: 124
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
                    originalPrice: null
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
                    originalPrice: 221
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
                    originalPrice: 171
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
                    price: 168
                },
                {
                    id: 302,
                    title: "戏精学院·实景搜证剧本杀",
                    img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=剧本杀实景推理游戏&image_size=square",
                    score: 4.9,
                    comments: 2160,
                    category: "剧本杀",
                    distance: "1.2km",
                    price: 198
                },
                {
                    id: 303,
                    title: "超级异次元密室逃脱",
                    img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=密室逃脱恐怖场景解谜&image_size=square",
                    score: 4.7,
                    comments: 1890,
                    category: "密室逃脱",
                    distance: "2.3km",
                    price: 158
                },
                {
                    id: 304,
                    title: "聚友桌游吧",
                    img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=桌游吧聚会游戏狼人杀&image_size=square",
                    score: 4.6,
                    comments: 1250,
                    category: "桌游",
                    distance: "500m",
                    price: 68
                },
                {
                    id: 305,
                    title: "网鱼电竞网咖",
                    img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=电竞网咖高配置电脑&image_size=square",
                    score: 4.5,
                    comments: 3200,
                    category: "电竞",
                    distance: "600m",
                    price: 18
                },
                {
                    id: 306,
                    title: "唱吧麦颂KTV",
                    img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=时尚KTV包厢灯光效果&image_size=square",
                    score: 4.7,
                    comments: 2890,
                    category: "KTV",
                    distance: "1.8km",
                    price: 128
                },
                {
                    id: 307,
                    title: "推理大师·沉浸式剧本杀",
                    img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=沉浸式剧本杀换装体验&image_size=square",
                    score: 4.9,
                    comments: 4560,
                    category: "剧本杀",
                    distance: "3.1km",
                    price: 258
                },
                {
                    id: 308,
                    title: "第七感·真人密室逃脱",
                    img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=真人密室逃脱机关道具&image_size=square",
                    score: 4.8,
                    comments: 1680,
                    category: "密室逃脱",
                    distance: "2.8km",
                    price: 178
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
    
    &:last-child {
        margin-right: 0;
    }
    
    img {
        width: 140px;
        height: 90px;
        border-radius: 6px;
        object-fit: cover;
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
    
    &:last-child {
        border-bottom: none;
    }
}

.performance-img {
    position: relative;
    flex-shrink: 0;
    
    img {
        width: 120px;
        height: 80px;
        border-radius: 6px;
        object-fit: cover;
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
    
    .price {
        font-size: 16px;
        color: $color_them;
        font-weight: bold;
    }
    
    .discount {
        display: flex;
        align-items: center;
        
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
    
    .buy-btn {
        background-color: $color_them;
        color: #fff;
        border: none;
        padding: 6px 16px;
        border-radius: 15px;
        font-size: 12px;
        cursor: pointer;
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
    
    &:last-child {
        border-bottom: none;
    }
}

.nearby-img {
    flex-shrink: 0;
    
    img {
        width: 120px;
        height: 80px;
        border-radius: 6px;
        object-fit: cover;
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
</style>
