<template>
    <div class="vip-tickets-page">
        <div class="page-header">
            <div class="vip-banner">
                <div class="banner-content">
                    <div class="banner-icon">🎫</div>
                    <div class="banner-info">
                        <h2>会员专属演出票</h2>
                        <p>专属折扣 · 提前抢购 · 尊享特权</p>
                    </div>
                </div>
                <div class="user-level-badge">
                    <span class="level-icon">{{userLevel.icon}}</span>
                    <span class="level-text">{{userLevel.shortName}}会员</span>
                </div>
            </div>
        </div>

        <div class="search-section">
            <div class="search-bar">
                <input 
                    type="text" 
                    class="search-input" 
                    placeholder="搜索演出名称、艺人..."
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
                <div class="filter-label">📍 地区筛选：</div>
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
            <div class="filter-row" v-if="selectedCategory !== '' || selectedCity !== 'all' || searchKeyword">
                <div class="filter-info">
                    <span v-if="selectedCity !== 'all'" class="filter-tag">📍 {{ selectedCity }}</span>
                    <span v-if="selectedCategory !== ''" class="filter-tag">🎭 {{ getCategoryName(selectedCategory) }}</span>
                    <span v-if="searchKeyword" class="filter-tag">🔍 {{ searchKeyword }}</span>
                    <button class="clear-btn" @click="clearFilters">清除筛选</button>
                </div>
            </div>
        </div>

        <div class="tabs-section">
            <div class="tabs">
                <div 
                    class="tab-item" 
                    :class="{ active: activeTab === 'vip-price' }"
                    @click="activeTab = 'vip-price'"
                >
                    <span class="tab-icon">💰</span>
                    <span class="tab-text">会员价演出票</span>
                    <span class="tab-count" v-if="filteredVipPriceTickets.length > 0">({{ filteredVipPriceTickets.length }})</span>
                </div>
                <div 
                    class="tab-item" 
                    :class="{ active: activeTab === 'advance-sale' }"
                    @click="activeTab = 'advance-sale'"
                >
                    <span class="tab-icon">⏰</span>
                    <span class="tab-text">提前抢购</span>
                    <span class="tab-count" v-if="filteredAdvanceSaleTickets.length > 0">({{ filteredAdvanceSaleTickets.length }})</span>
                </div>
            </div>
        </div>

        <div class="content-section">
            <div class="vip-price-section" v-if="activeTab === 'vip-price'">
                <div class="section-header">
                    <div class="header-left">
                        <h3>🎫 专属会员价演出票</h3>
                        <p class="section-desc">会员专享折扣，最高可省25%优惠</p>
                    </div>
                    <div class="header-right">
                        <div class="category-filter">
                            <span class="category-label">分类：</span>
                            <select class="category-select" v-model="selectedCategory" @change="applyFilters">
                                <option value="">全部</option>
                                <option v-for="cat in categories" :key="cat.id" :value="cat.code">{{ cat.name }}</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="privilege-tips">
                    <div class="tip-item">
                        <span class="tip-icon">✨</span>
                        <span class="tip-text">当前会员等级：{{ userLevel.name }}</span>
                    </div>
                    <div class="tip-item">
                        <span class="tip-icon">💎</span>
                        <span class="tip-text">专属折扣：{{ getDiscountText(userLevel.discount) }}</span>
                    </div>
                    <div class="tip-item">
                        <span class="tip-icon">⏰</span>
                        <span class="tip-text">提前抢购：{{ userLevel.advanceDays > 0 ? userLevel.advanceDays + '天' : '无' }}</span>
                    </div>
                </div>

                <div class="ticket-list" v-if="filteredVipPriceTickets.length > 0">
                    <div 
                        class="ticket-card" 
                        v-for="ticket in filteredVipPriceTickets" 
                        :key="ticket.id"
                        @click="goToDetail(ticket)"
                    >
                        <div class="ticket-image-wrapper">
                            <img :src="ticket.image" :alt="ticket.name" class="ticket-image">
                            <div class="ticket-tags">
                                <span class="tag vip-tag">会员价</span>
                                <span class="tag level-tag" v-if="ticket.minLevel > userInfo.vipLevel">
                                    🔒 {{ getLevelInfo(ticket.minLevel).shortName }}+
                                </span>
                            </div>
                        </div>
                        <div class="ticket-content">
                            <h4 class="ticket-name">{{ ticket.name }}</h4>
                            <div class="ticket-meta">
                                <span class="meta-item">🎤 {{ ticket.artist }}</span>
                                <span class="meta-item">📍 {{ ticket.city }} · {{ ticket.venue }}</span>
                                <span class="meta-item">📅 {{ ticket.date }}</span>
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
                                        <span v-if="ticket.minLevel <= userInfo.vipLevel">立即购票</span>
                                        <span v-else>升级解锁</span>
                                    </button>
                                    <div class="stock-info">
                                        余票：{{ ticket.totalTickets - ticket.soldTickets }}张
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="empty-state" v-else>
                    <div class="empty-icon">🎭</div>
                    <p>暂无符合条件的演出票</p>
                    <button class="reset-btn" @click="clearFilters">查看全部演出</button>
                </div>
            </div>

            <div class="advance-sale-section" v-if="activeTab === 'advance-sale'">
                <div class="section-header">
                    <div class="header-left">
                        <h3>⏰ 提前抢购专区</h3>
                        <div class="user-privilege" v-if="userLevel.advanceDays > 0">
                            <span class="privilege-icon">✨</span>
                            <span class="privilege-text">您的专属特权：<strong>提前 {{ userLevel.advanceDays }} 天抢购</strong></span>
                        </div>
                        <div class="user-privilege no-privilege" v-else>
                            <span class="privilege-icon">🔒</span>
                            <span class="privilege-text">升级至白银会员解锁提前抢购特权</span>
                        </div>
                    </div>
                    <div class="header-right">
                        <div class="category-filter">
                            <span class="category-label">分类：</span>
                            <select class="category-select" v-model="selectedCategory" @change="applyFilters">
                                <option value="">全部</option>
                                <option v-for="cat in categories" :key="cat.id" :value="cat.code">{{ cat.name }}</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="ticket-list" v-if="filteredAdvanceSaleTickets.length > 0">
                    <div 
                        class="ticket-card advance-card" 
                        v-for="ticket in filteredAdvanceSaleTickets" 
                        :key="ticket.id"
                        @click="goToDetail(ticket)"
                    >
                        <div class="advance-badge" v-if="userInfo.vipLevel >= ticket.minLevel">
                            <span class="badge-icon">⏰</span>
                            <span class="badge-text">提前{{ ticket.advanceDays }}天抢购</span>
                        </div>
                        <div class="advance-badge locked-badge" v-else>
                            <span class="badge-icon">🔒</span>
                            <span class="badge-text">需{{ getLevelInfo(ticket.minLevel).shortName }}会员解锁</span>
                        </div>
                        
                        <div class="ticket-image-wrapper">
                            <img :src="ticket.image" :alt="ticket.name" class="ticket-image">
                            <div class="ticket-tags">
                                <span class="tag advance-tag">提前购</span>
                            </div>
                        </div>
                        <div class="ticket-content">
                            <h4 class="ticket-name">{{ ticket.name }}</h4>
                            <div class="ticket-meta">
                                <span class="meta-item">🎤 {{ ticket.artist }}</span>
                                <span class="meta-item">📍 {{ ticket.city }} · {{ ticket.venue }}</span>
                                <span class="meta-item">📅 演出时间：{{ ticket.date }}</span>
                            </div>
                            
                            <div class="countdown-section" v-if="userInfo.vipLevel >= ticket.minLevel">
                                <div class="countdown-label">📢 开售倒计时</div>
                                <div class="countdown-timer">
                                    <span class="time-value">{{ countdown[ticket.id] ? countdown[ticket.id].days : '00' }}</span>
                                    <span class="time-unit">天</span>
                                    <span class="time-value">{{ countdown[ticket.id] ? countdown[ticket.id].hours : '00' }}</span>
                                    <span class="time-unit">时</span>
                                    <span class="time-value">{{ countdown[ticket.id] ? countdown[ticket.id].minutes : '00' }}</span>
                                    <span class="time-unit">分</span>
                                    <span class="time-value">{{ countdown[ticket.id] ? countdown[ticket.id].seconds : '00' }}</span>
                                    <span class="time-unit">秒</span>
                                </div>
                                <div class="sale-time">开售时间：{{ ticket.saleStartDate }}</div>
                            </div>
                            
                            <div class="locked-info" v-else>
                                <div class="locked-text">
                                    <span class="locked-icon">🔒</span>
                                    <span>升级至{{ getLevelInfo(ticket.minLevel).name }}即可解锁提前抢购特权</span>
                                </div>
                            </div>

                            <div class="ticket-price-section">
                                <div class="price-info">
                                    <span class="original-price">¥{{ ticket.originalPrice }}</span>
                                    <span class="vip-price">
                                        <span class="vip-label">会员价</span>
                                        <span class="price-value">¥{{ getVipPrice(ticket) }}</span>
                                    </span>
                                </div>
                                <div class="ticket-action">
                                    <button 
                                        class="reserve-btn" 
                                        :class="{ 'locked': ticket.minLevel > userInfo.vipLevel }"
                                        :disabled="ticket.minLevel > userInfo.vipLevel"
                                        @click.stop="handleReserve(ticket)"
                                    >
                                        <span v-if="ticket.minLevel <= userInfo.vipLevel">预约提醒</span>
                                        <span v-else>升级会员</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="empty-state" v-else>
                    <div class="empty-icon">⏰</div>
                    <p>暂无提前抢购的演出</p>
                    <p class="empty-desc">敬请期待更多精彩演出</p>
                </div>
            </div>
        </div>

        <div class="toast" :class="{'show': showToast}">
            <span>{{ toastMessage }}</span>
        </div>
    </div>
