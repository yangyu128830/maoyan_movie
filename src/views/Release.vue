<template lang="html">
    <transition name="fade">
        <div class="new">
            <!-- 最近受期待 -->
            <div class="mostExpected">
                <h1 class="title">最近受期待</h1>
                <section class="recentList">
                    <ul v-infinite-scroll="loadMore"
                        infinite-scroll-disabled="loading"
                        infinite-scroll-distance="10">
                        <li @click="Tomovie(item.id)" v-for="item in mostExpected" :key="item.id">
                            <div class="img">
                                <img v-lazy="picFix(item.img)" alt="">
                                <p class="wish">{{item.wish}}人想看</p>
                            </div>
                            <h3 class="nm">{{item.nm}}</h3>
                            <span class="comingTitle">{{item.comingTitle.substr(0,10)}}</span>
                        </li>
                    </ul>
                </section>
            </div>
            <!-- 电影列表 -->
            <div class="coming-list">
                <ul class="clearfix">
                    <li v-for="(item,index) in timeTitle" :key="item.index">
                        <p class="comingTitle">{{index}}</p>
                        <div v-for="coming in item" :key="coming.id">
                            <div class="content" @click="movie_detail(coming.id)">
                                <div class="img">
                                    <img v-lazy="picFix_coming(coming.img)" alt="">
                                </div>
                                <div class="right-content textOverflow1">
                                    <h1 class="nm">{{coming.nm}}</h1>
                                    <div class="wish">
                                        <span class="wish_1">{{coming.wish}}</span>
                                        <span class="peo">人想看</span>
                                    </div>
                                    <h3 class="star textOverflow1">{{coming.star}}</h3>
                                    <p class="showInfo">{{coming.showInfo}}</p>
                                </div>
                                <!-- 购票预售组件 -->
                                <div class="btn">
                                    <button class="btn1" v-if="coming.preShow">想看</button>
                                    <button v-else class="btn2">预售</button>
                                </div>
                            </div>
                        </div>
                    </li>
                    <!-- loading 加载组件 -->
                    <div class="loading" v-show="hasMore">
                        <mt-spinner color="rgb(100, 100, 100)" type="fading-circle"></mt-spinner>
                    </div>
                </ul>
            </div>
        </div>
    </transition>
</template>
<script>
// import MyButton from '@/components/myButton.vue'

const mockMostExpected = [
    {
        id: 2001,
        img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=avatar%203%20james%20cameron%20movie%20poster%20pandora%20alien%20world&image_size=square_hd",
        nm: "阿凡达3：水之道",
        comingTitle: "05月15日",
        wish: 256800
    },
    {
        id: 2002,
        img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=star%20wars%20episode%2010%20movie%20poster%20space%20opera%20epic&image_size=square_hd",
        nm: "星球大战：新原力",
        comingTitle: "06月01日",
        wish: 198500
    },
    {
        id: 2003,
        img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=dune%203%20movie%20poster%20desert%20planet%20sci-fi%20epic&image_size=square_hd",
        nm: "沙丘3：终章",
        comingTitle: "05月20日",
        wish: 167200
    },
    {
        id: 2004,
        img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=harry%20potter%20cursed%20child%20movie%20poster%20magic%20wizard&image_size=square_hd",
        nm: "哈利波特：被诅咒的孩子",
        comingTitle: "07月15日",
        wish: 312600
    },
    {
        id: 2005,
        img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=jurassic%20world%204%20movie%20poster%20dinosaurs%20adventure&image_size=square_hd",
        nm: "侏罗纪世界4：新纪元",
        comingTitle: "06月22日",
        wish: 145800
    },
    {
        id: 2006,
        img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mission%20impossible%209%20movie%20poster%20tom%20cruise%20spy%20action&image_size=square_hd",
        nm: "碟中谍9：致命清算",
        comingTitle: "05月28日",
        wish: 189300
    }
];

