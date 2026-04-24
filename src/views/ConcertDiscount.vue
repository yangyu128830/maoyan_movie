<template>
    <div class="concert-discount-page">
        <div class="page-header">
            <div class="vip-banner">
                <div class="banner-content">
                    <div class="banner-icon">🎵</div>
                    <div class="banner-info">
                        <h2>演出票9折</h2>
                        <p>会员专享 · 9折优惠 · 省钱省心</p>
                    </div>
                </div>
                <div class="user-level-badge">
                    <span class="level-icon">{{userLevel.icon}}</span>
                    <span class="level-text">{{userLevel.shortName}}会员</span>
                </div>
            </div>
        </div>

        <div class="coupon-section">
            <div class="coupon-banner">
                <div class="coupon-banner-content">
                    <div class="coupon-banner-left">
                        <div class="coupon-value">
                            <span class="currency">¥</span>
                            <span class="value">9折</span>
                        </div>
                        <div class="coupon-condition">演出票通用</div>
                    </div>
                    <div class="coupon-banner-right">
                        <div class="coupon-info">
                            <h3>演出票9折优惠券</h3>
                            <p>会员专享，购买演出票立享9折优惠</p>
                            <div class="coupon-validity">
                                <span>有效期至：{{couponValidity}}</span>
                            </div>
                        </div>
                        <button 
                            class="claim-coupon-btn" 
                            :class="{'claimed': couponClaimed}"
                            :disabled="couponClaimed"
                            @click="claimCoupon"
                        >
                            <span v-if="!couponClaimed">立即领取</span>
                            <span v-else>已领取</span>
                        </button>
                    </div>
                </div>
            </div>
            <div class="coupon-tips">
                <div class="tip-item">
                    <span class="tip-icon">✨</span>
                    <span class="tip-text">当前会员等级：{{ userLevel.name }}</span>
                </div>
                <div class="tip-item">
                    <span class="tip-icon">💰</span>
                    <span class="tip-text">专属折扣：{{ getDiscountText(userLevel.discount) }}</span>
                </div>
                <div class="tip-item">
                    <span class="tip-icon">🎫</span>
                    <span class="tip-text">可购票数：每月{{ userLevel.ticketQuota || 10 }}张</span>
                </div>
            </div>
        </div>

        <div class="search-section">
            <div class="search-bar">
                <input 
                    type="text" 
                    class="search-input" 
                    placeholder="搜索演出名称、艺人、城市..."
                    v-model="searchKeyword"
                    @keyup.enter="performSearch"
                >
                <button class="search-btn" @click="performSearch">
                    <span>🔍</span>
                </button>
            </div>
        </div>

        <div class="filter-section">
            <div class="filter-row">
                <div class="filter-label">📍 地区：</div>
                <div class="filter-buttons">
                    <button 
                        class="filter-btn" 
                        :class="{ active: selectedCity === 'all' }"
                        @click="filterByCity('all')"
                    >全部</button>
                    <button 
                        class="filter-btn" 
                        v-for="city in cities" 
                        :key="city.id"
                        :class="{ active: selectedCity === city.name }"
                        @click="filterByCity(city.name)"
                    >{{ city.name }}</button>
                </div>
            </div>
            <div class="filter-row">
                <div class="filter-label">🎭 类型：</div>
                <div class="filter-buttons">
                    <button 
                        class="filter-btn" 
                        :class="{ active: selectedCategory === 'all' }"
                        @click="filterByCategory('all')"
                    >全部</button>
                    <button 
                        class="filter-btn" 
                        v-for="cat in categories" 
                        :key="cat.id"
                        :class="{ active: selectedCategory === cat.code }"
                        @click="filterByCategory(cat.code)"
                    >{{ cat.name }}</button>
                </div>
            </div>
            <div class="filter-row">
                <div class="filter-label">🎫 折扣筛选：</div>
                <div class="filter-buttons">
                    <button 
                        class="filter-btn" 
                        :class="{ active: discountFilter === 'all' }"
                        @click="filterByDiscount('all')"
                    >全部演出</button>
                    <button 
                        class="filter-btn" 
                        :class="{ active: discountFilter === 'nine' }"
                        @click="filterByDiscount('nine')"
                    >9折优惠</button>
                    <button 
                        class="filter-btn" 
                        :class="{ active: discountFilter === 'more' }"
                        @click="filterByDiscount('more')"
                    >9折以下</button>
                </div>
            </div>
            <div class="filter-row">
                <div class="filter-label">💰 价格排序：</div>
                <div class="filter-buttons">
                    <button 
                        class="filter-btn" 
                        :class="{ active: priceSort === 'default' }"
                        @click="sortByPrice('default')"
                    >默认排序</button>
                    <button 
                        class="filter-btn" 
                        :class="{ active: priceSort === 'asc' }"
                        @click="sortByPrice('asc')"
                    >价格从低到高</button>
                    <button 
                        class="filter-btn" 
                        :class="{ active: priceSort === 'desc' }"
                        @click="sortByPrice('desc')"
                    >价格从高到低</button>
                </div>
            </div>
            <div class="filter-row" v-if="selectedCity !== 'all' || selectedCategory !== 'all' || discountFilter !== 'all' || searchKeyword">
                <div class="filter-info">
                    <span v-if="selectedCity !== 'all'" class="filter-tag">📍 {{ selectedCity }}</span>
                    <span v-if="selectedCategory !== 'all'" class="filter-tag">🎭 {{ getCategoryName(selectedCategory) }}</span>
                    <span v-if="discountFilter === 'nine'" class="filter-tag">🎫 9折优惠</span>
                    <span v-if="discountFilter === 'more'" class="filter-tag">🎫 9折以下</span>
                    <span v-if="searchKeyword" class="filter-tag">🔍 {{ searchKeyword }}</span>
                    <button class="clear-btn" @click="clearFilters">清除筛选</button>
                </div>
            </div>
        </div>

        <div class="content-section">
            <div class="section-header">
                <div class="header-left">
                    <h3>🎫 可使用9折优惠的演出</h3>
                    <p class="section-desc">共 {{ filteredTickets.length }} 场演出，会员专享9折优惠</p>
                </div>
            </div>

            <div class="ticket-list" v-if="filteredTickets.length > 0">
                <div 
                    class="ticket-card" 
                    v-for="ticket in filteredTickets" 
                    :key="ticket.id"
                    @click="goToDetail(ticket)"
                >
                    <div class="ticket-image-wrapper">
                        <img :src="ticket.image" :alt="ticket.name" class="ticket-image">
                        <div class="ticket-tags">
                            <span class="tag discount-tag" :class="'discount-' + Math.round(ticket.discount * 100)">
                                {{ getDiscountTag(ticket.discount) }}
                            </span>
                            <span class="tag level-tag" v-if="ticket.minLevel > userInfo.vipLevel">
                                🔒 {{ getLevelInfo(ticket.minLevel).shortName }}+
                            </span>
                        </div>
                        <div class="ticket-discount-badge">
                            <div class="discount-badge-content">
                                <span class="badge-label">会员价</span>
                                <span class="badge-value">{{ getDiscountPercent(ticket.discount) }}折</span>
                            </div>
                        </div>
                    </div>
                    <div class="ticket-content">
                        <h4 class="ticket-title">{{ ticket.name }}</h4>
                        <div class="ticket-meta">
                            <span class="meta-item" v-if="ticket.artist">🎤 {{ ticket.artist }}</span>
                            <span class="meta-item">📍 {{ ticket.city }} · {{ ticket.venue }}</span>
                            <span class="meta-item">📅 {{ ticket.date }}</span>
                        </div>
                        <div class="ticket-category">
                            <span class="category-tag">{{ getCategoryName(ticket.category) }}</span>
                            <span class="stock-info" v-if="ticket.totalTickets">
                                余票：{{ ticket.totalTickets - ticket.soldTickets }}张
                            </span>
                        </div>
                        <div class="ticket-price-section">
                            <div class="price-info">
                                <span class="original-price">¥{{ ticket.originalPrice }}</span>
                                <span class="vip-price">
                                    <span class="vip-label">会员价</span>
                                    <span class="price-value">¥{{ getVipPrice(ticket) }}</span>
                                </span>
                                <span class="save-amount">
                                    省¥{{ ticket.originalPrice - getVipPrice(ticket) }}
                                </span>
                            </div>
                            <div class="ticket-action">
                                <button 
                                    class="buy-btn" 
                                    :class="{ 'locked': ticket.minLevel > userInfo.vipLevel }"
                                    :disabled="ticket.minLevel > userInfo.vipLevel"
                                    @click.stop="handleBuyTicket(ticket)"
                                >
                                    <span v-if="ticket.minLevel <= userInfo.vipLevel">
                                        {{ ticket.soldTickets >= ticket.totalTickets ? '已售罄' : '立即购票' }}
                                    </span>
                                    <span v-else>升级解锁</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="empty-state" v-else>
                <div class="empty-icon">🎭</div>
                <p>暂无符合条件的演出</p>
                <p class="empty-desc">请尝试调整筛选条件</p>
                <button class="reset-btn" @click="clearFilters">查看全部演出</button>
            </div>
        </div>

        <div class="usage-guide-section">
            <div class="section-header">
                <h3>📖 9折优惠券使用说明</h3>
            </div>
            <div class="guide-content">
                <div class="guide-item">
                    <div class="guide-icon">1️⃣</div>
                    <div class="guide-info">
                        <h4>领取优惠券</h4>
                        <p>点击上方"立即领取"按钮，领取演出票9折优惠券</p>
                    </div>
                </div>
                <div class="guide-item">
                    <div class="guide-icon">2️⃣</div>
                    <div class="guide-info">
                        <h4>选择演出</h4>
                        <p>在下方列表中选择支持9折优惠的演出，点击"立即购票"</p>
                    </div>
                </div>
                <div class="guide-item">
                    <div class="guide-icon">3️⃣</div>
                    <div class="guide-info">
                        <h4>自动抵扣</h4>
                        <p>结算时系统将自动使用9折优惠券，享受会员专享优惠</p>
                    </div>
                </div>
                <div class="guide-item">
                    <div class="guide-icon">⚠️</div>
                    <div class="guide-info">
                        <h4>注意事项</h4>
                        <p>每月优惠券数量有限，请及时使用；不同会员等级优惠不同</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="toast" :class="{'show': showToast}">
            <span>{{ toastMessage }}</span>
        </div>
    </div>
