<template>
    <div class="points-detail">
        <div class="points-header">
            <div class="points-info">
                <span class="points-label">可用积分</span>
                <span class="points-value">{{pointsInfo.points}}</span>
            </div>
            <div class="points-stats">
                <div class="stat-item">
                    <span class="stat-label">累计获得</span>
                    <span class="stat-value income">+{{pointsInfo.totalEarned}}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">累计消耗</span>
                    <span class="stat-value expense">-{{pointsInfo.totalUsed}}</span>
                </div>
            </div>
            <div class="header-actions">
                <button class="sign-btn" :class="{'signed': isTodaySigned}" @click="handleSignIn">
                    <span v-if="!isTodaySigned">立即签到</span>
                    <span v-else>已签到</span>
                </button>
                <button class="exchange-btn" @click="showExchangeModal = true">去兑换</button>
            </div>
        </div>

        <div class="sign-section">
            <div class="sign-info">
                <div class="sign-streak">
                    <span class="streak-label">连续签到</span>
                    <span class="streak-days">{{signInInfo.streak}}天</span>
                </div>
                <div class="sign-reward">
                    <span class="reward-label">今日可获</span>
                    <span class="reward-points">+{{getTodayReward()}}积分</span>
                </div>
            </div>
            <div class="sign-calendar">
                <div class="calendar-header">
                    <span>签到日历</span>
                    <span class="month">{{currentMonth}}</span>
                </div>
                <div class="calendar-week">
                    <span class="week-day" v-for="day in weekDays" :key="day">{{day}}</span>
                </div>
                <div class="calendar-days">
                    <div 
                        class="calendar-day" 
                        v-for="(day, index) in calendarDays" 
                        :key="index"
                        :class="{'signed': day.isSigned, 'today': day.isToday, 'empty': day.isEmpty}"
                    >
                        <span v-if="!day.isEmpty">{{day.day}}</span>
                        <span class="check-icon" v-if="day.isSigned">✓</span>
                    </div>
                </div>
            </div>
            <div class="streak-rewards">
                <div class="rewards-header">
                    <span>连续签到奖励</span>
                </div>
                <div class="rewards-list">
                    <div 
                        class="reward-item" 
                        v-for="(reward, index) in streakRewards" 
                        :key="index"
                        :class="{'achieved': signInInfo.streak >= reward.days}"
                    >
                        <div class="reward-icon">
                            <span v-if="signInInfo.streak >= reward.days">🎁</span>
                            <span v-else>🔒</span>
                        </div>
                        <div class="reward-info">
                            <span class="reward-days">连续{{reward.days}}天</span>
                            <span class="reward-points-text">+{{reward.points}}积分</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="record-section">
            <div class="section-header">
                <h3>积分明细</h3>
                <div class="record-tabs">
                    <span class="tab-item" :class="{'active': pointsRecordType === 'all'}" @click="pointsRecordType = 'all'">全部</span>
                    <span class="tab-item" :class="{'active': pointsRecordType === 'income'}" @click="pointsRecordType = 'income'">获得</span>
                    <span class="tab-item" :class="{'active': pointsRecordType === 'expense'}" @click="pointsRecordType = 'expense'">消耗</span>
                </div>
            </div>
            <div class="record-list" v-if="filteredPointsRecords.length > 0">
                <div class="points-record-item" v-for="(record, index) in filteredPointsRecords" :key="index">
                    <div class="record-icon" :class="record.type">
                        <span>{{record.icon}}</span>
                    </div>
                    <div class="record-info">
                        <h4 class="record-title">{{record.title}}</h4>
                        <p class="record-desc">{{record.description}}</p>
                        <p class="record-time">{{record.time}}</p>
                    </div>
                    <div class="record-amount" :class="record.type">
                        <span>{{record.type === 'income' ? '+' : '-'}}{{record.amount}}积分</span>
                    </div>
                </div>
            </div>
            <div class="no-record" v-else>
                <p>暂无积分明细</p>
            </div>
        </div>

        <div class="exchange-modal" v-if="showExchangeModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>积分兑换</h3>
                    <span class="close-btn" @click="showExchangeModal = false">×</span>
                </div>
                <div class="exchange-category-tabs">
                    <div class="category-tab-item" :class="{'active': exchangeCategory === 'coupons'}" @click="exchangeCategory = 'coupons'">
                        <span class="category-icon">🎫</span>
                        <span class="category-name">优惠券/代金券</span>
                    </div>
                    <div class="category-tab-item" :class="{'active': exchangeCategory === 'gifts'}" @click="exchangeCategory = 'gifts'">
                        <span class="category-icon">🎁</span>
                        <span class="category-name">礼品/现金红包</span>
                    </div>
                </div>
                <div class="exchange-sub-tabs" v-if="exchangeCategory === 'coupons'">
                    <span class="sub-tab-item" :class="{'active': exchangeTab === 'movieCoupons'}" @click="exchangeTab = 'movieCoupons'">电影优惠券</span>
                    <span class="sub-tab-item" :class="{'active': exchangeTab === 'vouchers'}" @click="exchangeTab = 'vouchers'">代金券</span>
                </div>
                <div class="exchange-sub-tabs" v-else>
                    <span class="sub-tab-item" :class="{'active': exchangeTab === 'gifts'}" @click="exchangeTab = 'gifts'">精美礼品</span>
                    <span class="sub-tab-item" :class="{'active': exchangeTab === 'redPackets'}" @click="exchangeTab = 'redPackets'">现金红包</span>
                </div>
                <div class="exchange-filter">
                    <span class="filter-label">排序：</span>
                    <span class="filter-item" :class="{'active': sortBy === 'default'}" @click="sortBy = 'default'">默认</span>
                    <span class="filter-item" :class="{'active': sortBy === 'pointsAsc'}" @click="sortBy = 'pointsAsc'">积分从低到高</span>
                    <span class="filter-item" :class="{'active': sortBy === 'pointsDesc'}" @click="sortBy = 'pointsDesc'">积分从高到低</span>
                </div>
                <div class="exchange-list">
                    <div class="exchange-item" v-for="(item, index) in sortedExchangeList" :key="item.id">
                        <div class="item-img">
                            <img :src="item.img" alt="">
                        </div>
                        <div class="item-info">
                            <h4 class="item-name">{{item.name}}</h4>
                            <p class="item-desc">{{item.description}}</p>
                            <div class="item-required">
                                <span class="required-points">{{item.points}}积分</span>
                                <span class="stock" :class="{'out': item.stock === 0}">库存:{{item.stock}}</span>
                            </div>
                        </div>
                        <button class="exchange-btn-item" :class="{'disabled': isExchangeDisabled(item)}" @click="handleExchange(item)">
                            {{getExchangeButtonText(item)}}
                        </button>
                    </div>
                    <div class="no-exchange-items" v-if="sortedExchangeList.length === 0">
                        <p>暂无兑换商品</p>
                    </div>
                </div>
                <div class="my-exchanges">
                    <h4>我的兑换记录</h4>
                    <div class="exchange-record-list" v-if="myExchanges.length > 0">
                        <div class="exchange-record-item" v-for="(record, index) in myExchanges" :key="index">
                            <div class="record-icon-ex">
                                <span>{{record.icon}}</span>
                            </div>
                            <div class="record-info-ex">
                                <h5>{{record.name}}</h5>
                                <p class="record-points">{{record.points}}积分</p>
                                <p class="record-time-ex">{{record.time}}</p>
                            </div>
                            <span class="record-status-ex" :class="record.status">{{record.statusText}}</span>
                        </div>
                    </div>
                    <div class="no-exchange" v-else>
                        <p>暂无兑换记录</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PointsDetail',
    created() {
        this.$store.commit('changeHt', '消费积分');
    },
    data() {
        return {
            pointsInfo: {
                points: 2580,
                totalEarned: 5680,
                totalUsed: 3100
            },
            signInInfo: {
                streak: 5,
                lastSignDate: null,
                signedDates: []
            },
            weekDays: ['日', '一', '二', '三', '四', '五', '六'],
            streakRewards: [
                { days: 3, points: 20 },
                { days: 7, points: 50 },
                { days: 15, points: 100 },
                { days: 30, points: 300 }
            ],
            pointsRecordType: 'all',
            pointsRecords: [
                {
                    id: 1,
                    type: 'income',
                    icon: '✨',
                    title: '购票获得积分',
                    description: '购买流浪地球3获得积分',
                    amount: 68,
                    time: '2026-04-20 14:30:00'
                },
                {
                    id: 2,
                    type: 'income',
                    icon: '✨',
                    title: '购票获得积分',
                    description: '购买速度与激情11获得积分',
                    amount: 136,
                    time: '2026-04-18 20:00:00'
                },
                {
                    id: 3,
                    type: 'expense',
                    icon: '🎫',
                    title: '兑换优惠券',
                    description: '兑换20元电影优惠券',
                    amount: 200,
                    time: '2026-04-17 11:20:00'
                },
                {
                    id: 4,
                    type: 'income',
                    icon: '✨',
                    title: '每日签到',
                    description: '连续签到第7天奖励',
                    amount: 50,
                    time: '2026-04-16 08:00:00'
                },
                {
                    id: 5,
                    type: 'income',
                    icon: '✨',
                    title: '评论获得积分',
                    description: '评论疯狂动物城2获得积分',
                    amount: 20,
                    time: '2026-04-11 16:30:00'
                },
                {
                    id: 6,
                    type: 'expense',
                    icon: '🎬',
                    title: '兑换电影票',
                    description: '兑换普通厅电影票一张',
                    amount: 500,
                    time: '2026-04-10 10:15:00'
                },
                {
                    id: 7,
                    type: 'income',
                    icon: '✨',
                    title: '充值赠送积分',
                    description: 'VIP充值500元额外赠送50积分',
                    amount: 50,
                    time: '2026-04-01 09:15:00'
                },
                {
                    id: 8,
                    type: 'expense',
                    icon: '🎁',
                    title: '兑换礼品',
                    description: '兑换电影周边礼盒',
                    amount: 800,
                    time: '2026-03-25 14:00:00'
                }
            ],
            showExchangeModal: false,
            exchangeCategory: 'coupons',
            exchangeTab: 'movieCoupons',
            sortBy: 'default',
            movieCoupons: [
                {
                    id: 101,
                    name: '10元电影优惠券',
                    description: '购票满30元可用，有效期30天',
                    points: 100,
                    stock: 200,
                    img: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=10%20yuan%20coupon%20ticket%20voucher&image_size=square_hd'
                },
                {
                    id: 102,
                    name: '20元电影优惠券',
                    description: '购票满50元可用，有效期30天',
                    points: 200,
                    stock: 150,
                    img: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=20%20yuan%20coupon%20ticket%20voucher%20golden&image_size=square_hd'
                },
                {
                    id: 103,
                    name: '50元电影优惠券',
                    description: '购票满100元可用，有效期30天',
                    points: 500,
                    stock: 80,
                    img: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=50%20yuan%20coupon%20premium%20ticket%20voucher&image_size=square_hd'
                },
                {
                    id: 104,
                    name: 'IMAX专享优惠券',
                    description: 'IMAX场次专用，满150减40',
                    points: 300,
                    stock: 100,
                    img: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=imax%20cinema%20coupon%20premium%20ticket&image_size=square_hd'
                }
            ],
            vouchers: [
                {
                    id: 201,
                    name: '50元代金券',
                    description: '全场通用，无门槛使用',
                    points: 500,
                    stock: 100,
                    img: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=50%20yuan%20voucher%20golden%20ticket&image_size=square_hd'
                },
                {
                    id: 202,
                    name: '100元代金券',
                    description: '全场通用，无门槛使用',
                    points: 1000,
                    stock: 50,
                    img: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=100%20yuan%20voucher%20premium%20golden&image_size=square_hd'
                },
                {
                    id: 203,
                    name: '200元代金券',
                    description: '全场通用，无门槛使用',
                    points: 2000,
                    stock: 30,
                    img: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=200%20yuan%20voucher%20luxury%20golden&image_size=square_hd'
                },
                {
                    id: 204,
                    name: '爆米花兑换券',
                    description: '可兑换中桶爆米花一份',
                    points: 80,
                    stock: 100,
                    img: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=popcorn%20bucket%20cinema%20snack&image_size=square_hd'
                }
            ],
            exchangeGifts: [
                {
                    id: 301,
                    name: '电影周边礼盒',
                    description: '包含海报、钥匙扣、明信片等精美周边',
                    points: 800,
                    stock: 20,
                    img: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=movie%20gift%20box%20merchandise%20poster%20keychain&image_size=square_hd'
                },
                {
                    id: 302,
                    name: '漫威英雄手办',
                    description: '正版漫威超级英雄限量手办一个',
                    points: 2000,
                    stock: 10,
                    img: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=marvel%20superhero%20action%20figure%20toy&image_size=square_hd'
                },
                {
                    id: 303,
                    name: '迪士尼玩偶',
                    description: '正版迪士尼毛绒玩偶一个',
                    points: 1500,
                    stock: 15,
                    img: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=disney%20plush%20toy%20cute%20mickey&image_size=square_hd'
                },
                {
                    id: 304,
                    name: '蓝牙耳机',
                    description: '高品质无线蓝牙耳机一副',
                    points: 3000,
                    stock: 5,
                    img: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=wireless%20bluetooth%20earbuds%20white%20premium&image_size=square_hd'
                },
                {
                    id: 305,
                    name: '电影主题T恤',
                    description: '限量版电影主题纯棉T恤一件',
                    points: 600,
                    stock: 50,
                    img: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=movie%20theme%20tshirt%20black%20cinema&image_size=square_hd'
                }
            ],
            redPackets: [
                {
                    id: 401,
                    name: '1元现金红包',
                    description: '直接发放到账户余额',
                    points: 100,
                    stock: 500,
                    img: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=red%20envelope%20money%20cash%20gift&image_size=square_hd'
                },
                {
                    id: 402,
                    name: '5元现金红包',
                    description: '直接发放到账户余额',
                    points: 500,
                    stock: 300,
                    img: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=red%20envelope%205%20yuan%20money%20gift&image_size=square_hd'
                },
                {
                    id: 403,
                    name: '10元现金红包',
                    description: '直接发放到账户余额',
                    points: 1000,
                    stock: 200,
                    img: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=red%20envelope%2010%20yuan%20money%20gift&image_size=square_hd'
                },
                {
                    id: 404,
                    name: '20元现金红包',
                    description: '直接发放到账户余额',
                    points: 2000,
                    stock: 100,
                    img: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=red%20envelope%2020%20yuan%20money%20gift&image_size=square_hd'
                },
                {
                    id: 405,
                    name: '50元现金红包',
                    description: '直接发放到账户余额，VIP专属',
                    points: 5000,
                    stock: 50,
                    img: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=red%20envelope%2050%20yuan%20premium%20money&image_size=square_hd'
                }
            ],
            myExchanges: [
                {
                    id: 1,
                    name: '20元电影优惠券',
                    icon: '🎫',
                    points: 200,
                    time: '2026-04-17 11:20:00',
                    status: 'used',
                    statusText: '已使用'
                },
                {
                    id: 2,
                    name: '普通厅电影票',
                    icon: '🎬',
                    points: 500,
                    time: '2026-04-10 10:15:00',
                    status: 'used',
                    statusText: '已使用'
                },
                {
                    id: 3,
                    name: '电影周边礼盒',
                    icon: '🎁',
                    points: 800,
                    time: '2026-03-25 14:00:00',
                    status: 'delivered',
                    statusText: '已收货'
                }
            ]
        };
    },
    computed: {
        filteredPointsRecords() {
            if (this.pointsRecordType === 'all') {
                return this.pointsRecords;
            }
            return this.pointsRecords.filter(r => r.type === this.pointsRecordType);
        },
        currentExchangeList() {
            switch (this.exchangeTab) {
                case 'movieCoupons':
                    return this.movieCoupons;
                case 'vouchers':
                    return this.vouchers;
                case 'gifts':
                    return this.exchangeGifts;
                case 'redPackets':
                    return this.redPackets;
                default:
                    return [];
            }
        },
        sortedExchangeList() {
            let list = [...this.currentExchangeList];
            
            switch (this.sortBy) {
                case 'pointsAsc':
                    list.sort((a, b) => a.points - b.points);
                    break;
                case 'pointsDesc':
                    list.sort((a, b) => b.points - a.points);
                    break;
                default:
                    break;
            }
            
            return list;
        },
        isTodaySigned() {
            const today = this.getDateKey(new Date());
            return this.signInInfo.signedDates.includes(today);
        },
        currentMonth() {
            const now = new Date();
            return `${now.getFullYear()}年${now.getMonth() + 1}月`;
        },
        calendarDays() {
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth();
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const daysInMonth = lastDay.getDate();
            const firstDayOfWeek = firstDay.getDay();
            
            const days = [];
            
            for (let i = 0; i < firstDayOfWeek; i++) {
                days.push({ day: '', isEmpty: true, isSigned: false, isToday: false });
            }
            
            for (let i = 1; i <= daysInMonth; i++) {
                const date = new Date(year, month, i);
                const dateKey = this.getDateKey(date);
                const isToday = this.getDateKey(new Date()) === dateKey;
                const isSigned = this.signInInfo.signedDates.includes(dateKey);
                
                days.push({
                    day: i,
                    isEmpty: false,
                    isSigned: isSigned,
                    isToday: isToday
                });
            }
            
            return days;
        }
    },
    methods: {
        getDateKey(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },
        getTodayReward() {
            const baseReward = 10;
            const streakReward = Math.min(this.signInInfo.streak * 2, 20);
            return baseReward + streakReward;
        },
        handleSignIn() {
            if (this.isTodaySigned) {
                this.$toast('今日已签到，请明天再来~');
                return;
            }

            const today = this.getDateKey(new Date());
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayKey = this.getDateKey(yesterday);

            if (this.signInInfo.signedDates.includes(yesterdayKey)) {
                this.signInInfo.streak++;
            } else {
                this.signInInfo.streak = 1;
            }

            this.signInInfo.signedDates.push(today);
            this.signInInfo.lastSignDate = today;

            const reward = this.getTodayReward();
            this.pointsInfo.points += reward;
            this.pointsInfo.totalEarned += reward;

            this.pointsRecords.unshift({
                id: Date.now(),
                type: 'income',
                icon: '✨',
                title: '每日签到',
                description: `连续签到第${this.signInInfo.streak}天`,
                amount: reward,
                time: this.formatTime(new Date())
            });

            this.$toast(`签到成功！获得 ${reward} 积分`);
        },
        isExchangeDisabled(item) {
            return item.stock === 0 || this.pointsInfo.points < item.points;
        },
        getExchangeButtonText(item) {
            if (item.stock === 0) {
                return '已兑完';
            }
            if (this.pointsInfo.points < item.points) {
                return '积分不足';
            }
            return '兑换';
        },
        handleExchange(item) {
            if (item.stock === 0) {
                this.$toast('该商品已兑完');
                return;
            }
            if (this.pointsInfo.points < item.points) {
                this.$toast('积分不足');
                return;
            }

            this.pointsInfo.points -= item.points;
            this.pointsInfo.totalUsed += item.points;

            this.pointsRecords.unshift({
                id: Date.now(),
                type: 'expense',
                icon: item.name.includes('电影票') ? '🎬' : (item.name.includes('优惠券') ? '🎫' : (item.name.includes('特权') ? '⭐' : '🎁')),
                title: '兑换商品',
                description: `兑换${item.name}`,
                amount: item.points,
                time: this.formatTime(new Date())
            });

            this.myExchanges.unshift({
                id: Date.now(),
                name: item.name,
                icon: item.name.includes('电影票') ? '🎬' : (item.name.includes('优惠券') ? '🎫' : (item.name.includes('特权') ? '⭐' : '🎁')),
                points: item.points,
                time: this.formatTime(new Date()),
                status: 'pending',
                statusText: '待发货'
            });

            item.stock--;

            this.$toast('兑换成功');
        },
        formatTime(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hour = String(date.getHours()).padStart(2, '0');
            const minute = String(date.getMinutes()).padStart(2, '0');
            const second = String(date.getSeconds()).padStart(2, '0');
            return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
        }
    }
};
</script>

