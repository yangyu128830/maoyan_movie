<template>
    <div class="premiere-page">
        <div class="page-header">
            <div class="vip-banner">
                <div class="banner-content">
                    <div class="banner-icon">🎬</div>
                    <div class="banner-info">
                        <h2>首映抢先看</h2>
                        <p>提前一周 · 独家资讯 · 第一时间</p>
                    </div>
                </div>
                <div class="user-level-badge">
                    <span class="level-icon">{{userLevel.icon}}</span>
                    <span class="level-text">{{userLevel.shortName}}会员</span>
                </div>
            </div>
        </div>

        <div class="hot-premiere-section">
            <div class="section-header">
                <h3>🔥 热门抢先看</h3>
                <span class="more-link" @click="scrollToAll">查看全部 ></span>
            </div>
            <div class="hot-premiere-slider">
                <div class="hot-premiere-wrapper">
                    <div 
                        class="hot-premiere-card" 
                        v-for="(item, index) in hotPremieres" 
                        :key="item.id"
                        :class="{ 'active': currentHotIndex === index }"
                        @click="showHotDetail(item)"
                    >
                        <div class="hot-card-image-wrapper">
                            <img :src="item.image" :alt="item.name" class="hot-card-image">
                            <div class="hot-card-tags">
                                <span class="tag hot-tag">热门</span>
                                <span class="tag advance-tag" v-if="item.advanceDays > 0">
                                    提前{{item.advanceDays}}天
                                </span>
                            </div>
                            <div class="hot-card-badge">
                                <span class="badge-icon">⏰</span>
                                <span class="badge-text">{{item.releaseStatus}}</span>
                            </div>
                        </div>
                        <div class="hot-card-content">
                            <h4 class="hot-card-title">{{item.name}}</h4>
                            <p class="hot-card-desc">{{item.shortDesc}}</p>
                            <div class="hot-card-meta">
                                <span class="meta-item">📅 {{item.releaseDate}}</span>
                                <span class="meta-item">📍 {{item.city}}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="slider-dots">
                    <span 
                        class="dot" 
                        v-for="(item, index) in hotPremieres" 
                        :key="item.id"
                        :class="{ 'active': currentHotIndex === index }"
                        @click="currentHotIndex = index"
                    ></span>
                </div>
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
            <div class="filter-row" v-if="selectedCity !== 'all' || selectedType !== 'all' || searchKeyword">
                <div class="filter-info">
                    <span v-if="selectedCity !== 'all'" class="filter-tag">📍 {{ selectedCity }}</span>
                    <span v-if="selectedType !== 'all'" class="filter-tag">🎭 {{ getTypeName(selectedType) }}</span>
                    <span v-if="searchKeyword" class="filter-tag">🔍 {{ searchKeyword }}</span>
                    <button class="clear-btn" @click="clearFilters">清除筛选</button>
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
                    <span class="tab-count" v-if="comingWeekItems.length > 0">({{ comingWeekItems.length }})</span>
                </div>
                <div 
                    class="tab-item" 
                    :class="{ active: activeTab === 'advance-preview' }"
                    @click="activeTab = 'advance-preview'"
                >
                    <span class="tab-icon">✨</span>
                    <span class="tab-text">提前预告</span>
                    <span class="tab-count" v-if="advancePreviewItems.length > 0">({{ advancePreviewItems.length }})</span>
                </div>
            </div>
        </div>

        <div class="content-section" ref="contentSection">
            <div class="coming-week-section" v-if="activeTab === 'coming-week'">
                <div class="section-header">
                    <div class="header-left">
                        <h3>📅 一周内上映</h3>
                        <p class="section-desc">未来7天即将上映的电影和演出，会员专享提前购票</p>
                    </div>
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

                <div class="item-list" v-if="filteredComingWeekItems.length > 0">
                    <div 
                        class="item-card" 
                        v-for="item in filteredComingWeekItems" 
                        :key="item.id"
                        @click="goToDetail(item)"
                    >
                        <div class="item-image-wrapper">
                            <img :src="item.image" :alt="item.name" class="item-image">
                            <div class="item-tags">
                                <span class="tag type-tag">{{ getTypeName(item.type) }}</span>
                                <span class="tag level-tag" v-if="item.minLevel > userInfo.vipLevel">
                                    🔒 {{ getLevelInfo(item.minLevel).shortName }}+
                                </span>
                            </div>
                            <div class="item-countdown" v-if="item.minLevel <= userInfo.vipLevel && item.saleStartDate">
                                <div class="countdown-badge">
                                    <span class="badge-icon">⏰</span>
                                    <span class="badge-text">{{ getCountdownText(item) }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="item-content">
                            <h4 class="item-title">{{ item.name }}</h4>
                            <p class="item-desc">{{ item.description }}</p>
                            <div class="item-meta">
                                <span class="meta-item">📅 {{ item.releaseDate }}</span>
                                <span class="meta-item">📍 {{ item.city }} · {{ item.venue }}</span>
                                <span class="meta-item" v-if="item.artist">🎤 {{ item.artist }}</span>
                            </div>
                            <div class="item-price-section">
                                <div class="price-info">
                                    <span class="original-price" v-if="item.originalPrice">¥{{ item.originalPrice }}</span>
                                    <span class="vip-price" v-if="item.vipPrice">
                                        <span class="vip-label">会员价</span>
                                        <span class="price-value">¥{{ item.vipPrice }}</span>
                                    </span>
                                    <span class="price-text" v-else>{{ item.priceText || '敬请期待' }}</span>
                                </div>
                                <div class="item-action">
                                    <button 
                                        class="action-btn" 
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
                </div>

                <div class="empty-state" v-else>
                    <div class="empty-icon">🎬</div>
                    <p>暂无一周内上映的内容</p>
                    <button class="reset-btn" @click="clearFilters">查看全部</button>
                </div>
            </div>

            <div class="advance-preview-section" v-if="activeTab === 'advance-preview'">
                <div class="section-header">
                    <div class="header-left">
                        <h3>✨ 提前预告</h3>
                        <p class="section-desc">未来即将上映的精彩内容，第一时间获取资讯</p>
                    </div>
                </div>

                <div class="item-list" v-if="filteredAdvancePreviewItems.length > 0">
                    <div 
                        class="item-card preview-card" 
                        v-for="item in filteredAdvancePreviewItems" 
                        :key="item.id"
                        @click="goToDetail(item)"
                    >
                        <div class="item-image-wrapper">
                            <img :src="item.image" :alt="item.name" class="item-image">
                            <div class="item-tags">
                                <span class="tag type-tag">{{ getTypeName(item.type) }}</span>
                                <span class="tag preview-tag">即将上映</span>
                            </div>
                        </div>
                        <div class="item-content">
                            <h4 class="item-title">{{ item.name }}</h4>
                            <p class="item-desc">{{ item.description }}</p>
                            <div class="item-meta">
                                <span class="meta-item">📅 {{ item.releaseDate }}</span>
                                <span class="meta-item">📍 {{ item.city }}</span>
                                <span class="meta-item" v-if="item.artist">🎤 {{ item.artist }}</span>
                            </div>
                            <div class="item-action-section">
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

                <div class="empty-state" v-else>
                    <div class="empty-icon">✨</div>
                    <p>暂无提前预告内容</p>
                    <p class="empty-desc">敬请期待更多精彩内容</p>
                </div>
            </div>
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
        this.startAutoSlide();
    },
    destroyed() {
        if (this.slideTimer) {
            clearInterval(this.slideTimer);
        }
    },
    data() {
        return {
            activeTab: 'coming-week',
            searchKeyword: '',
            selectedCity: 'all',
            selectedType: 'all',
            currentHotIndex: 0,
            slideTimer: null,
            cities: [],
            types: [],
            vipLevels: [],
            hotPremieres: [],
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
            this.hotPremieres = premiereData.hotPremieres;
            this.comingWeekItems = premiereData.comingWeekItems;
            this.advancePreviewItems = premiereData.advancePreviewItems;
        },
        startAutoSlide() {
            this.slideTimer = setInterval(() => {
                this.currentHotIndex = (this.currentHotIndex + 1) % this.hotPremieres.length;
            }, 5000);
        },
        getLevelInfo(level) {
            return this.vipLevels.find(l => l.level === level) || this.vipLevels[0];
        },
        getTypeName(code) {
            const type = this.types.find(t => t.code === code);
            return type ? type.name : code;
        },
        getCountdownText(item) {
            if (!item.saleStartDate) return '即将开售';
            
            const now = new Date();
            const saleDate = new Date(item.saleStartDate);
            const diff = saleDate - now;
            
            if (diff <= 0) return '已开售';
            
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            
            if (days > 0) {
                return `${days}天${hours}小时后开售`;
            }
            return `${hours}小时后开售`;
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
        scrollToAll() {
            if (this.$refs.contentSection) {
                this.$refs.contentSection.scrollIntoView({ behavior: 'smooth' });
            }
        },
        showHotDetail(item) {
            this.showToastMessage(`正在查看「${item.name}」详情...`);
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

.premiere-page {
    background-color: #f5f5f5;
    min-height: 100vh;
    padding-bottom: 20px;
}

.page-header {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
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

.hot-premiere-section {
    background: linear-gradient(180deg, #1a1a2e 0%, #f5f5f5 50%);
    padding: 0 15px 15px;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.section-header h3 {
    font-size: 17px;
    font-weight: bold;
    color: #fff;
}

.more-link {
    font-size: 13px;
    color: #ffd700;
    cursor: pointer;
}

.hot-premiere-slider {
    position: relative;
}

.hot-premiere-wrapper {
    display: flex;
    overflow: hidden;
    border-radius: 12px;
}

.hot-premiere-card {
    min-width: 100%;
    cursor: pointer;
    transition: all 0.3s;
}

.hot-card-image-wrapper {
    position: relative;
    height: 200px;
    border-radius: 12px 12px 0 0;
    overflow: hidden;
}

.hot-card-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.hot-card-tags {
    position: absolute;
    top: 12px;
    left: 12px;
    display: flex;
    gap: 6px;
}

.tag {
    padding: 3px 8px;
    font-size: 10px;
    border-radius: 4px;
    font-weight: 500;
}

.hot-tag {
    background: linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%);
    color: #fff;
}

.advance-tag {
    background: linear-gradient(135deg, #4ecdc4 0%, #6ee7de 100%);
    color: #fff;
}

.hot-card-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    display: flex;
    align-items: center;
    gap: 4px;
    background: linear-gradient(135deg, #ffd700 0%, #ffaa00 100%);
    padding: 4px 10px;
    border-radius: 15px;
    font-size: 11px;
    color: #333;
    font-weight: 500;
}

.badge-icon {
    font-size: 12px;
}

.hot-card-content {
    background: #fff;
    padding: 15px;
    border-radius: 0 0 12px 12px;
}

.hot-card-title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin-bottom: 8px;
}

.hot-card-desc {
    font-size: 13px;
    color: #666;
    margin-bottom: 10px;
    line-height: 1.4;
}

.hot-card-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.meta-item {
    font-size: 12px;
    color: #999;
}

.slider-dots {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 15px;
}

.dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #ccc;
    cursor: pointer;
    transition: all 0.3s;
}

.dot.active {
    width: 24px;
    border-radius: 4px;
    background: linear-gradient(135deg, #E54847 0%, #ff6b6b 100%);
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
    background: linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%);
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
    border-color: #E54847;
    color: #E54847;
}

.filter-btn.active {
    background: linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%);
    border-color: #1a1a2e;
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
    background: linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%);
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
}

.tab-item.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #1a1a2e 0%, #0f3460 100%);
    border-radius: 2px;
}

.tab-icon {
    font-size: 18px;
    margin-right: 6px;
}

.tab-text {
    font-size: 15px;
    color: #666;
    font-weight: 500;
}

.active .tab-text {
    color: #1a1a2e;
}

.tab-count {
    font-size: 12px;
    color: #999;
    margin-left: 4px;
}

.active .tab-count {
    color: #1a1a2e;
}

.content-section {
    padding: 0 15px;
}

.section-desc {
    font-size: 12px;
    color: #999;
}

.coming-week-section .section-header {
    margin-bottom: 15px;
    padding: 15px;
    background: #fff;
    border-radius: 8px;
}

.coming-week-section .section-header h3 {
    color: #333;
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

.item-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.item-card {
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
}

.item-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.1);
}

