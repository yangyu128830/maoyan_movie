<template lang="html">
    <div class="concert">
        <div class="concert-header">
            <h2 class="section-title">演唱会</h2>
        </div>

        <div class="hot-recommend">
            <h3 class="subtitle">热门推荐</h3>
            <div class="recommend-slider">
                <div 
                    class="recommend-item" 
                    v-for="item in hotRecommend" 
                    :key="item.id"
                    @click="goToDetail(item)"
                >
                    <img :src="item.img" :alt="item.title">
                    <div class="recommend-info">
                        <p class="recommend-title">{{item.title}}</p>
                        <p class="recommend-time">{{item.showTime}}</p>
                        <p class="recommend-city">{{item.city}}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="city-filter">
            <h3 class="subtitle">选择地区</h3>
            <div class="city-tabs">
                <span 
                    class="city-tab" 
                    :class="{'active': selectedCity === '全部'}"
                    @click="filterByCity('全部')"
                >全部</span>
                <span 
                    class="city-tab" 
                    v-for="city in hotCities" 
                    :key="city.id"
                    :class="{'active': selectedCity === city.nm}"
                    @click="filterByCity(city.nm)"
                >{{city.nm}}</span>
            </div>
        </div>

        <div class="recent-shows">
            <h3 class="subtitle">最近演出</h3>
            <div class="concert-list">
                <div 
                    class="concert-item" 
                    v-for="item in filteredRecent" 
                    :key="item.id"
                    @click="goToDetail(item)"
                >
                    <div class="concert-img">
                        <img :src="item.img" :alt="item.title">
                        <div class="tag" v-if="item.tag">{{item.tag}}</div>
                    </div>
                    <div class="concert-info">
                        <h4 class="concert-title">{{item.title}}</h4>
                        <p class="concert-singer">{{item.singer}}</p>
                        <p class="concert-time"><i class="icon-time"></i>{{item.showTime}}</p>
                        <p class="concert-venue"><i class="icon-location"></i>{{item.venue}}</p>
                        <div class="price-section">
                            <span class="price">¥{{item.minPrice}}起</span>
                            <button class="buy-btn">购票</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="empty-tip" v-if="filteredRecent.length === 0">
                暂无该地区演唱会信息
            </div>
        </div>

        <div class="hot-stars">
            <h3 class="subtitle">热门明星演唱会</h3>
            <div class="stars-slider">
                <div 
                    class="star-item" 
                    v-for="item in filteredStars" 
                    :key="item.id"
                    @click="goToDetail(item)"
                >
                    <img :src="item.starImg" :alt="item.singer">
                    <p class="star-name">{{item.singer}}</p>
                    <p class="star-city">{{item.city}}</p>
                    <p class="star-time">{{item.showTime}}</p>
                    <span class="star-price">¥{{item.minPrice}}起</span>
                </div>
            </div>
            <div class="empty-tip" v-if="filteredStars.length === 0">
                暂无该地区热门明星演唱会
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Concert",
    created() {
        this.$store.commit("changeHt", "演唱会");
    },
    data() {
        return {
            selectedCity: "全部",
            hotCities: [
                { id: 1, nm: "北京" },
                { id: 10, nm: "上海" },
                { id: 20, nm: "广州" },
                { id: 30, nm: "深圳" },
                { id: 59, nm: "成都" },
                { id: 50, nm: "杭州" },
                { id: 55, nm: "南京" },
                { id: 70, nm: "长沙" }
            ],
            hotRecommend: [
                {
                    id: 101,
                    title: "周杰伦2026巡回演唱会",
                    img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=周杰伦演唱会舞台灯光现场表演&image_size=square",
                    showTime: "2026.05.01",
                    city: "北京",
                    singer: "周杰伦",
                    venue: "北京工人体育场",
                    minPrice: 880,
                    maxPrice: 2880
                },
                {
                    id: 102,
                    title: "林俊杰2026世界巡回演唱会",
                    img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=林俊杰演唱会现场表演舞台效果&image_size=square",
                    showTime: "2026.04.28",
                    city: "上海",
                    singer: "林俊杰",
                    venue: "上海梅赛德斯奔驰文化中心",
                    minPrice: 680,
                    maxPrice: 2580
                },
                {
                    id: 103,
                    title: "薛之谦巡回演唱会",
                    img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=薛之谦演唱会现场音乐表演&image_size=square",
                    showTime: "2026.05.10",
                    city: "广州",
                    singer: "薛之谦",
                    venue: "广州体育馆",
                    minPrice: 580,
                    maxPrice: 1880
                }
            ],
            recentConcerts: [
                {
                    id: 201,
                    title: "陈奕迅2026巡回演唱会",
                    img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=陈奕迅演唱会现场深情演唱&image_size=square",
                    singer: "陈奕迅",
                    showTime: "2026.04.20",
                    city: "北京",
                    venue: "北京凯迪拉克中心",
                    minPrice: 980,
                    maxPrice: 3280,
                    tag: "即将开场",
                    starImg: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=陈奕迅歌手头像照片&image_size=square"
                },
                {
                    id: 202,
                    title: "蔡依林Ugly Beauty演唱会",
                    img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=蔡依林演唱会舞台表演热舞&image_size=square",
                    singer: "蔡依林",
                    showTime: "2026.04.22",
                    city: "上海",
                    venue: "上海东方体育中心",
                    minPrice: 780,
                    maxPrice: 2680,
                    tag: "热售中",
                    starImg: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=蔡依林歌手头像照片&image_size=square"
                },
                {
                    id: 203,
                    title: "邓紫棋2026巡回演唱会",
                    img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=邓紫棋演唱会现场钢琴弹唱&image_size=square",
                    singer: "邓紫棋",
                    showTime: "2026.04.25",
                    city: "广州",
                    venue: "广州天河体育馆",
                    minPrice: 680,
                    maxPrice: 2380,
                    tag: "热售中",
                    starImg: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=邓紫棋歌手头像照片&image_size=square"
                },
                {
                    id: 204,
                    title: "华晨宇火星演唱会",
                    img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=华晨宇演唱会现场摇滚表演&image_size=square",
                    singer: "华晨宇",
                    showTime: "2026.04.30",
                    city: "深圳",
                    venue: "深圳湾体育中心",
                    minPrice: 580,
                    maxPrice: 1980,
                    tag: "即将开场",
                    starImg: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=华晨宇歌手头像照片&image_size=square"
                },
                {
                    id: 205,
                    title: "张杰2026巡回演唱会",
                    img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=张杰演唱会现场舞台效果&image_size=square",
                    singer: "张杰",
                    showTime: "2026.05.05",
                    city: "成都",
                    venue: "成都凤凰山体育公园",
                    minPrice: 480,
                    maxPrice: 1680,
                    tag: "预售中",
                    starImg: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=张杰歌手头像照片&image_size=square"
                },
                {
                    id: 206,
                    title: "薛之谦天外来物演唱会",
                    img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=薛之谦演唱会现场表演&image_size=square",
                    singer: "薛之谦",
                    showTime: "2026.05.10",
                    city: "杭州",
                    venue: "杭州奥体中心",
                    minPrice: 520,
                    maxPrice: 1717,
                    tag: "预售中",
                    starImg: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=薛之谦歌手头像照片&image_size=square"
                },
                {
                    id: 207,
                    title: "林俊杰2026演唱会",
                    img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=林俊杰演唱会现场演唱&image_size=square",
                    singer: "林俊杰",
                    showTime: "2026.05.15",
                    city: "南京",
                    venue: "南京奥体中心体育馆",
                    minPrice: 680,
                    maxPrice: 2280,
                    tag: "热售中",
                    starImg: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=林俊杰歌手头像照片&image_size=square"
                },
                {
                    id: 208,
                    title: "周杰伦2026嘉年华演唱会",
                    img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=周杰伦演唱会现场舞台&image_size=square",
                    singer: "周杰伦",
                    showTime: "2026.05.20",
                    city: "长沙",
                    venue: "长沙贺龙体育中心",
                    minPrice: 980,
                    maxPrice: 3280,
                    tag: "即将开场",
                    starImg: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=周杰伦歌手头像照片&image_size=square"
                }
            ],
            starConcerts: [
                {
                    id: 301,
                    title: "周杰伦2026巡回演唱会",
                    img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=周杰伦演唱会现场舞台灯光&image_size=square",
                    singer: "周杰伦",
                    showTime: "2026.05.01-02",
                    city: "北京",
                    venue: "北京工人体育场",
                    minPrice: 880,
                    maxPrice: 2880,
                    starImg: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=周杰伦歌手头像照片&image_size=square"
                },
                {
                    id: 302,
                    title: "林俊杰JJ20演唱会",
                    img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=林俊杰演唱会舞台表演&image_size=square",
                    singer: "林俊杰",
                    showTime: "2026.04.28-29",
                    city: "上海",
                    venue: "上海梅赛德斯奔驰文化中心",
                    minPrice: 680,
                    maxPrice: 2580,
                    starImg: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=林俊杰歌手头像照片&image_size=square"
                },
                {
                    id: 303,
                    title: "陈奕迅Fear and Dreams",
                    img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=陈奕迅演唱会现场演唱&image_size=square",
                    singer: "陈奕迅",
                    showTime: "2026.04.20-21",
                    city: "北京",
                    venue: "北京凯迪拉克中心",
                    minPrice: 980,
                    maxPrice: 3280,
                    starImg: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=陈奕迅歌手头像照片&image_size=square"
                },
                {
                    id: 304,
                    title: "薛之谦天外来物巡回",
                    img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=薛之谦演唱会现场&image_size=square",
                    singer: "薛之谦",
                    showTime: "2026.05.10-11",
                    city: "广州",
                    venue: "广州体育馆",
                    minPrice: 520,
                    maxPrice: 1717,
                    starImg: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=薛之谦歌手头像照片&image_size=square"
                },
                {
                    id: 305,
                    title: "华晨宇火星演唱会",
                    img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=华晨宇演唱会现场表演&image_size=square",
                    singer: "华晨宇",
                    showTime: "2026.04.30-05.02",
                    city: "深圳",
                    venue: "深圳湾体育中心",
                    minPrice: 580,
                    maxPrice: 1980,
                    starImg: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=华晨宇歌手头像照片&image_size=square"
                },
                {
                    id: 306,
                    title: "张杰2026演唱会",
                    img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=张杰演唱会现场&image_size=square",
                    singer: "张杰",
                    showTime: "2026.05.05-06",
                    city: "成都",
                    venue: "成都凤凰山体育公园",
                    minPrice: 480,
                    maxPrice: 1680,
                    starImg: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=张杰歌手头像照片&image_size=square"
                }
            ]
        };
    },
    computed: {
        filteredRecent() {
            if (this.selectedCity === "全部") {
                return this.recentConcerts;
            }
            return this.recentConcerts.filter(item => item.city === this.selectedCity);
        },
        filteredStars() {
            if (this.selectedCity === "全部") {
                return this.starConcerts;
            }
            return this.starConcerts.filter(item => item.city === this.selectedCity);
        }
    },
    methods: {
        filterByCity(city) {
            this.selectedCity = city;
        },
        goToDetail(item) {
            console.log("查看演唱会详情:", item);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/public.scss";

.concert {
    background-color: #f5f5f5;
    min-height: 100vh;
    padding-bottom: 20px;
}

.concert-header {
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

.hot-recommend {
    background-color: #fff;
    padding: 15px;
    margin-bottom: 10px;
}

.recommend-slider {
    display: flex;
    overflow-x: auto;
    padding-bottom: 10px;
    scrollbar-width: none;
    -ms-overflow-style: none;
    
    &::-webkit-scrollbar {
        display: none;
    }
}

.recommend-item {
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

.recommend-info {
    margin-top: 8px;
    
    .recommend-title {
        font-size: 14px;
        color: #333;
        font-weight: 500;
        margin-bottom: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    
    .recommend-time,
    .recommend-city {
        font-size: 12px;
        color: #999;
        margin-bottom: 2px;
    }
}

.city-filter {
    background-color: #fff;
    padding: 15px;
    margin-bottom: 10px;
}

.city-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.city-tab {
    display: inline-block;
    padding: 6px 16px;
    background-color: #f5f5f5;
    border-radius: 15px;
    font-size: 13px;
    color: #666;
    cursor: pointer;
    transition: all 0.3s;
    
    &.active {
        background-color: $color_them;
        color: #fff;
    }
}

.recent-shows,
.hot-stars {
    background-color: #fff;
    padding: 15px;
    margin-bottom: 10px;
}

.concert-list {
    display: flex;
    flex-direction: column;
}

.concert-item {
    display: flex;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
    cursor: pointer;
    
    &:last-child {
        border-bottom: none;
    }
}

.concert-img {
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

.concert-info {
    flex: 1;
    margin-left: 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.concert-title {
    font-size: 15px;
    font-weight: 500;
    color: #333;
    margin-bottom: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.concert-singer {
    font-size: 12px;
    color: #666;
    margin-bottom: 4px;
}

.concert-time,
.concert-venue {
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
}

.price {
    font-size: 16px;
    color: $color_them;
    font-weight: bold;
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

.stars-slider {
    display: flex;
    overflow-x: auto;
    padding-bottom: 10px;
    scrollbar-width: none;
    -ms-overflow-style: none;
    
    &::-webkit-scrollbar {
        display: none;
    }
}

.star-item {
    flex-shrink: 0;
    width: 110px;
    margin-right: 12px;
    text-align: center;
    cursor: pointer;
    background-color: #fafafa;
    border-radius: 8px;
    padding: 10px;
    
    &:last-child {
        margin-right: 0;
    }
    
    img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        object-fit: cover;
        margin-bottom: 8px;
    }
}

.star-name {
    font-size: 14px;
    font-weight: 500;
    color: #333;
    margin-bottom: 4px;
}

.star-city {
    font-size: 12px;
    color: #666;
    margin-bottom: 2px;
}

.star-time {
    font-size: 11px;
    color: #999;
    margin-bottom: 6px;
}

.star-price {
    font-size: 13px;
    color: $color_them;
    font-weight: bold;
}

.empty-tip {
    text-align: center;
    padding: 40px 0;
    color: #999;
    font-size: 14px;
}
</style>