<style lang="scss" scoped>
.points-detail {
    background-color: #f5f5f5;
    min-height: 100vh;
}

.points-header {
    background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
    padding: 30px 20px;
    text-align: center;
}

.points-info {
    margin-bottom: 20px;
}

.points-label {
    display: block;
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
    margin-bottom: 8px;
}

.points-value {
    color: #fff;
    font-size: 36px;
    font-weight: bold;
}

.points-stats {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
    padding: 15px 0;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-item {
    text-align: center;
}

.stat-label {
    display: block;
    color: rgba(255, 255, 255, 0.7);
    font-size: 12px;
    margin-bottom: 5px;
}

.stat-value {
    color: #fff;
    font-size: 16px;
    font-weight: bold;

    &.income {
        color: #a8e6cf;
    }

    &.expense {
        color: #ffd3b6;
    }
}

.header-actions {
    display: flex;
    justify-content: center;
    gap: 15px;
}

.sign-btn {
    background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
    color: #fff;
    border: none;
    padding: 12px 30px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;

    &.signed {
        background: #ccc;
        cursor: not-allowed;
    }
}

.exchange-btn {
    background: #fff;
    color: #fa709a;
    border: none;
    padding: 12px 30px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
}

.sign-section {
    background: #fff;
    margin: 15px;
    border-radius: 12px;
    padding: 15px;
}

.sign-info {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
    padding: 15px;
    background: linear-gradient(135deg, #fff5f7 0%, #fff0f3 100%);
    border-radius: 10px;
}

.sign-streak,
.sign-reward {
    text-align: center;
}

.streak-label,
.reward-label {
    display: block;
    font-size: 12px;
    color: #999;
    margin-bottom: 5px;
}

.streak-days {
    font-size: 24px;
    font-weight: bold;
    color: #E54847;
}

.reward-points {
    font-size: 24px;
    font-weight: bold;
    color: #4caf50;
}

.sign-calendar {
    margin-bottom: 20px;
}

.calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;

    span {
        font-size: 14px;
        font-weight: bold;
        color: #333;
    }

    .month {
        font-size: 12px;
        color: #999;
        font-weight: normal;
    }
}

.calendar-week {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    margin-bottom: 10px;
}

.week-day {
    text-align: center;
    font-size: 12px;
    color: #999;
    padding: 5px 0;
}

.calendar-days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px;
}

