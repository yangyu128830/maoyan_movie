<template>
    <div class="buy-benefit-page">
        <div class="page-header">
            <div class="back-btn" @click="goBack">
                <span>← 返回</span>
            </div>
            <h1 class="page-title">购票优惠</h1>
            <div class="user-info">
                <span class="user-level">{{userLevel.shortName}}会员</span>
            </div>
        </div>

        <div class="benefit-banner">
            <div class="banner-content">
                <div class="banner-icon">💸</div>
                <div class="banner-text">
                    <h2>会员专属优惠</h2>
                    <p>会员价购票 · 低价周边 · 专属特权</p>
                </div>
            </div>
        </div>

        <div class="tabs-section">
            <div class="tabs">
                <div 
                    class="tab-item" 
                    :class="{ active: activeTab === 'movie' }"
                    @click="activeTab = 'movie'"
                >
                    <span class="tab-icon">🎬</span>
                    <span class="tab-text">会员价购票</span>
                </div>
                <div 
                    class="tab-item" 
                    :class="{ active: activeTab === 'merchandise' }"
                    @click="activeTab = 'merchandise'"
                >
                    <span class="tab-icon">🎁</span>
                    <span class="tab-text">低价周边</span>
                </div>
            </div>
        </div>

        <div class="content-section">
            <div class="movie-section" v-if="activeTab === 'movie'">
                <div class="section-intro">
                    <h3>🎫 会员价购买电影票</h3>
                    <p>所有会员均可享受购票专属折扣，比普通用户更便宜！</p>
                </div>

                <div class="privilege-tips">
                    <div class="tip-item">
                        <span class="tip-icon">✨</span>
                        <span class="tip-text">当前等级：{{ userLevel.name }}</span>
                    </div>
                    <div class="tip-item">
                        <span class="tip-icon">💎</span>
                        <span class="tip-text">专属折扣：最高8.3折</span>
                    </div>
                    <div class="tip-item">
                        <span class="tip-icon">🎁</span>
                        <span class="tip-text">积分双倍：购票积分双倍获取</span>
                    </div>
                </div>

                <div class="movie-list">
                    <div 
                        class="movie-card" 
                        v-for="ticket in vipMovieTickets" 
                        :key="ticket.id"
                    >
                        <div class="movie-image-wrapper">
                            <img :src="ticket.image" :alt="ticket.name" class="movie-image">
                            <div class="movie-discount">
                                <span class="discount-badge">{{getDiscountText(ticket.discount)}}</span>
                            </div>
                        </div>
                        <div class="movie-content">
                            <h4 class="movie-name">{{ ticket.name }}</h4>
                            <div class="movie-meta">
                                <span class="meta-item">🎭 {{ ticket.category }}</span>
                                <span class="meta-item">📅 {{ ticket.date }}</span>
                                <span class="meta-item">📍 {{ ticket.venue }}</span>
                            </div>
                            <div class="movie-price-section">
                                <div class="price-info">
                                    <span class="original-price">¥{{ ticket.originalPrice }}</span>
                                    <span class="vip-price">
                                        <span class="vip-label">会员价</span>
                                        <span class="price-value">¥{{ ticket.vipPrice }}</span>
                                    </span>
                                    <span class="save-amount">
                                        省¥{{ ticket.originalPrice - ticket.vipPrice }}
                                    </span>
                                </div>
                                <button 
                                    class="buy-btn" 
                                    @click="buyVipMovieTicket(ticket)"
                                >
                                    立即购票
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="empty-state" v-if="vipMovieTickets.length === 0">
                    <div class="empty-icon">🎬</div>
                    <p>暂无热映电影，敬请期待</p>
                </div>
            </div>

            <div class="merchandise-section" v-else>
                <div class="section-intro">
                    <h3>🎁 低价购买周边</h3>
                    <p>会员专享价购买正版电影周边，品质保证，价格优惠！</p>
                </div>

                <div class="privilege-tips">
                    <div class="tip-item">
                        <span class="tip-icon">✅</span>
                        <span class="tip-text">正品保证：官方授权正版周边</span>
                    </div>
                    <div class="tip-item">
                        <span class="tip-icon">🚚</span>
                        <span class="tip-text">快速配送：全国包邮配送</span>
                    </div>
                    <div class="tip-item">
                        <span class="tip-icon">💰</span>
                        <span class="tip-text">低价优惠：最低6.6折起</span>
                    </div>
                </div>

                <div class="merchandise-grid">
                    <div 
                        class="merchandise-card" 
                        v-for="item in movieMerchandise" 
                        :key="item.id"
                    >
                        <div class="merchandise-image-wrapper">
                            <img :src="item.image" :alt="item.name" class="merchandise-image">
                            <div class="merchandise-discount">
                                <span class="discount-badge">{{getDiscountText(item.discount)}}</span>
                            </div>
                            <div class="merchandise-stock" :class="{ 'out': item.stock === 0 }">
                                <span v-if="item.stock > 0">库存: {{ item.stock }}</span>
                                <span v-else>已售罄</span>
                            </div>
                        </div>
                        <div class="merchandise-content">
                            <h4 class="merchandise-name">{{ item.name }}</h4>
                            <div class="merchandise-category">
                                <span class="category-tag">{{ item.category }}</span>
                            </div>
                            <div class="merchandise-price-section">
                                <div class="price-info">
                                    <span class="original-price">¥{{ item.originalPrice }}</span>
                                    <span class="vip-price">
                                        <span class="vip-label">会员价</span>
                                        <span class="price-value">¥{{ item.vipPrice }}</span>
                                    </span>
                                    <span class="save-amount">
                                        省¥{{ item.originalPrice - item.vipPrice }}
                                    </span>
                                </div>
                                <button 
                                    class="buy-btn" 
                                    :class="{ 'disabled': item.stock === 0 }"
                                    :disabled="item.stock === 0"
                                    @click="buyMerchandise(item)"
                                >
                                    <span v-if="item.stock > 0">立即购买</span>
                                    <span v-else>已售罄</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="empty-state" v-if="movieMerchandise.length === 0">
                    <div class="empty-icon">🎁</div>
                    <p>暂无周边商品，敬请期待</p>
                </div>
            </div>
        </div>

        <div class="toast" :class="{'show': showToast}">
            <span>{{toastMessage}}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'BuyBenefit',
    created() {
        this.$store.commit('changeHt', '购票优惠');
    },
    data() {
        return {
            activeTab: 'movie',
            showToast: false,
            toastMessage: '',
            userInfo: {
                vipLevel: 3
            },
            vipLevels: [
                {
                    level: 1,
                    name: '青铜会员',
                    shortName: '青铜',
                    icon: '🥉'
                },
                {
                    level: 2,
                    name: '白银会员',
                    shortName: '白银',
                    icon: '🥈'
                },
                {
                    level: 3,
                    name: '黄金会员',
                    shortName: '黄金',
                    icon: '🥇'
                },
                {
                    level: 4,
                    name: '铂金会员',
                    shortName: '铂金',
                    icon: '💎'
                },
                {
                    level: 5,
                    name: '钻石会员',
                    shortName: '钻石',
                    icon: '👑'
                }
            ],
            vipMovieTickets: [
                {
                    id: 101,
                    name: '流浪地球3',
                    category: '科幻',
                    date: '2026-04-25 19:30',
                    venue: '万达影城（朝阳店）',
                    originalPrice: 68,
                    vipPrice: 58,
                    discount: 0.85,
                    minLevel: 1,
                    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=sci-fi%20movie%20poster%20space%20earth%20futuristic&image_size=square_hd'
                },
                {
                    id: 102,
                    name: '速度与激情11',
                    category: '动作',
                    date: '2026-04-26 20:00',
                    venue: 'CGV影城（国贸店）',
                    originalPrice: 75,
                    vipPrice: 62,
                    discount: 0.83,
                    minLevel: 1,
                    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=action%20movie%20poster%20fast%20cars%20racing%20dynamic&image_size=square_hd'
                },
                {
                    id: 103,
                    name: '疯狂动物城2',
                    category: '动画',
                    date: '2026-04-27 14:30',
                    venue: '金逸影城（中关村店）',
                    originalPrice: 65,
                    vipPrice: 55,
                    discount: 0.85,
                    minLevel: 1,
                    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=animated%20movie%20poster%20cute%20animals%20city%20colorful&image_size=square_hd'
                },
                {
                    id: 104,
                    name: '复仇者联盟5',
                    category: '科幻',
                    date: '2026-04-28 19:00',
                    venue: '百老汇影城（三里屯店）',
                    originalPrice: 85,
                    vipPrice: 72,
                    discount: 0.85,
                    minLevel: 1,
                    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=superhero%20movie%20poster%20epic%20battle%20heroes&image_size=square_hd'
                }
            ],
            movieMerchandise: [
                {
                    id: 201,
                    name: '漫威英雄手办套装',
                    category: '手办',
                    originalPrice: 299,
                    vipPrice: 199,
                    discount: 0.67,
                    stock: 50,
                    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=marvel%20action%20figures%20collection%20superhero%20toys&image_size=square_hd'
                },
                {
                    id: 202,
                    name: '电影主题T恤（限量版）',
                    category: '服装',
                    originalPrice: 129,
                    vipPrice: 89,
                    discount: 0.69,
                    stock: 100,
                    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=movie%20theme%20tshirt%20black%20cinema%20design&image_size=square_hd'
                },
                {
                    id: 203,
                    name: '星球大战光剑（收藏版）',
                    category: '周边',
                    originalPrice: 599,
                    vipPrice: 399,
                    discount: 0.67,
                    stock: 20,
                    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=star%20wars%20lightsaber%20blue%20glowing%20collectible&image_size=square_hd'
                },
                {
                    id: 204,
                    name: '哈利波特魔法棒',
                    category: '周边',
                    originalPrice: 199,
                    vipPrice: 139,
                    discount: 0.7,
                    stock: 80,
                    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=harry%20potter%20magic%20wand%20wooden%20mystical&image_size=square_hd'
                },
                {
                    id: 205,
                    name: '电影海报收藏册',
                    category: '收藏',
                    originalPrice: 89,
                    vipPrice: 59,
                    discount: 0.66,
                    stock: 200,
                    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=movie%20poster%20collection%20album%20vintage%20cinema&image_size=square_hd'
                }
            ]
        };
    },
    computed: {
        userLevel() {
            return this.vipLevels.find(l => l.level === this.userInfo.vipLevel) || this.vipLevels[0];
        }
    },
    methods: {
        goBack() {
            this.$router.go(-1);
        },
        getDiscountText(discount) {
            return Math.round((1 - discount) * 100) + '% OFF';
        },
        buyVipMovieTicket(ticket) {
            this.showToastMessage(`正在为您预订《${ticket.name}》的会员价电影票...`);
        },
        buyMerchandise(item) {
            if (item.stock > 0) {
                this.showToastMessage(`正在为您添加《${item.name}》到购物车...`);
            } else {
                this.showToastMessage('该商品已售罄');
            }
        },
        showToastMessage(message) {
            this.toastMessage = message;
            this.showToast = true;
            setTimeout(() => {
                this.showToast = false;
            }, 2500);
        }
    }
};
</script>

