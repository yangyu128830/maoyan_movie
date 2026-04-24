<template>
    <div class="premiere-page">
        <div class="benefit-banner">
            <div class="banner-content">
                <div class="banner-icon">🎬</div>
                <div class="banner-text">
                    <h2>首映抢先看</h2>
                    <p>提前一周 · 独家资讯 · 第一时间</p>
                </div>
            </div>
        </div>

        <div class="tabs-section">
            <div class="tabs">
                <div 
                    class="tab-item" 
                    :class="{ active: activeTab === 'coming-week' }"
                    @click="activeTab = 'coming-week'"
                >
                    <span class="tab-icon">📅</span>
                    <span class="tab-text">一周内上映</span>
                </div>
                <div 
                    class="tab-item" 
                    :class="{ active: activeTab === 'advance-preview' }"
                    @click="activeTab = 'advance-preview'"
                >
                    <span class="tab-icon">✨</span>
                    <span class="tab-text">提前预告</span>
                </div>
            </div>
        </div>

        <div class="content-section">
            <div class="coming-week-section" v-if="activeTab === 'coming-week'">
                <div class="section-intro">
                    <h3>📅 一周内上映</h3>
                    <p>未来7天即将上映的电影和演出，会员专享提前购票</p>
                </div>

                <div class="privilege-tips">
                    <div class="tip-item">
                        <span class="tip-icon">✨</span>
                        <span class="tip-text">当前会员等级：{{ userLevel.name }}</span>
                    </div>
                    <div class="tip-item">
                        <span class="tip-icon">⏰</span>
                        <span class="tip-text">提前购票：{{ userLevel.advanceDays > 0 ? userLevel.advanceDays + '天' : '无' }}</span>
                    </div>
                    <div class="tip-item">
                        <span class="tip-icon">🎁</span>
                        <span class="tip-text">会员专享：首映优先购票权</span>
                    </div>
                </div>

                <div class="search-section">
                    <div class="search-bar">
                        <input 
                            type="text" 
                            class="search-input" 
                            placeholder="搜索电影、演唱会、演出名称..."
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
                                :class="{ active: selectedType === 'all' }"
                                @click="filterByType('all')"
                            >全部</button>
                            <button 
                                class="filter-btn" 
                                v-for="type in types" 
                                :key="type.id"
                                :class="{ active: selectedType === type.code }"
                                @click="filterByType(type.code)"
                            >{{ type.name }}</button>
                        </div>
                    </div>
                </div>

                <div class="item-list" v-if="filteredComingWeekItems.length > 0">
                    <div 
                        class="movie-card" 
                        v-for="item in filteredComingWeekItems" 
                        :key="item.id"
                        @click="goToDetail(item)"
                    >
                        <div class="movie-image-wrapper">
                            <img :src="item.image" :alt="item.name" class="movie-image">
                            <div class="movie-discount">
                                <span class="discount-badge">{{ getTypeName(item.type) }}</span>
                            </div>
                            <div class="ticket-level" v-if="item.minLevel > userInfo.vipLevel">
                                <span class="level-lock">🔒 {{ getLevelInfo(item.minLevel).shortName }}+</span>
                            </div>
                        </div>
                        <div class="movie-content">
                            <h4 class="movie-name">{{ item.name }}</h4>
                            <div class="movie-meta">
                                <span class="meta-item">📅 {{ item.releaseDate }}</span>
                                <span class="meta-item">📍 {{ item.city }} · {{ item.venue }}</span>
                                <span class="meta-item" v-if="item.artist">🎤 {{ item.artist }}</span>
                            </div>
                            <div class="movie-price-section">
                                <div class="price-info">
                                    <span class="original-price" v-if="item.originalPrice">¥{{ item.originalPrice }}</span>
                                    <span class="vip-price" v-if="item.vipPrice">
                                        <span class="vip-label">会员价</span>
                                        <span class="price-value">¥{{ item.vipPrice }}</span>
                                    </span>
                                    <span class="price-text" v-else>{{ item.priceText || '敬请期待' }}</span>
                                </div>
                                <button 
                                    class="buy-btn" 
                                    :class="{ 'locked': item.minLevel > userInfo.vipLevel }"
                                    :disabled="item.minLevel > userInfo.vipLevel"
                                    @click.stop="handleAction(item)"
                                >
                                    <span v-if="item.minLevel <= userInfo.vipLevel">
                                        {{ item.canBuy ? '立即购票' : '预约提醒' }}
                                    </span>
                                    <span v-else>升级解锁</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="empty-state" v-else>
                    <div class="empty-icon">🎬</div>
                    <p>暂无一周内上映的内容</p>
                    <button class="reset-btn" @click="clearFilters">查看全部</button>
                </div>
            </div>

            <div class="advance-preview-section" v-else>
                <div class="section-intro">
                    <h3>✨ 提前预告</h3>
                    <p>未来即将上映的精彩内容，第一时间获取资讯</p>
                </div>

                <div class="merchandise-grid" v-if="filteredAdvancePreviewItems.length > 0">
                    <div 
                        class="merchandise-card" 
                        v-for="item in filteredAdvancePreviewItems" 
                        :key="item.id"
                        @click="goToDetail(item)"
                    >
                        <div class="merchandise-image-wrapper">
                            <img :src="item.image" :alt="item.name" class="merchandise-image">
                            <div class="merchandise-discount">
                                <span class="discount-badge">即将上映</span>
                            </div>
                        </div>
                        <div class="merchandise-content">
                            <h4 class="merchandise-name">{{ item.name }}</h4>
                            <div class="merchandise-category">
                                <span class="category-tag">{{ getTypeName(item.type) }}</span>
                            </div>
                            <div class="merchandise-meta">
                                <span class="meta-item">📅 {{ item.releaseDate }}</span>
                                <span class="meta-item">📍 {{ item.city }}</span>
                            </div>
                            <div class="merchandise-price-section">
                                <div class="action-buttons">
                                    <button class="subscribe-btn" @click.stop="subscribeItem(item)">
                                        <span>🔔</span>
                                        <span>订阅提醒</span>
                                    </button>
                                    <button class="share-btn" @click.stop="shareItem(item)">
                                        <span>📤</span>
                                        <span>分享</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="empty-state" v-else>
                    <div class="empty-icon">✨</div>
                    <p>暂无提前预告内容</p>
                    <p class="empty-desc">敬请期待更多精彩内容</p>
                </div>
            </div>
        </div>

        <div class="bottom-action-section">
            <button class="primary-btn" @click="goToHotMovies">
                <span>🔥</span>
                <span>查看热门电影</span>
            </button>
            <button class="secondary-btn" @click="goBack">
                <span>⬅️</span>
                <span>返回会员中心</span>
            </button>
        </div>

        <div class="toast" :class="{'show': showToast}">
            <span>{{ toastMessage }}</span>
        </div>
    </div>