.calendar-day {
    aspect-ratio: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    font-size: 13px;
    color: #333;
    position: relative;

    &.empty {
        background: none;
    }

    &.today {
        background: #fff5f5;
        border: 2px solid #E54847;
        font-weight: bold;
        color: #E54847;
    }

    &.signed {
        background: linear-gradient(135deg, #E54847 0%, #ff6b6b 100%);
        color: #fff;

        .check-icon {
            font-size: 10px;
            margin-top: 2px;
        }
    }
}

.streak-rewards {
    padding-top: 15px;
    border-top: 1px solid #f0f0f0;
}

.rewards-header {
    margin-bottom: 15px;

    span {
        font-size: 14px;
        font-weight: bold;
        color: #333;
    }
}

.rewards-list {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
}

.reward-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px 5px;
    background: #f9f9f9;
    border-radius: 8px;
    opacity: 0.5;
    transition: all 0.3s ease;

    &.achieved {
        opacity: 1;
        background: #fff5f5;
    }
}

.reward-icon {
    font-size: 24px;
    margin-bottom: 5px;
}

.reward-info {
    text-align: center;
}

.reward-days {
    display: block;
    font-size: 11px;
    color: #666;
    margin-bottom: 2px;
}

.reward-points-text {
    display: block;
    font-size: 12px;
    font-weight: bold;
    color: #E54847;
}