<style lang="scss" scoped>
.buy-benefit-page {
    background-color: #f5f5f5;
    min-height: 100vh;
    padding-bottom: 20px;
}

.page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 20px;
    background: linear-gradient(135deg, #E54847 0%, #ff6b6b 50%, #ffd700 100%);
    position: sticky;
    top: 0;
    z-index: 100;
}

.back-btn {
    display: flex;
    align-items: center;
    cursor: pointer;

    span {
        color: #fff;
        font-size: 14px;
        font-weight: 500;
    }
}

.page-title {
    color: #fff;
    font-size: 18px;
    font-weight: bold;
}

.user-info {
    .user-level {
        color: #fff;
        font-size: 12px;
        padding: 4px 12px;
        background: rgba(255,255,255,0.2);
        border-radius: 12px;
    }
}

.benefit-banner {
    background: #fff;
    margin: 0 15px 15px;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    margin-top: -15px;
    position: relative;
    z-index: 10;
}

.banner-content {
    display: flex;
    align-items: center;
}

.banner-icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #E54847 0%, #ff6b6b 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
    font-size: 24px;
}

.banner-text h2 {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin-bottom: 4px;
}

.banner-text p {
    font-size: 13px;
    color: #666;
}

.tabs-section {
    background: #fff;
    margin: 0 15px 15px;
    border-radius: 12px;
    padding: 10px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.tabs {
    display: flex;
    gap: 10px;
}

.tab-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 15px;
    background: #f5f5f5;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;

    &.active {
        background: linear-gradient(135deg, #E54847 0%, #ff6b6b 100%);

        .tab-icon,
        .tab-text {
            color: #fff;
        }
    }
}

.tab-icon {
    font-size: 18px;
}

.tab-text {
    font-size: 14px;
    font-weight: 500;
    color: #333;
}

.content-section {
    padding: 0 15px;
}

.section-intro {
    margin-bottom: 15px;
    padding: 15px;
    background: linear-gradient(135deg, #fff5f5 0%, #fff9e6 100%);
    border-radius: 10px;

    h3 {
        font-size: 16px;
        font-weight: bold;
        color: #333;
        margin-bottom: 6px;
    }

    p {
        font-size: 13px;
        color: #666;
        line-height: 1.5;
    }
}

.privilege-tips {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-bottom: 15px;
    padding: 15px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.tip-item {
    display: flex;
    align-items: center;
    gap: 6px;
    flex: 1;
    min-width: 150px;

    .tip-icon {
        font-size: 16px;
    }

    .tip-text {
        font-size: 12px;
        color: #333;
        font-weight: 500;
    }
}

.movie-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.movie-card {
    display: flex;
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    border: 1px solid #f0f0f0;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    }
}

.movie-image-wrapper {
    position: relative;
    width: 120px;
    flex-shrink: 0;
}

.movie-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.movie-discount {
    position: absolute;
    top: 8px;
    left: 8px;
}

.discount-badge {
    background: linear-gradient(135deg, #E54847 0%, #ff6b6b 100%);
    color: #fff;
    font-size: 11px;
    font-weight: bold;
    padding: 3px 8px;
    border-radius: 6px;
}

.movie-content {
    flex: 1;
    padding: 15px;
    display: flex;
    flex-direction: column;
}

.movie-name {
    font-size: 15px;
    font-weight: bold;
    color: #333;
    margin-bottom: 8px;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.movie-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 12px;
}

.meta-item {
    font-size: 11px;
    color: #999;
    display: flex;
    align-items: center;
    gap: 4px;
}

.movie-price-section {
    margin-top: auto;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}

.price-info {
    display: flex;
    align-items: baseline;
    gap: 8px;
}

.original-price {
    font-size: 12px;
    color: #999;
    text-decoration: line-through;
}

.vip-price {
    display: flex;
    align-items: baseline;
    gap: 4px;

    .vip-label {
        font-size: 11px;
        color: #E54847;
        font-weight: 500;
    }

    .price-value {
        font-size: 20px;
        font-weight: bold;
        color: #E54847;
    }
}

.save-amount {
    font-size: 11px;
    color: #4caf50;
    font-weight: 500;
}

.buy-btn {
    padding: 10px 24px;
    background: linear-gradient(135deg, #E54847 0%, #ff6b6b 100%);
    border: none;
    border-radius: 20px;
    color: #fff;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover:not(.disabled) {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(229, 72, 71, 0.3);
    }

    &.disabled {
        background: #e0e0e0;
        color: #999;
        cursor: not-allowed;
    }
}

.merchandise-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 15px;
}

.merchandise-card {
    display: flex;
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    border: 1px solid #f0f0f0;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    }
}

.merchandise-image-wrapper {
    position: relative;
    width: 120px;
    flex-shrink: 0;
}

.merchandise-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.merchandise-discount {
    position: absolute;
    top: 8px;
    left: 8px;
}

.merchandise-stock {
    position: absolute;
    top: 8px;
    right: 8px;

    span {
        font-size: 10px;
        padding: 2px 6px;
        background: rgba(0,0,0,0.6);
        color: #fff;
        border-radius: 4px;
    }

    &.out span {
        background: rgba(244, 67, 54, 0.8);
    }
}

.merchandise-content {
    flex: 1;
    padding: 15px;
    display: flex;
    flex-direction: column;
}

.merchandise-name {
    font-size: 14px;
    font-weight: bold;
    color: #333;
    margin-bottom: 6px;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.merchandise-category {
    margin-bottom: 10px;
}

.category-tag {
    font-size: 11px;
    padding: 2px 8px;
    background: #f5f5f5;
    color: #666;
    border-radius: 4px;
}

.merchandise-price-section {
    margin-top: auto;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}

.empty-state {
    text-align: center;
    padding: 60px 20px;

    .empty-icon {
        font-size: 48px;
        margin-bottom: 15px;
    }

    p {
        font-size: 14px;
        color: #999;
    }
}

.toast {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0,0,0,0.75);
    color: #fff;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    z-index: 2000;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    max-width: 80%;
    text-align: center;

    &.show {
        opacity: 1;
        visibility: visible;
    }
}

@media (max-width: 360px) {
    .merchandise-grid {
        grid-template-columns: 1fr;
    }

    .movie-price-section,
    .merchandise-price-section {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
    }

    .buy-btn {
        width: 100%;
    }

    .privilege-tips {
        flex-direction: column;
    }
}
</style>