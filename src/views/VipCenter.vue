<template>
    <div class="vip-center">
        <div class="vip-header">
            <div class="vip-header-content">
                <div class="vip-avatar">
                    <img :src="userInfo.avatar" alt="头像" class="avatar-img">
                    <div class="vip-badge">
                        <span class="vip-level-badge">{{currentLevel.shortName}}</span>
                    </div>
                </div>
                <div class="vip-user-info">
                    <h2 class="vip-username">{{userInfo.nickname}}</h2>
                    <div class="vip-level-display">
                        <span class="level-icon">{{currentLevel.icon}}</span>
                        <span class="level-name">{{currentLevel.name}}</span>
                    </div>
                    <div class="vip-expire">
                        <span>有效期至：{{userInfo.vipExpireDate}}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="coupon-section">
            <div class="section-header">
                <h3 class="section-title">本月优惠券</h3>
                <span class="coupon-count">已领 {{couponStats.claimed}}/{{couponStats.total}}</span>
            </div>
            <div class="coupon-grid">
                <div class="coupon-card" v-for="(coupon, index) in userCoupons" :key="coupon.id">
                    <div class="coupon-left" :style="{'background': getCouponColor(coupon)}">
                        <div class="coupon-value">
                            <span class="currency">¥</span>
                            <span class="value">{{coupon.value}}</span>
                        </div>
                        <div class="coupon-condition">满{{coupon.condition}}可用</div>
                    </div>
                    <div class="coupon-right">
                        <div class="coupon-name">{{coupon.name}}</div>
                        <div class="coupon-validity">有效期至 {{coupon.validity}}</div>
                        <button 
                            class="claim-btn" 
                            :class="{'claimed': coupon.isClaimed, 'disabled': coupon.isClaimed}"
                            :disabled="coupon.isClaimed"
                            @click="claimCoupon(coupon)"
                        >
                            <span v-if="!coupon.isClaimed">立即领取</span>
                            <span v-else>已领取</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="quick-actions">
            <div class="action-item" @click="goToVipTickets">
                <div class="action-icon">🎫</div>
                <span class="action-text">演出票特价</span>
            </div>
            <div class="action-item" @click="showLevelGuide = true">
                <div class="action-icon">📊</div>
                <span class="action-text">等级说明</span>
            </div>
            <div class="action-item" @click="showMyCoupons = true">
                <div class="action-icon">🎁</div>
                <span class="action-text">我的卡包</span>
            </div>
            <div class="action-item" @click="showPointsMall = true">
                <div class="action-icon">⭐</div>
                <span class="action-text">积分商城</span>
            </div>
        </div>

        <div class="progress-section">
            <div class="progress-header">
                <span class="progress-label">成长进度</span>
                <span class="progress-points">{{userInfo.vipPoints}} 成长值</span>
            </div>
            <div class="progress-bar-wrapper">
                <div class="progress-track">
                    <div class="progress-fill" :style="{'width': progressPercent + '%'}"></div>
                </div>
            </div>
            <div class="progress-info">
                <span>距离下一级还需 {{nextLevelPoints}} 成长值</span>
            </div>
        </div>

        <div class="benefits-section">
            <div class="section-header">
                <h3 class="section-title">专属福利</h3>
                <span class="more-link" @click="showAllBenefits = true">查看全部 ></span>
            </div>
            <div class="benefits-grid">
                <div class="benefit-card" v-for="(benefit, index) in currentBenefits" :key="index">
                    <div class="benefit-icon-wrapper" :style="{'background': benefit.bgColor}">
                        <span class="benefit-icon">{{benefit.icon}}</span>
                    </div>
                    <div class="benefit-info">
                        <h4 class="benefit-title">{{benefit.title}}</h4>
                        <p class="benefit-desc">{{benefit.desc}}</p>
                    </div>
                    <div class="benefit-action">
                        <button class="go-btn" v-if="benefit.hasAction" @click="handleBenefitAction(benefit)">
                            去使用
                        </button>
                        <span class="unlock-tag" v-else>已解锁</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="tickets-section" v-if="activeTab === 'tickets'">
            <div class="section-header">
                <h3 class="section-title">会员演出票特价</h3>
            </div>
            <div class="ticket-filter">
                <div class="filter-item" :class="{'active': ticketFilter === 'all'}" @click="ticketFilter = 'all'">
                    <span>全部</span>
                </div>
                <div class="filter-item" :class="{'active': ticketFilter === 'concert'}" @click="ticketFilter = 'concert'">
                    <span>演唱会</span>
                </div>
                <div class="filter-item" :class="{'active': ticketFilter === 'drama'}" @click="ticketFilter = 'drama'">
                    <span>话剧</span>
                </div>
                <div class="filter-item" :class="{'active': ticketFilter === 'musical'}" @click="ticketFilter = 'musical'">
                    <span>音乐剧</span>
                </div>
            </div>
            <div class="ticket-grid">
                <div class="ticket-card" v-for="(ticket, index) in filteredTickets" :key="ticket.id">
                    <div class="ticket-image-wrapper">
                        <img :src="ticket.image" :alt="ticket.name" class="ticket-image">
                        <div class="ticket-discount">
                            <span class="discount-badge">{{getDiscountText(ticket.discount)}}</span>
                        </div>
                        <div class="ticket-level" v-if="userInfo.vipLevel < ticket.minLevel">
                            <span class="level-lock">🔒 {{getLevelInfo(ticket.minLevel).shortName}}+</span>
                        </div>
                    </div>
                    <div class="ticket-info">
                        <h4 class="ticket-name">{{ticket.name}}</h4>
                        <p class="ticket-date">{{ticket.date}}</p>
                        <p class="ticket-venue">{{ticket.venue}}</p>
                        <div class="ticket-price">
                            <span class="original-price">¥{{ticket.originalPrice}}</span>
                            <span class="vip-price">¥<span class="price-number">{{getVipPrice(ticket)}}</span></span>
                        </div>
                        <button 
                            class="buy-btn" 
                            :class="{'locked': userInfo.vipLevel < ticket.minLevel}"
                            :disabled="userInfo.vipLevel < ticket.minLevel"
                            @click="buyTicket(ticket)"
                        >
                            <span v-if="userInfo.vipLevel >= ticket.minLevel">立即购票</span>
                            <span v-else>升级解锁</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal-overlay" v-if="showLevelGuide" @click="showLevelGuide = false">
            <div class="modal-content level-guide-modal" @click.stop>
                <div class="modal-header">
                    <h3>会员等级说明</h3>
                    <span class="close-btn" @click="showLevelGuide = false">×</span>
                </div>
                <div class="level-guide-list">
                    <div class="guide-item" v-for="(level, index) in vipLevels" :key="level.level" :class="{'active': userInfo.vipLevel >= level.level}">
                        <div class="guide-level-icon">
                            <span>{{level.icon}}</span>
                        </div>
                        <div class="guide-level-info">
                            <h4>{{level.name}}</h4>
                            <p class="guide-points">成长值要求：{{level.minPoints}}</p>
                            <p class="guide-coupons">每月 {{level.couponsPerMonth}} 张优惠券</p>
                        </div>
                        <div class="guide-status">
                            <span v-if="userInfo.vipLevel === level.level" class="current-tag">当前</span>
                            <span v-else-if="userInfo.vipLevel > level.level" class="unlocked-tag">已解锁</span>
                            <span v-else class="locked-tag">未解锁</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal-overlay" v-if="showMyCoupons" @click="showMyCoupons = false">
            <div class="modal-content coupons-modal" @click.stop>
                <div class="modal-header">
                    <h3>我的卡包</h3>
                    <span class="close-btn" @click="showMyCoupons = false">×</span>
                </div>
                <div class="coupons-tabs">
                    <div class="coupons-tab-item" :class="{'active': couponsTab === 'available'}" @click="couponsTab = 'available'">
                        <span>可使用 ({{availableCoupons.length}})</span>
                    </div>
                    <div class="coupons-tab-item" :class="{'active': couponsTab === 'used'}" @click="couponsTab = 'used'">
                        <span>已使用 ({{usedCoupons.length}})</span>
                    </div>
                    <div class="coupons-tab-item" :class="{'active': couponsTab === 'expired'}" @click="couponsTab = 'expired'">
                        <span>已过期 ({{expiredCoupons.length}})</span>
                    </div>
                </div>
                <div class="coupons-list">
                    <div class="my-coupon-card" v-for="(coupon, index) in displayCoupons" :key="coupon.id" :class="coupon.status">
                        <div class="my-coupon-left">
                            <div class="my-coupon-value">
                                <span class="my-currency">¥</span>
                                <span class="my-value">{{coupon.value}}</span>
                            </div>
                            <div class="my-coupon-condition">满{{coupon.condition}}可用</div>
                        </div>
                        <div class="my-coupon-right">
                            <div class="my-coupon-name">{{coupon.name}}</div>
                            <div class="my-coupon-validity">有效期至 {{coupon.validity}}</div>
                            <button class="use-btn" v-if="coupon.status === 'available'" @click="useCoupon(coupon)">
                                立即使用
                            </button>
                            <span class="status-tag" v-else-if="coupon.status === 'used'">已使用</span>
                            <span class="status-tag" v-else>已过期</span>
                        </div>
                    </div>
                    <div class="no-coupons" v-if="displayCoupons.length === 0">
                        <span>暂无优惠券</span>
                    </div>
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
    name: 'VipCenter',
    created() {
        this.$store.commit('changeHt', '会员中心');
    },
    data() {
        return {
            activeTab: 'home',
            ticketFilter: 'all',
            showLevelGuide: false,
            showMyCoupons: false,
            showPointsMall: false,
            showAllBenefits: false,
            couponsTab: 'available',
            showToast: false,
            toastMessage: '',
            userInfo: {
                nickname: '电影爱好者',
                avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cat%20avatar%20cartoon%20style%20round%20icon&image_size=square_hd',
                vipLevel: 3,
                vipPoints: 2580,
                vipExpireDate: '2027-12-31'
            },
            vipLevels: [
                {
                    level: 1,
                    name: '青铜会员',
                    shortName: '青铜',
                    icon: '🥉',
                    minPoints: 0,
                    nextLevelPoints: 500,
                    couponsPerMonth: 1,
                    color: '#cd7f32'
                },
                {
                    level: 2,
                    name: '白银会员',
                    shortName: '白银',
                    icon: '🥈',
                    minPoints: 500,
                    nextLevelPoints: 1500,
                    couponsPerMonth: 2,
                    color: '#c0c0c0'
                },
                {
                    level: 3,
                    name: '黄金会员',
                    shortName: '黄金',
                    icon: '🥇',
                    minPoints: 1500,
                    nextLevelPoints: 3500,
                    couponsPerMonth: 3,
                    color: '#ffd700'
                },
                {
                    level: 4,
                    name: '铂金会员',
                    shortName: '铂金',
                    icon: '💎',
                    minPoints: 3500,
                    nextLevelPoints: 6000,
                    couponsPerMonth: 4,
                    color: '#e5e4e2'
                },
                {
                    level: 5,
                    name: '钻石会员',
                    shortName: '钻石',
                    icon: '👑',
                    minPoints: 6000,
                    nextLevelPoints: 99999,
                    couponsPerMonth: 5,
                    color: '#b9f2ff'
                }
            ],
            userCoupons: [
                { id: 1, name: '电影通用优惠券', value: 15, condition: 50, validity: '2026-05-31', isClaimed: false },
                { id: 2, name: '演出票优惠券', value: 20, condition: 100, validity: '2026-05-31', isClaimed: false },
                { id: 3, name: 'IMAX专享券', value: 30, condition: 120, validity: '2026-05-31', isClaimed: true }
            ],
            myCoupons: [
                { id: 101, name: '电影通用优惠券', value: 15, condition: 50, validity: '2026-04-30', status: 'available' },
                { id: 102, name: '演出票优惠券', value: 20, condition: 100, validity: '2026-04-30', status: 'available' },
                { id: 103, name: '周末观影券', value: 10, condition: 40, validity: '2026-04-15', status: 'used' },
                { id: 104, name: '会员专享券', value: 25, condition: 80, validity: '2026-03-31', status: 'expired' }
            ],
            benefitsList: [
                { level: 1, icon: '💸', title: '购票优惠', desc: '购票享受9.5折', bgColor: '#fff5f5', hasAction: true, actionType: 'buy' },
                { level: 1, icon: '🎫', title: '每月优惠券', desc: '每月1张优惠券', bgColor: '#fff9e6', hasAction: false },
                { level: 2, icon: '⭐', title: '积分翻倍', desc: '消费积分双倍获取', bgColor: '#f5f5ff', hasAction: false },
                { level: 2, icon: '🎁', title: '生日礼包', desc: '生日当月专属礼包', bgColor: '#fff5ff', hasAction: true, actionType: 'birthday' },
                { level: 3, icon: '🎬', title: '首映抢先看', desc: '首映场次优先购票', bgColor: '#f0fff5', hasAction: true, actionType: 'premiere' },
                { level: 3, icon: '🎵', title: '演出票9折', desc: '演出票享受9折优惠', bgColor: '#fff5f5', hasAction: true, actionType: 'concert' },
                { level: 4, icon: '💺', title: '优先选座', desc: '黄金座位优先选择', bgColor: '#f0f8ff', hasAction: true, actionType: 'seats' },
                { level: 4, icon: '👨‍💼', title: '专属客服', desc: 'VIP专属客服通道', bgColor: '#fff5f0', hasAction: true, actionType: 'service' },
                { level: 5, icon: '🌟', title: '明星见面会', desc: '明星见面会优先参与', bgColor: '#e0ffff', hasAction: true, actionType: 'meeting' },
                { level: 5, icon: '🎟️', title: '免费观影券', desc: '每月赠送免费观影券', bgColor: '#fff9e6', hasAction: false }
            ],
            specialTickets: [
                {
                    id: 1,
                    name: '周杰伦「嘉年华」世界巡回演唱会',
                    category: 'concert',
                    date: '2026-05-20 19:30',
                    venue: '北京工人体育场',
                    originalPrice: 880,
                    discount: 0.85,
                    minLevel: 3,
                    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=jay%20chou%20concert%20stage%20poster%20blue%20lighting%20crowd&image_size=square_hd'
                },
                {
                    id: 2,
                    name: '林俊杰「圣所」世界巡回演唱会',
                    category: 'concert',
                    date: '2026-06-15 19:30',
                    venue: '上海梅赛德斯奔驰文化中心',
                    originalPrice: 680,
                    discount: 0.8,
                    minLevel: 4,
                    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=jj%20lin%20concert%20stage%20purple%20lighting%20live%20performance&image_size=square_hd'
                },
                {
                    id: 3,
                    name: '音乐剧《巴黎圣母院》中文版',
                    category: 'musical',
                    date: '2026-05-10 14:00',
                    venue: '北京天桥艺术中心',
                    originalPrice: 480,
                    discount: 0.9,
                    minLevel: 2,
                    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=notre%20dame%20de%20paris%20musical%20stage%20cathedral%20lighting%20dramatic&image_size=square_hd'
                },
                {
                    id: 4,
                    name: '开心麻花爆笑舞台剧《乌龙山伯爵》',
                    category: 'drama',
                    date: '2026-05-25 19:30',
                    venue: '广州友谊剧院',
                    originalPrice: 380,
                    discount: 0.85,
                    minLevel: 3,
                    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20comedy%20stage%20play%20funny%20actors%20colorful%20stage&image_size=square_hd'
                }
            ]
        };
    },
    computed: {
        currentLevel() {
            return this.vipLevels.find(l => l.level === this.userInfo.vipLevel) || this.vipLevels[0];
        },
        nextLevelPoints() {
            return this.currentLevel.nextLevelPoints - this.userInfo.vipPoints;
        },
        progressPercent() {
            return Math.min(100, (this.userInfo.vipPoints / this.currentLevel.nextLevelPoints) * 100);
        },
        couponStats() {
            const total = this.userCoupons.length;
            const claimed = this.userCoupons.filter(c => c.isClaimed).length;
            return { total, claimed };
        },
        currentBenefits() {
            return this.benefitsList.filter(b => b.level <= this.userInfo.vipLevel).slice(0, 6);
        },
        filteredTickets() {
            if (this.ticketFilter === 'all') {
                return this.specialTickets;
            }
            return this.specialTickets.filter(t => t.category === this.ticketFilter);
        },
        availableCoupons() {
            return this.myCoupons.filter(c => c.status === 'available');
        },
        usedCoupons() {
            return this.myCoupons.filter(c => c.status === 'used');
        },
        expiredCoupons() {
            return this.myCoupons.filter(c => c.status === 'expired');
        },
        displayCoupons() {
            switch (this.couponsTab) {
                case 'available': return this.availableCoupons;
                case 'used': return this.usedCoupons;
                case 'expired': return this.expiredCoupons;
                default: return this.availableCoupons;
            }
        }
    },
    methods: {
        getLevelInfo(level) {
            return this.vipLevels.find(l => l.level === level) || this.vipLevels[0];
        },
        getCouponColor(coupon) {
            if (coupon.isClaimed) {
                return 'linear-gradient(135deg, #cccccc 0%, #aaaaaa 100%)';
            }
            return 'linear-gradient(135deg, #E54847 0%, #ff6b6b 100%)';
        },
        getDiscountText(discount) {
            return Math.round((1 - discount) * 100) + '% OFF';
        },
        getVipPrice(ticket) {
            return Math.round(ticket.originalPrice * ticket.discount);
        },
        claimCoupon(coupon) {
            if (coupon.isClaimed) return;
            coupon.isClaimed = true;
            this.showToastMessage('恭喜！领取成功！优惠券已放入卡包');
            this.myCoupons.unshift({
                id: Date.now(),
                name: coupon.name,
                value: coupon.value,
                condition: coupon.condition,
                validity: coupon.validity,
                status: 'available'
            });
        },
        buyTicket(ticket) {
            if (this.userInfo.vipLevel >= ticket.minLevel) {
                this.showToastMessage('正在跳转到购票页面...');
            } else {
                this.showToastMessage('请升级会员解锁此优惠');
            }
        },
        handleBenefitAction(benefit) {
            switch (benefit.actionType) {
                case 'buy':
                    this.showToastMessage('正在跳转到购票页面...');
                    break;
                case 'birthday':
                    this.showToastMessage('生日礼包将在生日当月自动发放');
                    break;
                case 'premiere':
                    this.showToastMessage('暂无首映场次，敬请期待');
                    break;
                case 'concert':
                    this.activeTab = 'tickets';
                    break;
                case 'seats':
                    this.showToastMessage('购票时可优先选择黄金座位');
                    break;
                case 'service':
                    this.showToastMessage('正在连接专属客服...');
                    break;
                case 'meeting':
                    this.showToastMessage('明星见面会活动敬请关注');
                    break;
                default:
                    this.showToastMessage('功能开发中');
            }
        },
        useCoupon(coupon) {
            this.showToastMessage(`使用 ${coupon.name}，立减 ¥${coupon.value}`);
            coupon.status = 'used';
        },
        showToastMessage(message) {
            this.toastMessage = message;
            this.showToast = true;
            setTimeout(() => {
                this.showToast = false;
            }, 2500);
        },
        goToVipTickets() {
            this.$router.push({
                path: '/vip-tickets',
                name: 'vip-tickets'
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.vip-center {
    background-color: #f5f5f5;
    min-height: 100vh;
    padding-bottom: 20px;
}

.vip-header {
    background: linear-gradient(135deg, #E54847 0%, #ff6b6b 50%, #ffd700 100%);
    padding: 30px 20px;
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: -50%;
        right: -20%;
        width: 300px;
        height: 300px;
        background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
        border-radius: 50%;
    }
}

.vip-header-content {
    display: flex;
    align-items: center;
    position: relative;
    z-index: 1;
}

.vip-avatar {
    position: relative;
}

.avatar-img {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    border: 3px solid rgba(255,255,255,0.6);
    object-fit: cover;
}

.vip-badge {
    position: absolute;
    bottom: -5px;
    right: -5px;
    background: linear-gradient(135deg, #ffd700 0%, #ffaa00 100%);
    padding: 2px 8px;
    border-radius: 10px;
    border: 2px solid #fff;
}

.vip-level-badge {
    font-size: 10px;
    font-weight: bold;
    color: #8b4513;
}

.vip-user-info {
    margin-left: 16px;
    flex: 1;
}

.vip-username {
    color: #fff;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 6px;
    text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.vip-level-display {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
}

.level-icon {
    font-size: 18px;
}

.level-name {
    color: #fff;
    font-size: 14px;
    font-weight: 500;
}

.vip-expire {
    span {
        font-size: 12px;
        color: rgba(255,255,255,0.8);
    }
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.section-title {
    font-size: 17px;
    font-weight: bold;
    color: #333;
}

.more-link {
    font-size: 13px;
    color: #E54847;
    cursor: pointer;
}

.coupon-section {
    background: #fff;
    margin: -15px 15px 15px;
    border-radius: 12px;
    padding: 18px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    position: relative;
    z-index: 10;
}

.coupon-count {
    font-size: 13px;
    color: #E54847;
    font-weight: 500;
}

.coupon-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 12px;
}

.coupon-card {
    display: flex;
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    border: 1px solid #f0f0f0;
}

.coupon-left {
    padding: 15px 12px;
    min-width: 90px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;

    &::after {
        content: '';
        position: absolute;
        right: -6px;
        top: 50%;
        transform: translateY(-50%);
        width: 12px;
        height: 12px;
        background: #fff;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
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
    font-size: 28px;
    font-weight: bold;
    line-height: 1;
}

.coupon-condition {
    font-size: 11px;
    color: rgba(255,255,255,0.9);
    margin-top: 4px;
}

.coupon-right {
    flex: 1;
    padding: 12px 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.coupon-name {
    font-size: 14px;
    font-weight: bold;
    color: #333;
    margin-bottom: 4px;
}

.coupon-validity {
    font-size: 11px;
    color: #999;
}

.claim-btn {
    margin-top: 10px;
    padding: 7px 16px;
    background: linear-gradient(135deg, #E54847 0%, #ff6b6b 100%);
    border: none;
    border-radius: 15px;
    color: #fff;
    font-size: 12px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    align-self: flex-start;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(229, 72, 71, 0.3);
    }

    &.claimed {
        background: #e0e0e0;
        color: #999;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
    }
}

.quick-actions {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 15px;
    padding: 0 15px;
    margin-bottom: 15px;
}

.action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px 10px;
    background: #fff;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    }
}

.action-icon {
    font-size: 28px;
    margin-bottom: 8px;
}

.action-text {
    font-size: 12px;
    color: #333;
    font-weight: 500;
}

.progress-section {
    background: #fff;
    margin: 0 15px 15px;
    border-radius: 12px;
    padding: 18px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.progress-label {
    font-size: 15px;
    font-weight: bold;
    color: #333;
}

.progress-points {
    font-size: 13px;
    color: #E54847;
    font-weight: 500;
}

.progress-bar-wrapper {
    margin-bottom: 10px;
}

.progress-track {
    height: 8px;
    background: #f0f0f0;
    border-radius: 4px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #E54847 0%, #ffd700 100%);
    border-radius: 4px;
    transition: width 0.5s ease;
}

.progress-info {
    text-align: right;

    span {
        font-size: 12px;
        color: #999;
    }
}

.benefits-section {
    background: #fff;
    margin: 0 15px 15px;
    border-radius: 12px;
    padding: 18px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.benefits-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
}

.benefit-card {
    display: flex;
    align-items: center;
    padding: 12px;
    background: #fafafa;
    border-radius: 10px;
    transition: all 0.3s ease;

    &:hover {
        background: #f5f5f5;
        transform: translateY(-2px);
    }
}

.benefit-icon-wrapper {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    flex-shrink: 0;
}

.benefit-icon {
    font-size: 22px;
}

.benefit-info {
    flex: 1;
    min-width: 0;
}

.benefit-title {
    font-size: 14px;
    font-weight: bold;
    color: #333;
    margin-bottom: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.benefit-desc {
    font-size: 11px;
    color: #999;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.benefit-action {
    flex-shrink: 0;
    margin-left: 8px;
}

.go-btn {
    padding: 5px 12px;
    background: linear-gradient(135deg, #E54847 0%, #ff6b6b 100%);
    border: none;
    border-radius: 12px;
    color: #fff;
    font-size: 11px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        transform: scale(1.05);
    }
}

.unlock-tag {
    font-size: 11px;
    color: #4caf50;
    font-weight: 500;
}

.tickets-section {
    background: #fff;
    margin: 0 15px 15px;
    border-radius: 12px;
    padding: 18px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.ticket-filter {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
    flex-wrap: wrap;
}

.filter-item {
    padding: 6px 16px;
    background: #f5f5f5;
    border-radius: 15px;
    cursor: pointer;
    transition: all 0.3s ease;

    span {
        font-size: 13px;
        color: #666;
    }

    &.active {
        background: linear-gradient(135deg, #E54847 0%, #ff6b6b 100%);

        span {
            color: #fff;
            font-weight: 500;
        }
    }
}

.ticket-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 15px;
}

.ticket-card {
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    border: 1px solid #f0f0f0;
    display: flex;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 20px rgba(0,0,0,0.1);
    }
}

.ticket-image-wrapper {
    position: relative;
    width: 100px;
    flex-shrink: 0;
}

.ticket-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.ticket-discount {
    position: absolute;
    top: 8px;
    left: 8px;
}

.discount-badge {
    background: linear-gradient(135deg, #E54847 0%, #ff6b6b 100%);
    color: #fff;
    font-size: 10px;
    font-weight: bold;
    padding: 2px 6px;
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

.ticket-info {
    flex: 1;
    padding: 12px;
    display: flex;
    flex-direction: column;
}

.ticket-name {
    font-size: 14px;
    font-weight: bold;
    color: #333;
    margin-bottom: 4px;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.ticket-date,
.ticket-venue {
    font-size: 11px;
    color: #999;
    margin-bottom: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.ticket-price {
    margin-top: auto;
    margin-bottom: 8px;
    display: flex;
    align-items: baseline;
    gap: 8px;
}

.original-price {
    font-size: 11px;
    color: #999;
    text-decoration: line-through;
}

.vip-price {
    font-size: 13px;
    color: #E54847;
    font-weight: bold;

    .price-number {
        font-size: 18px;
    }
}

.buy-btn {
    width: 100%;
    padding: 8px;
    background: linear-gradient(135deg, #E54847 0%, #ff6b6b 100%);
    border: none;
    border-radius: 15px;
    color: #fff;
    font-size: 12px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(229, 72, 71, 0.3);
    }

    &.locked {
        background: #e0e0e0;
        color: #999;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
    }
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: flex-end;
    z-index: 1000;
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.modal-content {
    width: 100%;
    background: #fff;
    border-radius: 20px 20px 0 0;
    max-height: 80vh;
    overflow-y: auto;
    animation: slideUp 0.3s ease;
}

@keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 20px;
    border-bottom: 1px solid #f0f0f0;

    h3 {
        font-size: 17px;
        font-weight: bold;
        color: #333;
    }
}

.close-btn {
    font-size: 24px;
    color: #999;
    cursor: pointer;
    line-height: 1;

    &:hover {
        color: #666;
    }
}

.level-guide-list {
    padding: 15px 20px;
}

.guide-item {
    display: flex;
    align-items: center;
    padding: 15px 0;
    border-bottom: 1px solid #f5f5f5;
    opacity: 0.5;

    &:last-child {
        border-bottom: none;
    }

    &.active {
        opacity: 1;
    }
}

.guide-level-icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 15px;

    .active & {
        background: linear-gradient(135deg, #fff5f5 0%, #fff9e6 100%);
    }

    span {
        font-size: 26px;
    }
}

.guide-level-info {
    flex: 1;

    h4 {
        font-size: 15px;
        font-weight: bold;
        color: #333;
        margin-bottom: 4px;
    }

    p {
        font-size: 12px;
        color: #999;
        margin-bottom: 2px;
    }
}

.guide-status {
    .current-tag {
        background: linear-gradient(135deg, #E54847 0%, #ff6b6b 100%);
        color: #fff;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 500;
    }

    .unlocked-tag {
        background: #e8f5e9;
        color: #4caf50;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 500;
    }

    .locked-tag {
        background: #f5f5f5;
        color: #999;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 11px;
    }
}

.coupons-tabs {
    display: flex;
    border-bottom: 1px solid #f0f0f0;
}

.coupons-tab-item {
    flex: 1;
    text-align: center;
    padding: 15px 0;
    cursor: pointer;
    position: relative;

    span {
        font-size: 13px;
        color: #666;
    }

    &.active {
        span {
            color: #E54847;
            font-weight: bold;
        }

        &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 40%;
            height: 2px;
            background: #E54847;
            border-radius: 1px;
        }
    }
}

.coupons-list {
    padding: 15px 20px;
}

.my-coupon-card {
    display: flex;
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    margin-bottom: 12px;
    border: 1px solid #f0f0f0;

    &.used, &.expired {
        opacity: 0.6;
    }
}

.my-coupon-left {
    padding: 15px 12px;
    min-width: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #E54847 0%, #ff6b6b 100%);
    position: relative;

    .used &, .expired & {
        background: #e0e0e0;
    }

    &::after {
        content: '';
        position: absolute;
        right: -6px;
        top: 50%;
        transform: translateY(-50%);
        width: 12px;
        height: 12px;
        background: #fff;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
}

.my-coupon-value {
    display: flex;
    align-items: baseline;
    color: #fff;

    .used &, .expired & {
        color: #999;
    }
}

.my-currency {
    font-size: 12px;
    font-weight: 500;
}

.my-value {
    font-size: 24px;
    font-weight: bold;
    line-height: 1;
}

.my-coupon-condition {
    font-size: 10px;
    color: rgba(255,255,255,0.9);
    margin-top: 4px;

    .used &, .expired & {
        color: #bbb;
    }
}

.my-coupon-right {
    flex: 1;
    padding: 12px 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.my-coupon-name {
    font-size: 14px;
    font-weight: bold;
    color: #333;
    margin-bottom: 4px;
}

.my-coupon-validity {
    font-size: 11px;
    color: #999;
}

.use-btn {
    margin-top: 10px;
    padding: 7px 16px;
    background: linear-gradient(135deg, #E54847 0%, #ff6b6b 100%);
    border: none;
    border-radius: 15px;
    color: #fff;
    font-size: 12px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    align-self: flex-start;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(229, 72, 71, 0.3);
    }
}

.status-tag {
    margin-top: 10px;
    font-size: 12px;
    color: #999;
    align-self: flex-start;
}

.no-coupons {
    text-align: center;
    padding: 40px 0;

    span {
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
    .coupon-grid {
        grid-template-columns: 1fr;
    }

    .ticket-grid {
        grid-template-columns: 1fr;
    }

    .quick-actions {
        gap: 10px;
    }

    .action-icon {
        font-size: 24px;
    }

    .action-text {
        font-size: 11px;
    }
}
</style>
