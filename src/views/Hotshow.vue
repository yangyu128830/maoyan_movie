<template>
    <transition name="move">
        <div class="Hotshow">
            <ul>
                <li
                    v-for="(movie, index) in movieList"
                    :key="movie.index"
                    @click="movie_detail(movie.id)"
                >
                    <div class="movie_wrapper">
                        <img v-lazy="picFix(movie.img)" alt>
                        <div class="movie_detail">
                            <div class="title_name">
                                <h1 class="title textOverflow1">{{movie.nm}}</h1>
                                <span
                                    class="icon"
                                    v-if="movie.version =='v3d imax'"
                                    :class="{'active1': movie.version =='v3d imax'}"
                                ></span>
                                <span
                                    v-else
                                    class="icon"
                                    :class="{'active2': movie.version =='v2d imax'}"
                                ></span>
                            </div>
                            <p class="evaluate" v-if="movie.sc > 0 && movie.preShow">
                                观众评:
                                <span>{{movie.sc}}</span>
                            </p>
                            <p class="evaluate" v-else-if="movie.sc == 0">暂无评分</p>
                            <p class="evaluate" v-else>
                                <span>{{movie.wish}}</span>人想看
                            </p>
                            <h5 class="people textOverflow1">主演:{{movie.star}}</h5>
                            <h6 class="show textOverflow1">{{movie.showInfo}}</h6>
                        </div>
                    </div>
                    <!-- 购票预售组件 -->
                    <div class="btn">
                        <my-button :title="title" :movieList="movieList" :index="index"></my-button>
                    </div>
                </li>
            </ul>
            <!-- loading 加载组件 -->
            <div class="loading" v-show="coming.length">
                <mt-spinner color="rgb(100, 100, 100)" type="fading-circle"></mt-spinner>
            </div>
        </div>
    </transition>
</template>

<script>
// @ is an alias to /src
import myButton from "@/components/myButton.vue";

const mockMovieList = [
    {
        id: 1001,
        img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20sci-fi%20movie%20poster%20wandering%20earth%203%20space%20epic&image_size=square_hd",
        nm: "流浪地球3",
        version: "v3d imax",
        sc: 9.5,
        preShow: true,
        star: "吴京、刘德华、李雪健",
        showInfo: "今天 150家影院放映"
    },
    {
        id: 1002,
        img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fast%20and%20furious%2011%20movie%20poster%20sports%20cars%20racing%20action&image_size=square_hd",
        nm: "速度与激情11",
        version: "v3d imax",
        sc: 8.8,
        preShow: true,
        star: "范·迪塞尔、杰森·斯坦森",
        showInfo: "今天 120家影院放映"
    },
    {
        id: 1003,
        img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=avengers%205%20marvel%20superhero%20movie%20poster%20epic%20battle&image_size=square_hd",
        nm: "复仇者联盟5：秘密战争",
        version: "v3d imax",
        sc: 9.2,
        preShow: true,
        star: "小罗伯特·唐尼、克里斯·埃文斯",
        showInfo: "今天 180家影院放映"
    },
    {
        id: 1004,
        img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=zootopia%202%20disney%20animation%20movie%20poster%20cute%20rabbit%20fox&image_size=square_hd",
        nm: "疯狂动物城2",
        version: "v2d imax",
        sc: 9.1,
        preShow: true,
        star: "金妮弗·古德温、杰森·贝特曼",
        showInfo: "今天 90家影院放映"
    },
    {
        id: 1005,
        img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=spider%20man%20beyond%20the%20spider%20verse%20movie%20poster%20animation%20colorful&image_size=square_hd",
        nm: "蜘蛛侠：穿越多元宇宙",
        version: "v3d imax",
        sc: 9.3,
        preShow: true,
        star: "沙梅克·摩尔、海莉·斯坦菲尔德",
        showInfo: "今天 110家影院放映"
    },
    {
        id: 1006,
        img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=detective%20chinatown%204%20movie%20poster%20comedy%20mystery%20chinese&image_size=square_hd",
        nm: "唐人街探案4",
        version: "v2d imax",
        sc: 8.5,
        preShow: true,
        star: "王宝强、刘昊然",
        showInfo: "今天 160家影院放映"
    },
    {
        id: 1007,
        img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=godzilla%20x%20kong%20new%20empire%20movie%20poster%20monsters%20battle&image_size=square_hd",
        nm: "哥斯拉大战金刚3",
        version: "v3d imax",
        sc: 8.2,
        preShow: true,
        star: "丽贝卡·豪尔、布莱恩·泰里·亨利",
        showInfo: "今天 130家影院放映"
    },
    {
        id: 1008,
        img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=inside%20out%202%20disney%20pixar%20movie%20poster%20emotions%20colorful%20animation&image_size=square_hd",
        nm: "头脑特工队2",
        version: "v3d imax",
        sc: 9.0,
        preShow: true,
        star: "艾米·波勒、玛雅·霍克",
        showInfo: "今天 85家影院放映"
    }
];

export default {
    name: "Hotshow",
    created() {
        let that = this;
        this.axios.get("/ajax/movieOnInfoList").then(res => {
            if (res.data && res.data.movieList && res.data.movieList.length > 0) {
                this.movieList = res.data.movieList;
                this.movieIds = res.data.movieIds;
            } else {
                this.movieList = mockMovieList;
                this.movieIds = mockMovieList.map(m => m.id);
            }
            document.addEventListener(
                "scroll",
                this.fangdou(function() {
                    that.getMoreInfo(this.movieIds);
                }, 500)
            );
        }).catch(() => {
            this.movieList = mockMovieList;
            this.movieIds = mockMovieList.map(m => m.id);
        });
        this.$store.commit("changeHt", "飞猪电影");
    },
    data() {
        return {
            movieList: mockMovieList,
            title: ["购票", "预售"],
            movieIds: mockMovieList.map(m => m.id),
            coming: []
        };
    },
    methods: {
        picFix(wh) {
            if (wh !== undefined) {
                return wh.replace("w.h", "64.90");
            }
        },
        movie_detail(id) {
            this.$router.push({
                name: "movie_detail",
                params: {
                    movieId: id
                }
            });
        },
        // 更多热映电影
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
        getMoreInfo(movieIds) {
            var flag = true;
            var that = this;
            //获得滚动条距离顶部距离
            var scrollTop = document.documentElement.scrollTop;
            // 获取页面高度
            var pageHeight = document.documentElement.scrollHeight;
            // 获取视口高度
            var windowHeight = window.innerHeight;
            if (scrollTop + pageHeight == windowHeight && flag == true) {
                flag = false;
            }
            let arrindex = 12; // 起始数
            let limit = 12; // 显示个数
            let tosee = that.movieIds.splice(arrindex, limit);
            tosee = tosee.join(",");
            that.axios
                .get("/ajax/moreComingList", {
                    params: {
                        token: "",
                        movieIds: tosee
                    }
                })
                .then(res => {
                    that.coming = res.data.coming;
                    if (res.data.coming.length !== 0) {
                        that.movieList = that.movieList.concat(res.data.coming);
                    } else {
                        return false;
                    }
                });
            this.$forceUpdate(); // 迫使 Vue 实例重新渲染。
        }
    },
    components: {
        myButton
    }
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/now_hot.scss";
@import "@/assets/sass/public.scss";
.move-enter {
    transform: translateY(50px);
    opacity: 0;
}
.move-enter-active {
    transition: all 0.8s;
}
.loading {
    position: absolute;
    left: 50%;
    // bottom: -20px;
    transform: translateX(-50%);
}
</style>
