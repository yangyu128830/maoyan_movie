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
            <button class="exchange-btn" @click="showExchangeModal = true">去兑换</button>
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
                <div class="exchange-tabs">
                    <span class="tab-item" :class="{'active': exchangeTab === 'movies'}" @click="exchangeTab = 'movies'">电影票</span>
                    <span class="tab-item" :class="{'active': exchangeTab === 'gifts'}" @click="exchangeTab = 'gifts'">精美礼品</span>
                    <span class="tab-item" :class="{'active': exchangeTab === 'coupons'}" @click="exchangeTab = 'coupons'">优惠券</span>
                    <span class="tab-item" :class="{'active': exchangeTab === 'privileges'}" @click="exchangeTab = 'privileges'">特权</span>
                </div>
                <div class="exchange-list">
                    <div class="exchange-item" v-for="(item, index) in currentExchangeList" :key="index">
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
            exchangeTab: 'movies',
            exchangeMovies: [
                {
                    id: 1,
                    name: '普通厅电影票',
                    description: '可兑换2D/3D普通厅电影票一张',
                    points: 500,
                    stock: 100,
                    img: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=movie%20ticket%20red%20cinema%20ticket%20icon&image_size=square_hd'
                },
                {
                    id: 2,
                    name: 'IMAX电影票',
                    description: '可兑换IMAX厅电影票一张',
                    points: 800,
                    stock: 50,
                    img: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=imax%20cinema%20ticket%20premium%20golden&image_size=square_hd'
                },
                {
                    id: 3,
                    name: '情侣套票',
                    description: '可兑换2张普通厅电影票+爆米花套餐',
                    points: 1200,
                    stock: 30,
                    img: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=couple%20movie%20tickets%20popcorn%20romantic&image_size=square_hd'
                }
            ],
            exchangeGifts: [
                {
                    id: 1,
                    name: '电影周边礼盒',
                    description: '包含海报、钥匙扣、明信片等精美周边',
                    points: 800,
                    stock: 20,
                    img: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=movie%20gift%20box%20merchandise%20poster%20keychain&image_size=square_hd'
                },
                {
                    id: 2,
                    name: '漫威英雄手办',
                    description: '正版漫威超级英雄限量手办一个',
                    points: 2000,
                    stock: 10,
                    img: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=marvel%20superhero%20action%20figure%20toy&image_size=square_hd'
                },
                {
                    id: 3,
                    name: '迪士尼玩偶',
                    description: '正版迪士尼毛绒玩偶一个',
                    points: 1500,
                    stock: 15,
                    img: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=disney%20plush%20toy%20cute%20mickey&image_size=square_hd'
                },
                {
                    id: 4,
                    name: '蓝牙耳机',
                    description: '高品质无线蓝牙耳机一副',
                    points: 3000,
                    stock: 5,
                    img: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=wireless%20bluetooth%20earbuds%20white%20premium&image_size=square_hd'
                }
            ],
            exchangeCoupons: [
                {
                    id: 1,
                    name: '10元电影优惠券',
                    description: '购票满30元可用，有效期30天',
                    points: 100,
                    stock: 200,
                    img: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=10%20yuan%20coupon%20ticket%20voucher&image_size=square_hd'
                },
                {
                    id: 2,
                    name: '20元电影优惠券',
                    description: '购票满50元可用，有效期30天',
                    points: 200,
                    stock: 150,
                    img: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=20%20yuan%20coupon%20ticket%20voucher%20golden&image_size=square_hd'
                },
                {
                    id: 3,
                    name: '50元电影优惠券',
                    description: '购票满100元可用，有效期30天',
                    points: 500,
                    stock: 80,
                    img: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=50%20yuan%20coupon%20premium%20ticket%20voucher&image_size=square_hd'
                },
                {
                    id: 4,
                    name: '爆米花兑换券',
                    description: '可兑换中桶爆米花一份',
                    points: 80,
                    stock: 100,
                    img: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=popcorn%20bucket%20cinema%20snack&image_size=square_hd'
                }
            ],
            exchangePrivileges: [
                {
                    id: 1,
                    name: '线下免排队特权',
                    description: '可享受一次线下购票/取餐免排队特权',
                    points: 300,
                    stock: 0,
                    img: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=vip%20fast%20pass%20skip%20line%20privilege&image_size=square_hd'
                },
                {
                    id: 2,
                    name: '黄金座位预留',
                    description: '购票时可优先选择黄金座位',
                    points: 200,
                    stock: 50,
                    img: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=golden%20cinema%20seat%20premium%20location&image_size=square_hd'
                },
                {
                    id: 3,
                    name: '提前购票特权',
                    description: '新片上映可提前3天购票',
                    points: 150,
                    stock: 100,
                    img: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=early%20access%20ticket%20calendar%20booking&image_size=square_hd'
                },
                {
                    id: 4,
                    name: '生日双倍积分',
                    description: '生日当月购票享双倍积分',
                    points: 100,
                    stock: 200,
                    img: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=birthday%20cake%20double%20points%20celebration&image_size=square_hd'
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
                case 'movies':
                    return this.exchangeMovies;
                case 'gifts':
                    return this.exchangeGifts;
                case 'coupons':
                    return this.exchangeCoupons;
                case 'privileges':
                    return this.exchangePrivileges;
                default:
                    return [];
            }
        }
    },
    methods: {
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

.exchange-btn {
    background: #fff;
    color: #fa709a;
    border: none;
    padding: 12px 40px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
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

.exchange-tabs {
    display: flex;
    margin-bottom: 15px;
    border-bottom: 1px solid #f0f0f0;

    .tab-item {
        flex: 1;
        text-align: center;
        padding: 10px;
        font-size: 13px;
        color: #666;
        cursor: pointer;
        border-bottom: 2px solid transparent;
        transition: all 0.3s ease;
        border-radius: 0;

        &.active {
            background: none;
            color: #E54847;
            border-bottom-color: #E54847;
        }
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
