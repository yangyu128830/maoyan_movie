<template>
    <div class="birthday-benefit-page">
        <div class="benefit-banner">
            <div class="banner-content">
                <div class="banner-icon">🎁</div>
                <div class="banner-text">
                    <h2>生日专属福利</h2>
                    <p>免费电影票 · 零食套餐 · 尊享特权</p>
                </div>
            </div>
        </div>

        <div class="tabs-section">
            <div class="tabs">
                <div 
                    class="tab-item" 
                    :class="{ active: activeTab === 'gifts' }"
                    @click="activeTab = 'gifts'"
                >
                    <span class="tab-icon">🎁</span>
                    <span class="tab-text">生日福利</span>
                </div>
                <div 
                    class="tab-item" 
                    :class="{ active: activeTab === 'cinemas' }"
                    @click="activeTab = 'cinemas'"
                >
                    <span class="tab-icon">📍</span>
                    <span class="tab-text">支持影院</span>
                </div>
            </div>
        </div>

        <div class="content-section">
            <div class="gifts-section" v-if="activeTab === 'gifts'">
                <div class="section-intro">
                    <h3>🎂 生日专属福利</h3>
                    <p>在您生日当天，可享受以下专属福利：</p>
                </div>

                <div class="privilege-tips">
                    <div class="tip-item">
                        <span class="tip-icon">🎬</span>
                        <span class="tip-text">免费电影票：生日当天可领取2张</span>
                    </div>
                    <div class="tip-item">
                        <span class="tip-icon">🍿</span>
                        <span class="tip-text">零食套餐：88.88元零食大礼包</span>
                    </div>
                    <div class="tip-item">
                        <span class="tip-icon">📍</span>
                        <span class="tip-text">全国影院：支持全国合作影院兑换</span>
                    </div>
                </div>

                <div class="gift-card">
                    <div class="gift-header">
                        <div class="gift-icon-wrapper">
                            <span class="gift-icon">🎬</span>
                        </div>
                        <div class="gift-header-info">
                            <h4>免费电影票</h4>
                            <span class="gift-count">× {{ birthdayGifts.movieTickets.count }}张</span>
                        </div>
                        <span class="gift-status" :class="birthdayGifts.movieTickets.isClaimed ? 'claimed' : 'available'">
                            <span v-if="birthdayGifts.movieTickets.isClaimed">已领取</span>
                            <span v-else>待领取</span>
                        </span>
                    </div>
                    <div class="gift-body">
                        <div class="gift-desc">
                            <p class="desc-title">福利说明</p>
                            <p class="desc-text">{{ birthdayGifts.movieTickets.description }}</p>
                        </div>
                        <div class="gift-validity">
                            <span class="validity-label">有效期：</span>
                            <span class="validity-text">{{ birthdayGifts.movieTickets.validity }}</span>
                        </div>
                        <div class="gift-note">
                            <span class="note-icon">💡</span>
                            <span class="note-text">凭兑换码可在支持的影院兑换任意普通厅电影票</span>
                        </div>
                    </div>
                    <div class="gift-footer">
                        <button 
                            class="claim-btn" 
                            :class="birthdayGifts.movieTickets.isClaimed ? 'claimed' : ''"
                            :disabled="birthdayGifts.movieTickets.isClaimed"
                            @click="claimBirthdayMovieTickets"
                        >
                            <span v-if="!birthdayGifts.movieTickets.isClaimed">立即领取</span>
                            <span v-else>已领取</span>
                        </button>
                    </div>
                </div>

                <div class="gift-card">
                    <div class="gift-header">
                        <div class="gift-icon-wrapper">
                            <span class="gift-icon">🍿</span>
                        </div>
                        <div class="gift-header-info">
                            <h4>{{ birthdayGifts.snackPackage.name }}</h4>
                        </div>
                        <span class="gift-status" :class="birthdayGifts.snackPackage.isClaimed ? 'claimed' : 'available'">
                            <span v-if="birthdayGifts.snackPackage.isClaimed">已领取</span>
                            <span v-else>待领取</span>
                        </span>
                    </div>
                    <div class="gift-body">
                        <div class="gift-desc">
                            <p class="desc-title">福利说明</p>
                            <p class="desc-text">{{ birthdayGifts.snackPackage.description }}</p>
                        </div>
                        <div class="gift-includes">
                            <p class="includes-label">套餐包含：</p>
                            <p class="includes-text">{{ birthdayGifts.snackPackage.includes }}</p>
                        </div>
                        <div class="gift-note">
                            <span class="note-icon">💡</span>
                            <span class="note-text">请在支持的影院柜台出示兑换码领取</span>
                        </div>
                    </div>
                    <div class="gift-footer">
                        <button 
                            class="claim-btn" 
                            :class="birthdayGifts.snackPackage.isClaimed ? 'claimed' : ''"
                            :disabled="birthdayGifts.snackPackage.isClaimed"
                            @click="claimSnackPackage"
                        >
                            <span v-if="!birthdayGifts.snackPackage.isClaimed">立即领取</span>
                            <span v-else>已领取</span>
                        </button>
                    </div>
                </div>

                <div class="birthday-tip">
                    <div class="tip-icon-wrapper">
                        <span class="tip-icon">💡</span>
                    </div>
                    <div class="tip-content">
                        <h4>温馨提示</h4>
                        <ul class="tip-list">
                            <li>生日福利仅限生日当天领取，请提前设置好您的生日信息</li>
                            <li>免费电影票可在支持的影院兑换任意普通厅2D/3D电影</li>
                            <li>零食套餐需凭兑换码到影院柜台领取</li>
                            <li>点击"支持影院"可查看支持生日特权的影院列表</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="cinemas-section" v-else>
                <div class="section-intro">
                    <h3>📍 支持生日特权的影院</h3>
                    <p>以下影院支持生日特权兑换，请选择您所在城市查看：</p>
                </div>

                <div class="city-filter">
                    <div class="filter-label">城市筛选：</div>
                    <div class="filter-buttons">
                        <button 
                            class="filter-btn" 
                            :class="{ active: cinemaFilter === 'all' }"
                            @click="cinemaFilter = 'all'"
                        >
                            全部城市
                        </button>
                        <button 
                            class="filter-btn" 
                            v-for="city in uniqueCities" 
                            :key="city"
                            :class="{ active: cinemaFilter === city }"
                            @click="cinemaFilter = city"
                        >
                            {{ city }}
                        </button>
                    </div>
                </div>

                <div class="cinema-list">
                    <div 
                        class="cinema-card" 
                        v-for="cinema in filteredCinemas" 
                        :key="cinema.id"
                    >
                        <div class="cinema-icon-wrapper">
                            <span class="cinema-icon">🎥</span>
                        </div>
                        <div class="cinema-content">
                            <div class="cinema-header">
                                <h4 class="cinema-name">{{ cinema.name }}</h4>
                                <span class="supported-tag">支持</span>
                            </div>
                            <div class="cinema-info">
                                <div class="info-item">
                                    <span class="info-icon">📍</span>
                                    <span class="info-text">{{ cinema.city }} · {{ cinema.address }}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-icon">📞</span>
                                    <span class="info-text">{{ cinema.phone }}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-icon">⏰</span>
                                    <span class="info-text">{{ cinema.businessHours }}</span>
                                </div>
                            </div>
                        </div>
                        <button class="nav-btn" @click="navigateToCinema(cinema)">
                            导航
                        </button>
                    </div>
                </div>

                <div class="empty-state" v-if="filteredCinemas.length === 0">
                    <div class="empty-icon">📍</div>
                    <p>该城市暂未开通生日特权，请选择其他城市。</p>
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
    name: 'BirthdayBenefit',
    created() {
        this.$store.commit('changeHt', '生日礼包');
    },
    data() {
        return {
            activeTab: 'gifts',
            showToast: false,
            toastMessage: '',
            cinemaFilter: 'all',
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
            birthdayGifts: {
                movieTickets: {
                    count: 2,
                    description: '生日当天可免费领取两张普通厅电影票',
                    validity: '生日当天有效',
                    isClaimed: false
                },
                snackPackage: {
                    name: '88.88元零食套餐',
                    description: '可到当地平台合作电影院柜台领取',
                    includes: '包含：大桶爆米花+两杯可乐+一份小吃',
                    isClaimed: false
                }
            },
            supportedCinemas: [
                {
                    id: 1,
                    name: '万达影城（朝阳店）',
                    city: '北京',
                    address: '北京市朝阳区建国路88号万达广场',
                    phone: '010-88888888',
                    businessHours: '10:00 - 23:00',
                    supported: true
                },
                {
                    id: 2,
                    name: 'CGV影城（国贸店）',
                    city: '北京',
                    address: '北京市朝阳区建国门外大街1号国贸商城',
                    phone: '010-66666666',
                    businessHours: '10:00 - 22:30',
                    supported: true
                },
                {
                    id: 3,
                    name: '金逸影城（中关村店）',
                    city: '北京',
                    address: '北京市海淀区中关村大街19号新中关购物中心',
                    phone: '010-55555555',
                    businessHours: '09:30 - 22:30',
                    supported: true
                },
                {
                    id: 4,
                    name: '百老汇影城（三里屯店）',
                    city: '北京',
                    address: '北京市朝阳区三里屯太古里北区',
                    phone: '010-77777777',
                    businessHours: '10:00 - 23:00',
                    supported: true
                },
                {
                    id: 5,
                    name: '万达影城（南京东路店）',
                    city: '上海',
                    address: '上海市黄浦区南京东路300号恒基名人购物中心',
                    phone: '021-88888888',
                    businessHours: '10:00 - 23:00',
                    supported: true
                },
                {
                    id: 6,
                    name: 'CGV影城（五角场店）',
                    city: '上海',
                    address: '上海市杨浦区邯郸路600号万达广场',
                    phone: '021-66666666',
                    businessHours: '10:00 - 22:30',
                    supported: true
                },
                {
                    id: 7,
                    name: '万达影城（天河店）',
                    city: '广州',
                    address: '广州市天河区天河路385号太古汇',
                    phone: '020-88888888',
                    businessHours: '10:00 - 23:00',
                    supported: true
                },
                {
                    id: 8,
                    name: '金逸影城（北京路店）',
                    city: '广州',
                    address: '广州市越秀区北京路312号青年文化宫',
                    phone: '020-55555555',
                    businessHours: '10:00 - 22:30',
                    supported: true
                }
            ]
        };
    },
    computed: {
        userLevel() {
            return this.vipLevels.find(l => l.level === this.userInfo.vipLevel) || this.vipLevels[0];
        },
        filteredCinemas() {
            if (this.cinemaFilter === 'all') {
                return this.supportedCinemas;
            }
            return this.supportedCinemas.filter(c => c.city === this.cinemaFilter);
        },
        uniqueCities() {
            const cities = this.supportedCinemas.map(c => c.city);
            return [...new Set(cities)];
        }
    },
    methods: {
        claimBirthdayMovieTickets() {
            if (!this.birthdayGifts.movieTickets.isClaimed) {
                this.birthdayGifts.movieTickets.isClaimed = true;
                this.showToastMessage('恭喜！您已成功领取2张免费电影票！');
            } else {
                this.showToastMessage('您已领取过免费电影票了');
            }
        },
        claimSnackPackage() {
            if (!this.birthdayGifts.snackPackage.isClaimed) {
                this.birthdayGifts.snackPackage.isClaimed = true;
                this.showToastMessage('恭喜！您已成功领取88.88元零食套餐兑换券！');
            } else {
                this.showToastMessage('您已领取过零食套餐了');
            }
        },
        navigateToCinema(cinema) {
            this.showToastMessage(`正在导航到${cinema.name}...`);
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
.birthday-benefit-page {
    background-color: #f5f5f5;
    min-height: 100vh;
    padding-bottom: 20px;
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
    min-width: 180px;

    .tip-icon {
        font-size: 16px;
    }

    .tip-text {
        font-size: 12px;
        color: #333;
        font-weight: 500;
    }
}

.gift-card {
    background: #fff;
    border-radius: 12px;
    margin-bottom: 15px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    border: 1px solid #f0f0f0;
    overflow: hidden;
}

.gift-header {
    display: flex;
    align-items: center;
    padding: 15px;
    background: linear-gradient(135deg, #fff5f5 0%, #fff9e6 100%);
    border-bottom: 1px solid #f0f0f0;
}

.gift-icon-wrapper {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: linear-gradient(135deg, #E54847 0%, #ff6b6b 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
}

.gift-icon {
    font-size: 22px;
}

.gift-header-info {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;
}

.gift-header-info h4 {
    font-size: 15px;
    font-weight: bold;
    color: #333;
}

.gift-count {
    font-size: 14px;
    color: #E54847;
    font-weight: bold;
}

.gift-status {
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;

    &.available {
        background: #e8f5e9;
        color: #4caf50;
    }

    &.claimed {
        background: #f5f5f5;
        color: #999;
    }
}

.gift-body {
    padding: 15px;
}

.gift-desc,
.gift-includes,
.gift-validity {
    margin-bottom: 12px;

    .desc-title,
    .includes-label,
    .validity-label {
        font-size: 12px;
        color: #999;
        margin-bottom: 4px;
    }

    .desc-text,
    .includes-text,
    .validity-text {
        font-size: 13px;
        color: #333;
        line-height: 1.5;
    }
}

.gift-note {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px;
    background: #fff9e6;
    border-radius: 8px;

    .note-icon {
        font-size: 14px;
    }

    .note-text {
        font-size: 11px;
        color: #996600;
    }
}

.gift-footer {
    padding: 15px;
    padding-top: 0;
}

.claim-btn {
    width: 100%;
    padding: 12px;
    background: linear-gradient(135deg, #E54847 0%, #ff6b6b 100%);
    border: none;
    border-radius: 10px;
    color: #fff;
    font-size: 15px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover:not(.claimed) {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(229, 72, 71, 0.3);
    }

    &.claimed {
        background: #e0e0e0;
        color: #999;
        cursor: not-allowed;
    }
}

.birthday-tip {
    display: flex;
    gap: 12px;
    padding: 15px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    border: 1px solid #f0f0f0;
}

.tip-icon-wrapper {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #e8f5e9;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.tip-content {
    flex: 1;
}

.tip-content h4 {
    font-size: 14px;
    font-weight: bold;
    color: #333;
    margin-bottom: 8px;
}

.tip-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.tip-list li {
    font-size: 12px;
    color: #666;
    margin-bottom: 6px;
    line-height: 1.5;
    position: relative;
    padding-left: 14px;

    &::before {
        content: '•';
        position: absolute;
        left: 0;
        color: #999;
    }

    &:last-child {
        margin-bottom: 0;
    }
}

.city-filter {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
    padding: 15px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.filter-label {
    font-size: 13px;
    color: #333;
    font-weight: 500;
}

.filter-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.filter-btn {
    padding: 6px 14px;
    background: #f5f5f5;
    border: none;
    border-radius: 15px;
    font-size: 12px;
    color: #666;
    cursor: pointer;
    transition: all 0.3s ease;

    &.active {
        background: linear-gradient(135deg, #E54847 0%, #ff6b6b 100%);
        color: #fff;
        font-weight: 500;
    }

    &:hover:not(.active) {
        background: #e8e8e8;
    }
}

.cinema-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.cinema-card {
    display: flex;
    background: #fff;
    border-radius: 12px;
    padding: 15px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    border: 1px solid #f0f0f0;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    }
}

.cinema-icon-wrapper {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: linear-gradient(135deg, #E54847 0%, #ff6b6b 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    flex-shrink: 0;
}

.cinema-icon {
    font-size: 22px;
}

.cinema-content {
    flex: 1;
    min-width: 0;
}

.cinema-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
}

.cinema-name {
    font-size: 14px;
    font-weight: bold;
    color: #333;
    line-height: 1.3;
    display: -webkit-box;
    display: box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    box-orient: vertical;
    overflow: hidden;
}

.supported-tag {
    padding: 3px 10px;
    background: linear-gradient(135deg, #4caf50 0%, #81c784 100%);
    color: #fff;
    font-size: 11px;
    font-weight: 500;
    border-radius: 10px;
    flex-shrink: 0;
    margin-left: 8px;
}

.cinema-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.info-item {
    display: flex;
    align-items: flex-start;
    gap: 4px;
}

.info-icon {
    font-size: 12px;
    color: #999;
    flex-shrink: 0;
    margin-top: 1px;
}

.info-text {
    font-size: 11px;
    color: #999;
    line-height: 1.4;
}

.nav-btn {
    padding: 8px 16px;
    background: linear-gradient(135deg, #E54847 0%, #ff6b6b 100%);
    border: none;
    border-radius: 15px;
    color: #fff;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-left: 10px;
    flex-shrink: 0;
    align-self: center;

    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(229, 72, 71, 0.3);
    }
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
    .gift-header {
        flex-wrap: wrap;
        gap: 10px;
    }

    .gift-header-info {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
    }

    .gift-status {
        margin-left: auto;
    }

    .cinema-card {
        flex-direction: column;
        gap: 12px;
    }

    .cinema-icon-wrapper {
        display: none;
    }

    .nav-btn {
        width: 100%;
        margin-left: 0;
        margin-top: 10px;
    }

    .privilege-tips {
        flex-direction: column;
    }
}
</style>