.record-section {
    background: #fff;
    margin: 15px;
    border-radius: 10px;
    padding: 15px;
}

.section-header {
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f0f0f0;
}

.section-header h3 {
    font-size: 16px;
    color: #333;
    margin-bottom: 10px;
}

.record-tabs {
    display: flex;
    gap: 10px;
}

.tab-item {
    font-size: 12px;
    color: #999;
    padding: 4px 12px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;

    &.active {
        background: #fa709a;
        color: #fff;
    }
}

.record-list {
    .points-record-item {
        display: flex;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid #f5f5f5;

        &:last-child {
            border-bottom: none;
        }
    }
}

.record-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    font-size: 18px;

    &.income {
        background: #e8f5e9;
    }

    &.expense {
        background: #ffebee;
    }
}

.record-info {
    flex: 1;
}

.record-title {
    font-size: 14px;
    color: #333;
    margin-bottom: 3px;
}

.record-desc {
    font-size: 12px;
    color: #999;
    margin-bottom: 3px;
}

.record-time {
    font-size: 11px;
    color: #bbb;
}

.record-amount {
    font-size: 16px;
    font-weight: bold;

    &.income {
        color: #4caf50;
    }

    &.expense {
        color: #E54847;
    }
}

.no-record {
    text-align: center;
    padding: 40px 0;
    color: #999;
    font-size: 14px;
}