</template>

<script>
import premiereData from '@/data/premiere.js';

export default {
    name: 'Premiere',
    created() {
        this.$store.commit('changeHt', '首映抢先看');
        this.initData();
    },
    data() {
        return {
            activeTab: 'coming-week',
            searchKeyword: '',
            selectedCity: 'all',
            selectedType: 'all',
            cities: [],
            types: [],
            vipLevels: [],
            comingWeekItems: [],
            advancePreviewItems: [],
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
        filteredComingWeekItems() {
            let result = [...this.comingWeekItems];
            
            if (this.selectedCity !== 'all') {
                result = result.filter(t => t.city === this.selectedCity);
            }
            
            if (this.selectedType !== 'all') {
                result = result.filter(t => t.type === this.selectedType);
            }
            
            if (this.searchKeyword) {
                const keyword = this.searchKeyword.toLowerCase();
                result = result.filter(t => 
                    t.name.toLowerCase().includes(keyword) || 
                    (t.artist && t.artist.toLowerCase().includes(keyword)) ||
                    t.city.toLowerCase().includes(keyword) ||
                    t.description.toLowerCase().includes(keyword)
                );
            }
            
            return result;
        },
        filteredAdvancePreviewItems() {
            let result = [...this.advancePreviewItems];
            
            if (this.selectedCity !== 'all') {
                result = result.filter(t => t.city === this.selectedCity);
            }
            
            if (this.selectedType !== 'all') {
                result = result.filter(t => t.type === this.selectedType);
            }
            
            if (this.searchKeyword) {
                const keyword = this.searchKeyword.toLowerCase();
                result = result.filter(t => 
                    t.name.toLowerCase().includes(keyword) || 
                    (t.artist && t.artist.toLowerCase().includes(keyword)) ||
                    t.city.toLowerCase().includes(keyword)
                );
            }
            
            return result;
        }
    },
    methods: {
        initData() {
            this.cities = premiereData.cities;
            this.types = premiereData.types;
            this.vipLevels = premiereData.vipLevels;
            this.comingWeekItems = premiereData.comingWeekItems;
            this.advancePreviewItems = premiereData.advancePreviewItems;
        },
        getLevelInfo(level) {
            return this.vipLevels.find(l => l.level === level) || this.vipLevels[0];
        },
        getTypeName(code) {
            const type = this.types.find(t => t.code === code);
            return type ? type.name : code;
        },
        performSearch() {
        },
        filterByCity(cityName) {
            this.selectedCity = cityName;
        },
        filterByType(typeCode) {
            this.selectedType = typeCode;
        },
        clearFilters() {
            this.selectedCity = 'all';
            this.selectedType = 'all';
            this.searchKeyword = '';
        },
        goToDetail(item) {
            this.showToastMessage(`正在跳转到「${item.name}」详情页...`);
        },
        handleAction(item) {
            if (item.minLevel <= this.userInfo.vipLevel) {
                if (item.canBuy) {
                    this.showToastMessage('正在跳转到购票页面...');
                } else {
                    this.showToastMessage('已预约开售提醒，开售时将通知您');
                }
            } else {
                this.showToastMessage('请升级会员解锁此特权');
            }
        },
        subscribeItem(item) {
            this.showToastMessage(`已订阅「${item.name}」的上映提醒`);
        },
        shareItem(item) {
            this.showToastMessage(`正在分享「${item.name}」...`);
        },
        goToHotMovies() {
            this.showToastMessage('正在跳转到热门电影页面...');
        },
        goBack() {
            this.$router.push({
                path: '/vip',
                name: 'vip'
            });
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
.premiere-page {
    background-color: #f5f5f5;
    min-height: 100vh;
    padding-bottom: 100px;
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

.search-section {
    padding: 15px;
    background: #fff;
    margin-bottom: 10px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
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
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
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
    border-color: #E54847;
    color: #E54847;
}

.filter-btn.active {
    background: linear-gradient(135deg, #E54847 0%, #ff6b6b 100%);
    border-color: #E54847;
    color: #fff;
}

.item-list {
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
    cursor: pointer;

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

.ticket-level {
    position: absolute;
    top: 8px;
    right: 8px;
}

.level-lock {
    background: rgba(0,0,0,0.7);
    color: #fff;
    font-size: 10px;
    padding: 2px 6px;
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
    display: box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    box-orient: vertical;
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

.price-text {
    font-size: 14px;
    color: #999;
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

    &:hover:not(.locked) {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(229, 72, 71, 0.3);
    }

    &.locked {
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
    cursor: pointer;

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
    display: box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    box-orient: vertical;
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

.merchandise-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: auto;
}

.merchandise-price-section {
    margin-top: auto;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}

.action-buttons {
    display: flex;
    gap: 10px;
    width: 100%;
}

.subscribe-btn,
.share-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 8px 0;
    border: 1px solid #e0e0e0;
    border-radius: 20px;
    background: #fff;
    font-size: 12px;
    color: #666;
    cursor: pointer;
    transition: all 0.3s;
}

.subscribe-btn:hover {
    border-color: #E54847;
    color: #E54847;
}

.share-btn:hover {
    border-color: #666;
    color: #333;
}

.empty-state {
    text-align: center;
    padding: 60px 20px;
    background: #fff;
    border-radius: 12px;
}

.empty-icon {
    font-size: 48px;
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

.bottom-action-section {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    padding: 15px;
    display: flex;
    gap: 15px;
    box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
    z-index: 100;
}

.primary-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 14px 20px;
    background: linear-gradient(135deg, #E54847 0%, #ff6b6b 100%);
    border: none;
    border-radius: 25px;
    color: #fff;
    font-size: 15px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(229, 72, 71, 0.3);
    }
}

.secondary-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 14px 20px;
    background: #f5f5f5;
    border: 1px solid #e0e0e0;
    border-radius: 25px;
    color: #666;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background: #f0f0f0;
        border-color: #ccc;
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

    .bottom-action-section {
        flex-direction: column;
    }
}
</style>