</template>

<script>
import concertDiscountData from '@/data/concertDiscount.js';

export default {
    name: 'ConcertDiscount',
    created() {
        this.$store.commit('changeHt', '演出票9折');
        this.initData();
    },
    data() {
        return {
            searchKeyword: '',
            selectedCity: 'all',
            selectedCategory: 'all',
            discountFilter: 'all',
            priceSort: 'default',
            couponClaimed: false,
            couponValidity: '2026-12-31',
            cities: [],
            categories: [],
            vipLevels: [],
            discountTickets: [],
            userInfo: {
                vipLevel: 3,
                nickname: '电影爱好者'
            },
            showToast: false,
            toastMessage: ''
        };
    },
    computed: {
        userLevel() {
            return this.vipLevels.find(l => l.level === this.userInfo.vipLevel) || this.vipLevels[0];
        },
        filteredTickets() {
            let result = [...this.discountTickets];
            
            if (this.selectedCity !== 'all') {
                result = result.filter(t => t.city === this.selectedCity);
            }
            
            if (this.selectedCategory !== 'all') {
                result = result.filter(t => t.category === this.selectedCategory);
            }
            
            if (this.discountFilter === 'nine') {
                result = result.filter(t => t.discount >= 0.9);
            } else if (this.discountFilter === 'more') {
                result = result.filter(t => t.discount < 0.9);
            }
            
            if (this.searchKeyword) {
                const keyword = this.searchKeyword.toLowerCase();
                result = result.filter(t => 
                    t.name.toLowerCase().includes(keyword) || 
                    (t.artist && t.artist.toLowerCase().includes(keyword)) ||
                    t.city.toLowerCase().includes(keyword)
                );
            }
            
            if (this.priceSort === 'asc') {
                result.sort((a, b) => (a.originalPrice * a.discount) - (b.originalPrice * b.discount));
            } else if (this.priceSort === 'desc') {
                result.sort((a, b) => (b.originalPrice * b.discount) - (a.originalPrice * a.discount));
            }
            
            return result;
        }
    },
    methods: {
        initData() {
            this.cities = concertDiscountData.cities;
            this.categories = concertDiscountData.categories;
            this.vipLevels = concertDiscountData.vipLevels;
            this.discountTickets = concertDiscountData.discountTickets;
        },
        getLevelInfo(level) {
            return this.vipLevels.find(l => l.level === level) || this.vipLevels[0];
        },
        getCategoryName(code) {
            const cat = this.categories.find(c => c.code === code);
            return cat ? cat.name : code;
        },
        getDiscountText(discount) {
            return Math.round((1 - discount) * 100) + '% OFF';
        },
        getDiscountTag(discount) {
            const percent = Math.round((1 - discount) * 100);
            return percent + '% OFF';
        },
        getDiscountPercent(discount) {
            return Math.round(discount * 10);
        },
        getVipPrice(ticket) {
            return Math.round(ticket.originalPrice * ticket.discount);
        },
        claimCoupon() {
            if (this.couponClaimed) return;
            
            this.couponClaimed = true;
            this.showToastMessage('恭喜！演出票9折优惠券已领取成功！');
        },
        performSearch() {
        },
        filterByCity(cityName) {
            this.selectedCity = cityName;
        },
        filterByCategory(categoryCode) {
            this.selectedCategory = categoryCode;
        },
        filterByDiscount(filterType) {
            this.discountFilter = filterType;
        },
        sortByPrice(sortType) {
            this.priceSort = sortType;
        },
        clearFilters() {
            this.selectedCity = 'all';
            this.selectedCategory = 'all';
            this.discountFilter = 'all';
            this.priceSort = 'default';
            this.searchKeyword = '';
        },
        goToDetail(ticket) {
            this.showToastMessage(`正在跳转到「${ticket.name}」详情页...`);
        },
        handleBuyTicket(ticket) {
            if (ticket.minLevel <= this.userInfo.vipLevel) {
                if (ticket.soldTickets >= ticket.totalTickets) {
                    this.showToastMessage('该场次已售罄');
                } else {
                    this.showToastMessage('正在跳转到购票页面，将自动使用9折优惠券...');
                }
            } else {
                this.showToastMessage('请升级会员解锁此优惠');
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
@import '@/assets/sass/public.scss';

.concert-discount-page {
    background-color: #f5f5f5;
    min-height: 100vh;
    padding-bottom: 20px;
}

.page-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    padding: 20px 15px;
}

.vip-banner {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.banner-content {
    display: flex;
    align-items: center;
}

.banner-icon {
    font-size: 40px;
    margin-right: 12px;
}

.banner-info h2 {
    color: #fff;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 4px;
    text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.banner-info p {
    color: rgba(255,255,255,0.9);
    font-size: 12px;
}

.user-level-badge {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: rgba(255,255,255,0.15);
    padding: 8px 16px;
    border-radius: 20px;
    border: 1px solid rgba(255,255,255,0.2);
}

.level-icon {
    font-size: 24px;
    margin-bottom: 2px;
}

.level-text {
    color: #fff;
    font-size: 11px;
    font-weight: 500;
}

.coupon-section {
    background: linear-gradient(180deg, #667eea 0%, #f5f5f5 30%);
    padding: 0 15px 15px;
}

.coupon-banner {
    background: #fff;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.15);
}

.coupon-banner-content {
    display: flex;
    align-items: stretch;
}

.coupon-banner-left {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 15px 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    position: relative;
    margin-right: 20px;
}

.coupon-banner-left::after {
    content: '';
    position: absolute;
    right: -8px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.coupon-value {
    display: flex;
    align-items: baseline;
    color: #fff;
}

.currency {
    font-size: 14px;
    font-weight: 500;
}

.value {
    font-size: 36px;
    font-weight: bold;
    line-height: 1;
}

.coupon-condition {
    font-size: 12px;
    color: rgba(255,255,255,0.9);
    margin-top: 4px;
}

.coupon-banner-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.coupon-info h3 {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin-bottom: 6px;
}

.coupon-info p {
    font-size: 13px;
    color: #666;
    margin-bottom: 8px;
}

.coupon-validity {
    font-size: 12px;
    color: #999;
}

.claim-coupon-btn {
    padding: 12px 30px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 25px;
    color: #fff;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    align-self: flex-start;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.claim-coupon-btn:hover:not(.claimed) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.claim-coupon-btn.claimed {
    background: #e0e0e0;
    color: #999;
    cursor: not-allowed;
    box-shadow: none;
}

.coupon-tips {
    display: flex;
    justify-content: space-around;
    padding: 15px;
    background: #fff;
    border-radius: 12px;
    margin-top: 15px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.tip-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.tip-icon {
    font-size: 20px;
    margin-bottom: 4px;
}

.tip-text {
    font-size: 12px;
    color: #666;
    text-align: center;
}

.search-section {
    padding: 15px;
    background: #fff;
    margin-bottom: 10px;
}

.search-bar {
    display: flex;
    align-items: center;
    background: #f5f5f5;
    border-radius: 25px;
    padding: 0 15px;
    border: 1px solid #e0e0e0;
}

.search-input {
    flex: 1;
    padding: 12px 0;
    border: none;
    background: transparent;
    font-size: 14px;
    outline: none;
}

.search-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
}

.search-btn:hover {
    transform: scale(1.05);
}

.search-btn span {
    font-size: 16px;
    color: #fff;
}

.filter-section {
    background: #fff;
    padding: 15px;
    margin-bottom: 10px;
}

.filter-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 12px;
}

.filter-row:last-child {
    margin-bottom: 0;
}

.filter-label {
    font-size: 14px;
    color: #333;
    font-weight: 500;
    flex-shrink: 0;
}

.filter-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    flex: 1;
}

.filter-btn {
    padding: 6px 14px;
    border: 1px solid #e0e0e0;
    border-radius: 16px;
    background: #fff;
    font-size: 13px;
    color: #666;
    cursor: pointer;
    transition: all 0.2s;
}

.filter-btn:hover {
    border-color: #667eea;
    color: #667eea;
}

.filter-btn.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-color: #667eea;
    color: #fff;
}

.filter-info {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    width: 100%;
    padding: 10px 15px;
    background: #f8f9fa;
    border-radius: 8px;
}

.filter-tag {
    padding: 4px 10px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    font-size: 12px;
    border-radius: 4px;
}

.clear-btn {
    padding: 4px 12px;
    border: 1px solid #667eea;
    border-radius: 4px;
    background: #fff;
    color: #667eea;
    font-size: 12px;
    cursor: pointer;
    margin-left: auto;
}

.content-section {
    padding: 0 15px;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 15px;
    padding: 15px;
    background: #fff;
    border-radius: 8px;
}

.header-left h3 {
    font-size: 17px;
    font-weight: bold;
    color: #333;
    margin-bottom: 4px;
}

.section-desc {
    font-size: 12px;
    color: #999;
}

.ticket-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.ticket-card {
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
}

.ticket-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.1);
}

.ticket-image-wrapper {
    position: relative;
    width: 120px;
    flex-shrink: 0;
}

.ticket-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.ticket-tags {
    position: absolute;
    top: 10px;
    left: 10px;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.tag {
    padding: 3px 8px;
    font-size: 10px;
    border-radius: 4px;
    font-weight: 500;
}

.discount-tag {
    background: linear-gradient(135deg, #E54847 0%, #ff6b6b 100%);
    color: #fff;
}

.level-tag {
    background: rgba(0,0,0,0.7);
    color: #fff;
}

.ticket-discount-badge {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 8px;
}

.discount-badge-content {
    display: flex;
    align-items: baseline;
    justify-content: center;
}

.badge-label {
    font-size: 10px;
    color: rgba(255,255,255,0.9);
    margin-right: 4px;
}

.badge-value {
    font-size: 16px;
    font-weight: bold;
    color: #fff;
}

.ticket-content {
    flex: 1;
    padding: 12px;
    display: flex;
    flex-direction: column;
}

.ticket-title {
    font-size: 15px;
    font-weight: bold;
    color: #333;
    margin-bottom: 8px;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.ticket-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 8px;
}

.meta-item {
    font-size: 12px;
    color: #666;
}

.ticket-category {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: auto;
}

.category-tag {
    padding: 3px 10px;
    background: #f0f0f0;
    color: #666;
    font-size: 11px;
    border-radius: 4px;
}

.stock-info {
    font-size: 11px;
    color: #999;
}

.ticket-price-section {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: 10px;
}

.price-info {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 8px;
}

.original-price {
    font-size: 13px;
    color: #999;
    text-decoration: line-through;
}

.vip-price {
    display: flex;
    align-items: baseline;
}

.vip-label {
    font-size: 11px;
    color: #667eea;
    margin-right: 4px;
}

.price-value {
    font-size: 20px;
    font-weight: bold;
    color: #667eea;
}

.save-amount {
    font-size: 12px;
    color: #ff5722;
    background: #fff3e0;
    padding: 2px 6px;
    border-radius: 4px;
}

.ticket-action {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

.buy-btn {
    padding: 8px 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 20px;
    color: #fff;
    font-size: 13px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.buy-btn:hover:not(.locked) {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.buy-btn.locked {
    background: #e0e0e0;
    color: #999;
    cursor: not-allowed;
    box-shadow: none;
}

.empty-state {
    text-align: center;
    padding: 50px 20px;
    background: #fff;
    border-radius: 12px;
}

.empty-icon {
    font-size: 60px;
    margin-bottom: 15px;
}

.empty-state p {
    font-size: 14px;
    color: #999;
    margin-bottom: 8px;
}

.empty-desc {
    font-size: 12px !important;
    color: #bbb !important;
}

.reset-btn {
    padding: 10px 30px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 20px;
    color: #fff;
    font-size: 14px;
    cursor: pointer;
    margin-top: 10px;
}

.usage-guide-section {
    margin-top: 20px;
    padding: 0 15px;
}

.usage-guide-section .section-header {
    margin-bottom: 15px;
}

.guide-content {
    background: #fff;
    border-radius: 12px;
    padding: 15px;
}

.guide-item {
    display: flex;
    padding: 15px 0;
    border-bottom: 1px solid #f0f0f0;
}

.guide-item:last-child {
    border-bottom: none;
}

.guide-icon {
    font-size: 24px;
    margin-right: 15px;
    flex-shrink: 0;
}

.guide-info h4 {
    font-size: 14px;
    font-weight: bold;
    color: #333;
    margin-bottom: 4px;
}

.guide-info p {
    font-size: 13px;
    color: #666;
    line-height: 1.5;
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
}

.toast.show {
    opacity: 1;
    visibility: visible;
}

@media (max-width: 360px) {
    .coupon-banner-content {
        flex-direction: column;
        align-items: stretch;
    }

    .coupon-banner-left {
        margin-right: 0;
        margin-bottom: 15px;
    }

    .coupon-banner-left::after {
        display: none;
    }

    .ticket-price-section {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
    }

    .ticket-action {
        width: 100%;
    }

    .coupon-tips {
        flex-wrap: wrap;
        gap: 15px;
    }

    .tip-item {
        flex: 1;
        min-width: 80px;
    }
}
</style>