.exchange-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: flex-end;
    z-index: 1000;
}

.modal-content {
    width: 100%;
    background: #fff;
    border-radius: 15px 15px 0 0;
    padding: 20px;
    max-height: 80vh;
    overflow-y: auto;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h3 {
        font-size: 16px;
        color: #333;
    }

    .close-btn {
        font-size: 24px;
        color: #999;
        cursor: pointer;
    }
}

.exchange-category-tabs {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin-bottom: 15px;
}

.category-tab-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px 10px;
    background: #f9f9f9;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid transparent;

    &.active {
        background: #fff5f5;
        border-color: #E54847;
    }
}

.category-icon {
    font-size: 28px;
    margin-bottom: 5px;
}

.category-name {
    font-size: 13px;
    color: #333;
    font-weight: 500;
}

.exchange-sub-tabs {
    display: flex;
    margin-bottom: 15px;
    border-bottom: 1px solid #f0f0f0;
}

.sub-tab-item {
    flex: 1;
    text-align: center;
    padding: 10px;
    font-size: 13px;
    color: #666;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: all 0.3s ease;

    &.active {
        color: #E54847;
        border-bottom-color: #E54847;
        font-weight: bold;
    }
}

.exchange-filter {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
    padding: 10px;
    background: #fafafa;
    border-radius: 8px;
}