const mockComingList = [
    {
        id: 3001,
        img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=avatar%203%20james%20cameron%20movie%20poster%20pandora%20alien%20world&image_size=square_hd",
        nm: "阿凡达3：水之道",
        version: "v3d imax",
        comingTitle: "05月15日",
        wish: 256800,
        star: "萨姆·沃辛顿、佐伊·索尔达娜",
        showInfo: "美国/科幻/动作/195分钟",
        preShow: true
    },
    {
        id: 3002,
        img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=dune%203%20movie%20poster%20desert%20planet%20sci-fi%20epic&image_size=square_hd",
        nm: "沙丘3：终章",
        version: "v3d imax",
        comingTitle: "05月20日",
        wish: 167200,
        star: "提莫西·查拉梅、赞达亚",
        showInfo: "美国/科幻/冒险/168分钟",
        preShow: true
    },
    {
        id: 3003,
        img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mission%20impossible%209%20movie%20poster%20tom%20cruise%20spy%20action&image_size=square_hd",
        nm: "碟中谍9：致命清算",
        version: "v2d imax",
        comingTitle: "05月28日",
        wish: 189300,
        star: "汤姆·克鲁斯、海莉·阿特维尔",
        showInfo: "美国/动作/惊悚/163分钟",
        preShow: false
    },
    {
        id: 3004,
        img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=star%20wars%20episode%2010%20movie%20poster%20space%20opera%20epic&image_size=square_hd",
        nm: "星球大战：新原力",
        version: "v3d imax",
        comingTitle: "06月01日",
        wish: 198500,
        star: "黛西·雷德利、亚当·德赖弗",
        showInfo: "美国/科幻/冒险/155分钟",
        preShow: true
    },
    {
        id: 3005,
        img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=jurassic%20world%204%20movie%20poster%20dinosaurs%20adventure&image_size=square_hd",
        nm: "侏罗纪世界4：新纪元",
        version: "v3d imax",
        comingTitle: "06月22日",
        wish: 145800,
        star: "克里斯·帕拉特、布莱丝·达拉斯·霍华德",
        showInfo: "美国/科幻/冒险/148分钟",
        preShow: false
    },
    {
        id: 3006,
        img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=harry%20potter%20cursed%20child%20movie%20poster%20magic%20wizard&image_size=square_hd",
        nm: "哈利波特：被诅咒的孩子",
        version: "v3d imax",
        comingTitle: "07月15日",
        wish: 312600,
        star: "丹尼尔·雷德克里夫、艾玛·沃特森",
        showInfo: "英国/奇幻/冒险/182分钟",
        preShow: true
    },
    {
        id: 3007,
        img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=frozen%203%20disney%20animation%20movie%20poster%20elsa%20ice%20queen&image_size=square_hd",
        nm: "冰雪奇缘3",
        version: "v3d imax",
        comingTitle: "07月20日",
        wish: 278900,
        star: "伊迪娜·门泽尔、克里斯汀·贝尔",
        showInfo: "美国/动画/奇幻/115分钟",
        preShow: true
    },
    {
        id: 3008,
        img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=transformers%20rise%20of%20unicron%20movie%20poster%20robots%20action&image_size=square_hd",
        nm: "变形金刚：宇宙大帝崛起",
        version: "v3d imax",
        comingTitle: "06月15日",
        wish: 215400,
        star: "安东尼·霍普金斯、马克·沃尔伯格",
        showInfo: "美国/科幻/动作/172分钟",
        preShow: false
    }
];

function initMockTimeTitle() {
    const timeTitle = {};
    mockComingList.forEach(item => {
        if (!timeTitle[item.comingTitle]) {
            timeTitle[item.comingTitle] = [];
        }
        timeTitle[item.comingTitle].push(item);
    });
    return timeTitle;
}