.preview-card {
    flex-direction: column;
}

.item-image-wrapper {
    position: relative;
    width: 120px;
    flex-shrink: 0;
}

.preview-card .item-image-wrapper {
    width: 100%;
    height: 180px;
}

.item-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.item-tags {
    position: absolute;
    top: 10px;
    left: 10px;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.type-tag {
    background: linear-gradient(135deg, #4ecdc4 0%, #6ee7de 100%);
    color: #fff;
}

.level-tag {
    background: rgba(0,0,0,0.7);
    color: #fff;
}

.preview-tag {
    background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
    color: #333;
}

.item-countdown {
    position: absolute;
    bottom: 10px;
    left: 10px;
    right: 10px;
}

.countdown-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    background: rgba(0,0,0,0.7);
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 10px;
    color: #fff;
}

.item-content {
    flex: 1;
    padding: 12px;
    display: flex;
    flex-direction: column;
}

.item-title {
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

.item-desc {
    font-size: 12px;
    color: #666;
    margin-bottom: 10px;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.item-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: auto;
}

.item-price-section {
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
    color: #E54847;
    margin-right: 4px;
}

.price-value {
    font-size: 20px;
    font-weight: bold;
    color: #E54847;
}

.price-text {
    font-size: 14px;
    color: #999;
}

.item-action {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

.action-btn {
    padding: 8px 20px;
    background: linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%);
    border: none;
    border-radius: 20px;
    color: #fff;
    font-size: 13px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 2px 8px rgba(26, 26, 46, 0.3);
}

.action-btn:hover:not(.locked) {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(26, 26, 46, 0.4);
}

.action-btn.locked {
    background: #e0e0e0;
    color: #999;
    cursor: not-allowed;
    box-shadow: none;
}

.item-action-section {
    display: flex;
    gap: 10px;
    margin-top: 10px;
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
    border-radius: 8px;
    background: #fff;
    font-size: 13px;
    color: #666;
    cursor: pointer;
    transition: all 0.3s;
}

.subscribe-btn:hover {
    border-color: #E54847;
    color: #E54847;
}

.share-btn:hover {
    border-color: #1a1a2e;
    color: #1a1a2e;
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
    background: linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%);
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
}

.toast.show {
    opacity: 1;
    visibility: visible;
}

@media (max-width: 360px) {
    .item-price-section {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
    }

    .item-action {
        width: 100%;
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