.filter-label {
    font-size: 12px;
    color: #666;
}

.filter-item {
    font-size: 12px;
    color: #999;
    padding: 4px 12px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;

    &.active {
        background: #E54847;
        color: #fff;
    }
}

.no-exchange-items {
    text-align: center;
    padding: 40px 0;

    p {
        font-size: 14px;
        color: #999;
    }
}

.exchange-list {
    margin-bottom: 20px;
}

.exchange-item {
    display: flex;
    align-items: center;
    padding: 12px;
    background: #f9f9f9;
    border-radius: 10px;
    margin-bottom: 10px;
}

.item-img {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    overflow: hidden;
    margin-right: 12px;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

.item-info {
    flex: 1;
}

.item-name {
    font-size: 14px;
    color: #333;
    margin-bottom: 4px;
}

.item-desc {
    font-size: 11px;
    color: #999;
    margin-bottom: 6px;
    line-height: 1.4;
}

.item-required {
    display: flex;
    align-items: center;
    gap: 10px;
}

.required-points {
    font-size: 13px;
    color: #E54847;
    font-weight: bold;
}

.stock {
    font-size: 11px;
    color: #999;

    &.out {
        color: #f44336;
    }
}

.exchange-btn-item {
    background: #E54847;
    color: #fff;
    border: none;
    padding: 8px 16px;
    border-radius: 15px;
    font-size: 12px;
    cursor: pointer;
    white-space: nowrap;

    &.disabled {
        background: #ccc;
        cursor: not-allowed;
    }
}

.my-exchanges {
    h4 {
        font-size: 14px;
        color: #333;
        margin-bottom: 10px;
        padding-bottom: 8px;
        border-bottom: 1px solid #f0f0f0;
    }
}

.exchange-record-list {
    .exchange-record-item {
        display: flex;
        align-items: center;
        padding: 10px 0;
        border-bottom: 1px solid #f5f5f5;

        &:last-child {
            border-bottom: none;
        }
    }
}

.record-icon-ex {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    font-size: 16px;
}

.record-info-ex {
    flex: 1;

    h5 {
        font-size: 13px;
        color: #333;
        margin-bottom: 3px;
    }

    .record-points {
        font-size: 12px;
        color: #E54847;
        margin-bottom: 2px;
    }

    .record-time-ex {
        font-size: 10px;
        color: #bbb;
    }
}

.record-status-ex {
    font-size: 11px;
    padding: 3px 10px;
    border-radius: 10px;

    &.used {
        background: #e3f2fd;
        color: #2196f3;
    }

    &.delivered {
        background: #e8f5e9;
        color: #4caf50;
    }

    &.pending {
        background: #fff3e0;
        color: #ff9800;
    }
}

.no-exchange {
    text-align: center;
    padding: 30px 0;
    color: #999;
    font-size: 14px;
}
</style>