export default {
    /**
     * [lang description]
     * @type {String}
     */
    created() {
        let that = this;
        this.ciId = this.$store.state.cityId;
        this.axios
            .get("/ajax/comingList", {
                params: {
                    ci: this.ciId, // 城市id
                    limt: 10,
                    token: ""
                }
            })
            .then(res => {
                if (res.data && res.data.coming && res.data.coming.length > 0) {
                    this.coming = res.data.coming;
                    this.movieIds = res.data.movieIds;
                    this.fenzu();
                } else {
                    this.coming = mockComingList;
                    this.movieIds = mockComingList.map(m => m.id);
                    this.timeTitle = initMockTimeTitle();
                }
                document.addEventListener(
                    "scroll",
                    this.fangdou(function() {
                        that.moreComingList(that.movieIds);
                    }, 500)
                );
            }).catch(() => {
                this.coming = mockComingList;
                this.movieIds = mockComingList.map(m => m.id);
                this.timeTitle = initMockTimeTitle();
            });
        this.most_Expected(this.offset);
    },
    data() {
        return {
            mostExpected: mockMostExpected,
            coming: mockComingList,
            title: ["想看", "预售"],
            ciId: "",
            movieIds: mockComingList.map(m => m.id),
            offset: 0,
            timeTitle: initMockTimeTitle(),
            hasMore: true
        };
    },
    methods: {
        picFix(wh) {
            if (wh !== undefined) {
                return wh.replace("w.h", "85.115");
            }
        },
        picFix_coming(wh) {
            if (wh !== undefined) {
                return wh.replace("w.h", "64.90");
            }
        },
        most_Expected(offset) {
            this.axios
                .get("/ajax/mostExpected", {
                    params: {
                        ci: this.ciId,
                        limit: 10,
                        offset: offset, // 请求数量
                        token: ""
                    }
                })
                .then(res => {
                    if (res.data.coming.length !== 0) {
                        // 请求coming为空时，不在请求
                        this.mostExpected = this.mostExpected.concat(
                            res.data.coming
                        );
                    } else {
                        return false;
                    }
                });
        },
        loadMore() {
            this.loading = true;
            this.offset += 10;
            this.most_Expected(this.offset);
            this.loading = false;
        },
        // 防抖
        fangdou(callback, delay) {
            // 定时器
            var timer;
            return function() {
                if (timer) {
                    // 引用外部函数的timer
                    clearTimeout(timer);
                }
                timer = setTimeout(() => {
                    callback.apply(this, arguments);
                }, delay);
            };
        },
        fenzu() {
            // 遍历数组所有的成员，以成员的某个数据作为分组的组名
            // 在添加之前，先判断对象上的属性名是否存在，若不存在则设置一个空数组
            // 将成员添加到对应的属性上（数组）
            this.coming.forEach(item => {
                if (!this.timeTitle[item.comingTitle]) {
                    this.timeTitle[item.comingTitle] = [];
                }
                this.timeTitle[item.comingTitle].push(item);
            });
        },
        // moreComingList
        moreComingList(movieIds) {
            let flag = false;
            let that = this;
            let scrollTop = document.documentElement.scrollTop; // 滚动高度
            let pageHeight = document.documentElement.scrollHeight; // 页面高度
            let innerHeight = window.innerHeight;
            if (scrollTop + innerHeight == pageHeight && flag == true) {
                flag = false;
            }
            let arrIndex = 12;
            let limit = 10;
            let tosee = movieIds.splice(arrIndex, limit);
            tosee = tosee.join(",");
            that.axios
                .get("/ajax/moreComingList", {
                    params: {
                        ci: this.ciId,
                        token: "",
                        limit: 10,
                        movieIds: tosee
                    }
                })
                .then(res => {
                    if (res.data.coming.length !== 0) {
                        res.data.coming.forEach(item => {
                            if (!that.timeTitle[item.comingTitle]) {
                                that.timeTitle[item.comingTitle] = [];
                            }
                            this.$forceUpdate(); // 迫使 Vue 实例重新渲染。
                            that.timeTitle[item.comingTitle].push(item);
                        });
                    } else {
                        this.hasMore = !this.hasMore;
                        return false;
                    }
                });
        },
        //    电影详情
        movie_detail(id) {
            this.$router.push({
                name: "movie_detail",
                params: {
                    movieId: id
                }
            });
        },
        Tomovie(id) {
            this.$router.push({
                name: "movies",
                params: {
                    movieId: id
                }
            });
        },
    },
    computed: {
        changeCity() {
            //数据依赖更新是，计算属性重新触发更新
            return this.$store.state.cityId;
        }
    },
    components: {
        //    MyButton
    }
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/release.scss";
.btn {
    position: absolute;
    top: 50%;
    right: 6%;
    transform: translateY(-50%);
}
.fade-enter {
    opacity: 0;
    transform: translateY(40px);
}
.fade-enter-active {
    transition: all 0.8s;
}
.loading {
    position: absolute;
    left: 50%;
    // bottom: -20px;
    transform: translateX(-50%);
}
</style>