</template>

<script>
import vipTicketsData from '@/data/vipTickets.js';

export default {
    name: 'VipTickets',
    created() {
        this.$store.commit('changeHt', '会员演出票特价');
        this.initData();
        this.startCountdown();
    },
    destroyed() {
        if (this.countdownTimer) {
            clearInterval(this.countdownTimer);
        }
    },
    data() {
        return {
            activeTab: 'vip-price',
            searchKeyword: '',
            selectedCity: 'all',
            selectedCategory: '',
            cities: [],
            categories: [],
            vipLevels: [],
            vipPriceTickets: [],
            advanceSaleTickets: [],
            countdown: {},
            countdownTimer: null,
            showToast: false,
            toastMessage: '',
            userInfo: {
                vipLevel: 3,
                nickname: '电影爱好者'
            }
        };
    },
    computed: {
        userLevel() {
            return this.vipLevels.find(l => l.level === this.userInfo.vipLevel) || this.vipLevels[0];
        },
        filteredVipPriceTickets() {
            let result = [...this.vipPriceTickets];
            
            if (this.selectedCity !== 'all') {
                result = result.filter(t => t.city === this.selectedCity);
            }
            
            if (this.selectedCategory) {
                result = result.filter(t => t.category === this.selectedCategory);
            }
            
            if (this.searchKeyword) {
                const keyword = this.searchKeyword.toLowerCase();
                result = result.filter(t => 
                    t.name.toLowerCase().includes(keyword) || 
                    t.artist.toLowerCase().includes(keyword) ||
                    t.city.toLowerCase().includes(keyword)
                );
            }
            
            return result;
        },
        filteredAdvanceSaleTickets() {
            let result = [...this.advanceSaleTickets];
            
            if (this.selectedCity !== 'all') {
                result = result.filter(t => t.city === this.selectedCity);
            }
            
            if (this.selectedCategory) {
                result = result.filter(t => t.category === this.selectedCategory);
            }
            
            if (this.searchKeyword) {
                const keyword = this.searchKeyword.toLowerCase();
                result = result.filter(t => 
                    t.name.toLowerCase().includes(keyword) || 
                    t.artist.toLowerCase().includes(keyword) ||
                    t.city.toLowerCase().includes(keyword)
                );
            }
            
            return result;
        }
    },
    methods: {
        initData() {
            this.cities = vipTicketsData.cities;
            this.categories = vipTicketsData.categories;
            this.vipLevels = vipTicketsData.vipLevels;
            this.vipPriceTickets = vipTicketsData.vipPriceTickets;
            this.advanceSaleTickets = vipTicketsData.advanceSaleTickets;
            
            const currentCity = this.$store.state.cityTitle;
            if (currentCity && this.cities.some(c => c.name === currentCity)) {
                this.selectedCity = currentCity;
            }
        },
        startCountdown() {
            this.updateCountdown();
            this.countdownTimer = setInterval(() => {
                this.updateCountdown();
            }, 1000);
        },
        updateCountdown() {
            const now = new Date();
            this.advanceSaleTickets.forEach(ticket => {
                const saleDate = new Date(ticket.saleStartDate);
                const diff = saleDate - now;
                
                if (diff > 0) {
                    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                    
                    this.$set(this.countdown, ticket.id, {
                        days: String(days).padStart(2, '0'),
                        hours: String(hours).padStart(2, '0'),
                        minutes: String(minutes).padStart(2, '0'),
                        seconds: String(seconds).padStart(2, '0')
                    });
                } else {
                    this.$set(this.countdown, ticket.id, {
                        days: '00',
                        hours: '00',
                        minutes: '00',
                        seconds: '00'
                    });
                }
            });
        },
        getLevelInfo(level) {
            return this.vipLevels.find(l => l.level === level) || this.vipLevels[0];
        },
        getDiscountText(discount) {
            return Math.round((1 - discount) * 100) + '% OFF';
        },
        getVipPrice(ticket) {
            return Math.round(ticket.originalPrice * ticket.vipDiscount);
        },
        getCategoryName(code) {
            const cat = this.categories.find(c => c.code === code);
            return cat ? cat.name : code;
        },
        performSearch() {
            this.applyFilters();
        },
        filterByCity(cityName) {
            this.selectedCity = cityName;
            this.applyFilters();
        },
        applyFilters() {
        },
        clearFilters() {
            this.selectedCity = 'all';
            this.selectedCategory = '';
            this.searchKeyword = '';
        },
        goToDetail(ticket) {
            this.showToastMessage('正在跳转到「' + ticket.name + '」详情页...');
        },
        handleBuyTicket(ticket) {
            if (ticket.minLevel <= this.userInfo.vipLevel) {
                this.showToastMessage('正在跳转到购票页面...');
            } else {
                this.showToastMessage('请升级会员解锁此优惠');
            }
        },
        handleReserve(ticket) {
            if (ticket.minLevel <= this.userInfo.vipLevel) {
                this.showToastMessage('已预约开售提醒，开售时将通知您');
            } else {
                this.showToastMessage('请升级会员解锁提前抢购特权');
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

.vip-tickets-page {
    background-color: #f5f5f5;
    min-height: 100vh;
    padding-bottom: 20px;
}

.page-header {
    background: linear-gradient(135deg, #E54847 0%, #ff6b6b 50%, #ffd700 100%);
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
    background: rgba(255,255,255,0.2);
    padding: 8px 16px;
    border-radius: 20px;
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
    background: linear-gradient(135deg, #E54847 0%, #ff6b6b 100%);
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
        transform: scale(1.05);
    }

    span {
        font-size: 16px;
    }
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
    margin-bottom: 10px;

    &:last-child {
        margin-bottom: 0;
    }
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

    &:hover {
        border-color: #E54847;
        color: #E54847;
    }

    &.active {
        background: linear-gradient(135deg, #E54847 0%, #ff6b6b 100%);
        border-color: #E54847;
        color: #fff;
    }
}

.filter-info {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    width: 100%;
    padding: 10px 15px;
    background: #fff8f5;
    border-radius: 8px;
}

.filter-tag {
    padding: 4px 10px;
    background: #E54847;
    color: #fff;
    font-size: 12px;
    border-radius: 4px;
}

.clear-btn {
    padding: 4px 12px;
    border: 1px solid #E54847;
    border-radius: 4px;
    background: #fff;
    color: #E54847;
    font-size: 12px;
    cursor: pointer;
    margin-left: auto;
}

.tabs-section {
    background: #fff;
    margin-bottom: 10px;
}

.tabs {
    display: flex;
    border-bottom: 1px solid #f0f0f0;
}

.tab-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15px 0;
    cursor: pointer;
    position: relative;
    transition: all 0.3s;

    &.active {
        &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 3px;
            background: linear-gradient(90deg, #E54847 0%, #ff6b6b 100%);
            border-radius: 2px;
        }
    }
}

.tab-icon {
    font-size: 18px;
    margin-right: 6px;
}

.tab-text {
    font-size: 15px;
    color: #666;
    font-weight: 500;

    .active & {
        color: #E54847;
    }
}

.tab-count {
    font-size: 12px;
    color: #999;
    margin-left: 4px;

    .active & {
        color: #E54847;
    }
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

.category-filter {
    display: flex;
    align-items: center;
    gap: 8px;
}

.category-label {
    font-size: 13px;
    color: #666;
}

.category-select {
    padding: 6px 12px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    font-size: 13px;
    color: #333;
    background: #fff;
    cursor: pointer;
}

.user-privilege {
    display: flex;
    align-items: center;
    margin-top: 8px;
    padding: 8px 12px;
    background: linear-gradient(135deg, #fff8f5 0%, #fff9e6 100%);
    border-radius: 6px;
    border: 1px solid #ffcc80;

    &.no-privilege {
        background: #f5f5f5;
        border-color: #e0e0e0;
    }
}

.privilege-icon {
    font-size: 16px;
    margin-right: 6px;
}

.privilege-text {
    font-size: 13px;
    color: #666;

    strong {
        color: #E54847;
        font-weight: bold;
    }

    .no-privilege & {
        color: #999;
    }
}

.privilege-tips {
    display: flex;
    justify-content: space-around;
    padding: 15px;
    background: linear-gradient(135deg, #fff8f5 0%, #fff9e6 100%);
    border-radius: 8px;
    margin-bottom: 15px;
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
    position: relative;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0,0,0,0.1);
    }
}

.advance-card {
    padding-top: 40px;
}

.advance-badge,
.locked-badge {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 0;
    font-size: 12px;
    z-index: 10;
}

.advance-badge {
    background: linear-gradient(90deg, #4caf50 0%, #81c784 100%);
    color: #fff;
}

.locked-badge {
    background: linear-gradient(90deg, #999 0%, #bbb 100%);
    color: #fff;
}

.badge-icon {
    margin-right: 4px;
}

.ticket-image-wrapper {
    position: relative;
    height: 160px;
    overflow: hidden;
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
    gap: 6px;
}

.tag {
    padding: 3px 8px;
    font-size: 10px;
    border-radius: 4px;
    font-weight: 500;
}

.vip-tag {
    background: linear-gradient(135deg, #E54847 0%, #ff6b6b 100%);
    color: #fff;
}

.advance-tag {
    background: linear-gradient(135deg, #4caf50 0%, #81c784 100%);
    color: #fff;
}

.level-tag {
    background: rgba(0,0,0,0.7);
    color: #fff;
}

.ticket-content {
    padding: 15px;
}

.ticket-name {
    font-size: 15px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.ticket-meta {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 12px;
}

.meta-item {
    font-size: 12px;
    color: #666;
}

.countdown-section {
    background: linear-gradient(135deg, #fff8f5 0%, #fff9e6 100%);
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 12px;
}

.countdown-label {
    font-size: 12px;
    color: #E54847;
    font-weight: 500;
    margin-bottom: 8px;
}

.countdown-timer {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 6px;
}

.time-value {
    background: linear-gradient(135deg, #E54847 0%, #ff6b6b 100%);
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    padding: 4px 8px;
    border-radius: 4px;
    min-width: 28px;
    text-align: center;
}

.time-unit {
    font-size: 12px;
    color: #666;
    margin-right: 4px;
}

.sale-time {
    font-size: 11px;
    color: #999;
}

.locked-info {
    background: #f5f5f5;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 12px;
}

.locked-text {
    display: flex;
    align-items: center;
    font-size: 13px;
    color: #666;
}

.locked-icon {
    margin-right: 6px;
}

.ticket-price-section {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
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
    color: #E54847;
    margin-right: 4px;
}

.price-value {
    font-size: 22px;
    font-weight: bold;
    color: #E54847;
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

.buy-btn,
.reserve-btn {
    padding: 10px 24px;
    background: linear-gradient(135deg, #E54847 0%, #ff6b6b 100%);
    border: none;
    border-radius: 20px;
    color: #fff;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 2px 8px rgba(229, 72, 71, 0.3);

    &:hover:not(.locked) {
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(229, 72, 71, 0.4);
    }

    &.locked {
        background: #e0e0e0;
        color: #999;
        cursor: not-allowed;
        box-shadow: none;
        transform: none;
    }
}

.reserve-btn {
    background: linear-gradient(135deg, #4caf50 0%, #81c784 100%);
    box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);

    &:hover:not(.locked) {
        box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
    }

    &.locked {
        background: #e0e0e0;
        color: #999;
        cursor: not-allowed;
        box-shadow: none;
        transform: none;
    }
}

.stock-info {
    font-size: 11px;
    color: #999;
    margin-top: 4px;
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
    background: linear-gradient(135deg, #E54847 0%, #ff6b6b 100%);
    border: none;
    border-radius: 20px;
    color: #fff;
    font-size: 14px;
    cursor: pointer;
    margin-top: 10px;
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
    .ticket-price-section {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
    }

    .ticket-action {
        width: 100%;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .level-table {
        grid-template-columns: 1fr;
    }

    .privilege-tips {
        flex-wrap: wrap;
        gap: 15px;
    }

    .tip-item {
        flex: 1;
        min-width: 80px;
    }
}
</style>
