<template>
    <div class="vip-center">
        <div class="vip-header">
            <div class="vip-header-content">
                <div class="vip-badge-large">
                    <span class="vip-icon-large">VIP</span>
                </div>
                <div class="vip-user-info">
                    <h2 class="vip-username">{{userInfo.nickname}}</h2>
                    <div class="current-level">
                        <span class="level-name">{{getLevelInfo(userInfo.vipLevel).name}}</span>
                        <span class="level-icon-wrapper">
                            <span class="level-icon">{{getLevelInfo(userInfo.vipLevel).icon}}</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div class="vip-progress-card">
            <div class="progress-header">
                <span class="progress-title">成长进度</span>
                <span class="progress-points">成长值: {{userInfo.vipPoints}}/{{getLevelInfo(userInfo.vipLevel).nextLevelPoints}}</span>
            </div>
            <div class="progress-bar-wrapper">
                <div class="progress-track">
                    <div class="progress-fill" :style="{width: (userInfo.vipPoints / getLevelInfo(userInfo.vipLevel).nextLevelPoints * 100) + '%'}"></div>
                </div>
            </div>
            <div class="level-milestones">
                <div class="milestone" v-for="(level, index) in vipLevels" :key="level.level" :class="{'active': userInfo.vipLevel >= level.level, 'current': userInfo.vipLevel === level.level}">
                    <div class="milestone-dot"></div>
                    <span class="milestone-name">{{level.shortName}}</span>
                </div>
            </div>
        </div>

        <div class="vip-tabs">
            <div class="tab-item" :class="{'active': activeTab === 'levels'}" @click="activeTab = 'levels'">
                <span>会员等级</span>
            </div>
            <div class="tab-item" :class="{'active': activeTab === 'benefits'}" @click="activeTab = 'benefits'">
                <span>专属福利</span>
            </div>
            <div class="tab-item" :class="{'active': activeTab === 'tickets'}" @click="activeTab = 'tickets'">
                <span>演出票特价</span>
            </div>
        </div>

        <div class="tab-content" v-show="activeTab === 'levels'">
            <div class="level-section-header">
                <h3>5大等级体系</h3>
                <p>等级越高，福利越多</p>
            </div>

            <div class="level-card" v-for="(level, index) in vipLevels" :key="level.level" :class="{'current': userInfo.vipLevel === level.level, 'unlocked': userInfo.vipLevel >= level.level}">
                <div class="level-card-header" :style="{'background': level.gradient}">
                    <div class="level-badge">
                        <span class="level-icon-large">{{level.icon}}</span>
                        <span class="level-name-large">{{level.name}}</span>
                    </div>
                    <div class="level-status" v-if="userInfo.vipLevel === level.level">
                        <span class="status-text">当前等级</span>
                    </div>
                    <div class="level-status" v-else-if="userInfo.vipLevel > level.level">
                        <span class="status-text unlocked">已解锁</span>
                    </div>
                </div>
                
                <div class="level-card-body">
                    <div class="coupon-info">
                        <div class="coupon-icon">🎫</div>
                        <div class="coupon-text">
                            <span class="coupon-count">{{level.couponsPerMonth}}</span>
                            <span class="coupon-unit">张/月</span>
                        </div>
                        <span class="coupon-label">优惠券</span>
                    </div>

                    <div class="level-benefits">
                        <h4>等级特权</h4>
                        <div class="benefit-grid">
                            <div class="benefit-item" v-for="(benefit, idx) in level.benefits" :key="idx">
                                <span class="benefit-icon">{{benefit.icon}}</span>
                                <span class="benefit-text">{{benefit.text}}</span>
                            </div>
                        </div>
                    </div>

                    <div class="level-requirement">
                        <span class="requirement-label">升级要求:</span>
                        <span class="requirement-points">{{level.minPoints}} 成长值</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="tab-content" v-show="activeTab === 'benefits'">
            <div class="benefits-section-header">
                <h3>更多会员福利</h3>
                <p>专属特权，尽享优惠</p>
            </div>

            <div class="benefits-cards">
                <div class="benefit-card">
                    <div class="benefit-card-header">
                        <span class="benefit-card-icon">🎬</span>
                        <h4>观影特权</h4>
                    </div>
                    <div class="benefit-card-body">
                        <div class="benefit-row" v-for="(item, idx) in movieBenefits" :key="idx">
                            <span class="benefit-row-icon">{{item.icon}}</span>
                            <span class="benefit-row-text">{{item.text}}</span>
                            <span class="benefit-row-level" :class="'level-' + item.level">{{getLevelInfo(item.level).shortName}}+</span>
                        </div>
                    </div>
                </div>

                <div class="benefit-card">
                    <div class="benefit-card-header">
                        <span class="benefit-card-icon">🎵</span>
                        <h4>演出特权</h4>
                    </div>
                    <div class="benefit-card-body">
                        <div class="benefit-row" v-for="(item, idx) in concertBenefits" :key="idx">
                            <span class="benefit-row-icon">{{item.icon}}</span>
                            <span class="benefit-row-text">{{item.text}}</span>
                            <span class="benefit-row-level" :class="'level-' + item.level">{{getLevelInfo(item.level).shortName}}+</span>
                        </div>
                    </div>
                </div>

                <div class="benefit-card">
                    <div class="benefit-card-header">
                        <span class="benefit-card-icon">🎁</span>
                        <h4>生日特权</h4>
                    </div>
                    <div class="benefit-card-body">
                        <div class="benefit-row" v-for="(item, idx) in birthdayBenefits" :key="idx">
                            <span class="benefit-row-icon">{{item.icon}}</span>
                            <span class="benefit-row-text">{{item.text}}</span>
                            <span class="benefit-row-level" :class="'level-' + item.level">{{getLevelInfo(item.level).shortName}}+</span>
                        </div>
                    </div>
                </div>

                <div class="benefit-card">
                    <div class="benefit-card-header">
                        <span class="benefit-card-icon">⭐</span>
                        <h4>专属服务</h4>
                    </div>
                    <div class="benefit-card-body">
                        <div class="benefit-row" v-for="(item, idx) in exclusiveBenefits" :key="idx">
                            <span class="benefit-row-icon">{{item.icon}}</span>
                            <span class="benefit-row-text">{{item.text}}</span>
                            <span class="benefit-row-level" :class="'level-' + item.level">{{getLevelInfo(item.level).shortName}}+</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="tab-content" v-show="activeTab === 'tickets'">
            <div class="tickets-section-header">
                <h3>会员演出票特价</h3>
                <p>热门演出，会员专享优惠</p>
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

            <div class="ticket-list">
                <div class="ticket-card" v-for="(ticket, index) in filteredTickets" :key="ticket.id">
                    <div class="ticket-image-wrapper">
                        <img :src="ticket.image" :alt="ticket.name" class="ticket-image">
                        <div class="ticket-discount">
                            <span class="discount-badge">{{getDiscountText(ticket.discount)}}</span>
                        </div>
                        <div class="ticket-level">
                            <span class="level-badge-small">{{getLevelInfo(ticket.minLevel).shortName}}+</span>
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
                        <div class="ticket-action">
                            <button class="buy-btn" @click="buyTicket(ticket)" :disabled="userInfo.vipLevel < ticket.minLevel">
                                <span v-if="userInfo.vipLevel >= ticket.minLevel">立即购票</span>
                                <span v-else>升级会员解锁</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
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
            activeTab: 'levels',
            ticketFilter: 'all',
            userInfo: {
                nickname: '电影爱好者',
                vipLevel: 3,
                vipPoints: 2580
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
                    gradient: 'linear-gradient(135deg, #cd7f32 0%, #b8860b 100%)',
                    benefits: [
                        { icon: '💸', text: '购票9.5折' },
                        { icon: '🎫', text: '每月1张优惠券' },
                        { icon: '📅', text: '生日优惠券' }
                    ]
                },
                {
                    level: 2,
                    name: '白银会员',
                    shortName: '白银',
                    icon: '🥈',
                    minPoints: 500,
                    nextLevelPoints: 1500,
                    couponsPerMonth: 2,
                    gradient: 'linear-gradient(135deg, #c0c0c0 0%, #a9a9a9 100%)',
                    benefits: [
                        { icon: '💸', text: '购票9折' },
                        { icon: '🎫', text: '每月2张优惠券' },
                        { icon: '📅', text: '生日大礼包' },
                        { icon: '⭐', text: '积分翻倍' }
                    ]
                },
                {
                    level: 3,
                    name: '黄金会员',
                    shortName: '黄金',
                    icon: '🥇',
                    minPoints: 1500,
                    nextLevelPoints: 3500,
                    couponsPerMonth: 3,
                    gradient: 'linear-gradient(135deg, #ffd700 0%, #ffaa00 100%)',
                    benefits: [
                        { icon: '💸', text: '购票8.5折' },
                        { icon: '🎫', text: '每月3张优惠券' },
                        { icon: '📅', text: '生日豪华礼包' },
                        { icon: '⭐', text: '积分2倍' },
                        { icon: '🎬', text: '首映抢先看' },
                        { icon: '🎵', text: '演出票9折' }
                    ]
                },
                {
                    level: 4,
                    name: '铂金会员',
                    shortName: '铂金',
                    icon: '💎',
                    minPoints: 3500,
                    nextLevelPoints: 6000,
                    couponsPerMonth: 4,
                    gradient: 'linear-gradient(135deg, #e5e4e2 0%, #c9c0bb 100%)',
                    benefits: [
                        { icon: '💸', text: '购票8折' },
                        { icon: '🎫', text: '每月4张优惠券' },
                        { icon: '📅', text: '生日至尊礼包' },
                        { icon: '⭐', text: '积分3倍' },
                        { icon: '🎬', text: '首映优先选座' },
                        { icon: '🎵', text: '演出票8.5折' },
                        { icon: '🎁', text: '节日专属礼包' },
                        { icon: '👑', text: '专属客服' }
                    ]
                },
                {
                    level: 5,
                    name: '钻石会员',
                    shortName: '钻石',
                    icon: '👑',
                    minPoints: 6000,
                    nextLevelPoints: 99999,
                    couponsPerMonth: 5,
                    gradient: 'linear-gradient(135deg, #b9f2ff 0%, #7df9ff 100%)',
                    benefits: [
                        { icon: '💸', text: '购票7.5折' },
                        { icon: '🎫', text: '每月5张优惠券' },
                        { icon: '📅', text: '生日钻石礼包' },
                        { icon: '⭐', text: '积分5倍' },
                        { icon: '🎬', text: '首映VIP座' },
                        { icon: '🎵', text: '演出票8折' },
                        { icon: '🎁', text: '节日豪华礼包' },
                        { icon: '👑', text: 'VIP专属客服' },
                        { icon: '🌟', text: '明星见面会优先' },
                        { icon: '🎟️', text: '免费观影券' }
                    ]
                }
            ],
            movieBenefits: [
                { icon: '💸', text: '购票享受折扣', level: 1 },
                { icon: '🎟️', text: '每月赠送优惠券', level: 1 },
                { icon: '🎬', text: '首映场次抢先看', level: 3 },
                { icon: '💺', text: '优先选座权', level: 4 },
                { icon: '🎁', text: '会员专属周边', level: 5 }
            ],
            concertBenefits: [
                { icon: '💸', text: '演出票专属折扣', level: 3 },
                { icon: '🎫', text: '演唱会优先购票', level: 4 },
                { icon: '💺', text: '演唱会VIP座优先', level: 5 },
                { icon: '🎤', text: '明星见面会资格', level: 5 }
            ],
            birthdayBenefits: [
                { icon: '🎂', text: '生日当月优惠券', level: 1 },
                { icon: '🎁', text: '生日专属礼包', level: 2 },
                { icon: '🍰', text: '生日免费观影券', level: 4 },
                { icon: '🎉', text: '生日双倍积分', level: 3 }
            ],
            exclusiveBenefits: [
                { icon: '⭐', text: '消费积分翻倍', level: 2 },
                { icon: '👨‍💼', text: '专属客服通道', level: 4 },
                { icon: '🎁', text: '节日专属礼品', level: 4 },
                { icon: '🌟', text: '限量活动优先参与', level: 5 }
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
                },
                {
                    id: 5,
                    name: '五月天「人生无限公司」演唱会',
                    category: 'concert',
                    date: '2026-07-01 19:00',
                    venue: '深圳大运中心体育场',
                    originalPrice: 980,
                    discount: 0.75,
                    minLevel: 5,
                    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mayday%20concert%20stage%20rock%20band%20colorful%20lighting%20crowd&image_size=square_hd'
                },
                {
                    id: 6,
                    name: '音乐剧《猫》中文版',
                    category: 'musical',
                    date: '2026-06-20 19:30',
                    venue: '上海文化广场',
                    originalPrice: 580,
                    discount: 0.8,
                    minLevel: 4,
                    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cats%20musical%20stage%20jellicle%20cats%20moonlight%20costumes&image_size=square_hd'
                }
            ]
        };
    },
    computed: {
        filteredTickets() {
            if (this.ticketFilter === 'all') {
                return this.specialTickets;
            }
            return this.specialTickets.filter(t => t.category === this.ticketFilter);
        }
    },
    methods: {
        getLevelInfo(level) {
            return this.vipLevels.find(l => l.level === level) || this.vipLevels[0];
        },
        getDiscountText(discount) {
            return Math.round((1 - discount) * 100) + '% OFF';
        },
        getVipPrice(ticket) {
            return Math.round(ticket.originalPrice * ticket.discount);
        },
        buyTicket(ticket) {
            if (this.userInfo.vipLevel >= ticket.minLevel) {
                this.$toast('正在跳转到购票页面...');
            } else {
                this.$toast('请升级会员解锁此优惠');
            }
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
        background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
        border-radius: 50%;
    }
}

.vip-header-content {
    display: flex;
    align-items: center;
    position: relative;
    z-index: 1;
}

.vip-badge-large {
    width: 70px;
    height: 70px;
    background: linear-gradient(135deg, #ffd700 0%, #ffaa00 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px solid rgba(255,255,255,0.5);
    box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
}

.vip-icon-large {
    color: #8b4513;
    font-weight: bold;
    font-size: 18px;
}

.vip-user-info {
    margin-left: 20px;
}

.vip-username {
    color: #fff;
    font-size: 20px;
    margin-bottom: 8px;
    text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.current-level {
    display: flex;
    align-items: center;
    gap: 8px;
}

.level-name {
    color: #fff;
    font-size: 14px;
    background: rgba(255,255,255,0.2);
    padding: 4px 12px;
    border-radius: 12px;
}

.level-icon-wrapper {
    width: 28px;
    height: 28px;
    background: rgba(255,255,255,0.3);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.level-icon {
    font-size: 16px;
}

.vip-progress-card {
    background: #fff;
    margin: -20px 15px 15px;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    position: relative;
    z-index: 10;
}

.progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.progress-title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
}

.progress-points {
    font-size: 13px;
    color: #666;
}

.progress-bar-wrapper {
    margin-bottom: 20px;
}

.progress-track {
    height: 10px;
    background: #f0f0f0;
    border-radius: 5px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #E54847 0%, #ffd700 100%);
    border-radius: 5px;
    transition: width 0.5s ease;
}

.level-milestones {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 5px;
}

.milestone {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;

    &::before {
        content: '';
        position: absolute;
        top: 6px;
        left: 50%;
        right: -100%;
        height: 2px;
        background: #e0e0e0;
        z-index: 0;
    }

    &:last-child::before {
        display: none;
    }

    &.active::before {
        background: linear-gradient(90deg, #E54847 0%, #ffd700 100%);
    }
}

.milestone-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #e0e0e0;
    border: 2px solid #fff;
    position: relative;
    z-index: 1;
    margin-bottom: 6px;

    .milestone.active & {
        background: #E54847;
        box-shadow: 0 0 6px rgba(229, 72, 71, 0.4);
    }

    .milestone.current & {
        background: #ffd700;
        transform: scale(1.2);
        box-shadow: 0 0 8px rgba(255, 215, 0, 0.5);
    }
}

.milestone-name {
    font-size: 11px;
    color: #999;

    .milestone.active & {
        color: #E54847;
    }

    .milestone.current & {
        color: #ffaa00;
        font-weight: bold;
    }
}

.vip-tabs {
    display: flex;
    background: #fff;
    margin: 0 15px 15px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.tab-item {
    flex: 1;
    text-align: center;
    padding: 14px 0;
    cursor: pointer;
    position: relative;

    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 2px;
        background: linear-gradient(90deg, #E54847 0%, #ffd700 100%);
        transition: width 0.3s ease;
    }

    span {
        font-size: 14px;
        color: #666;
        transition: color 0.3s ease;
    }

    &.active {
        span {
            color: #E54847;
            font-weight: bold;
        }

        &::after {
            width: 50%;
        }
    }
}

.tab-content {
    padding: 0 15px;
}

.level-section-header,
.benefits-section-header,
.tickets-section-header {
    text-align: center;
    margin-bottom: 20px;

    h3 {
        font-size: 18px;
        color: #333;
        margin-bottom: 5px;
    }

    p {
        font-size: 13px;
        color: #999;
    }
}

.level-card {
    background: #fff;
    border-radius: 12px;
    margin-bottom: 15px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &.current {
        transform: scale(1.02);
        box-shadow: 0 4px 20px rgba(229, 72, 71, 0.15);
        border: 2px solid transparent;
        background-image: linear-gradient(#fff, #fff), linear-gradient(135deg, #E54847, #ffd700);
        background-origin: border-box;
        background-clip: padding-box, border-box;
    }

    &.unlocked {
        opacity: 1;
    }

    &:not(.unlocked) {
        opacity: 0.7;
    }
}

.level-card-header {
    padding: 18px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.level-badge {
    display: flex;
    align-items: center;
    gap: 12px;
}

.level-icon-large {
    font-size: 32px;
}

.level-name-large {
    font-size: 18px;
    font-weight: bold;
    color: #fff;
    text-shadow: 0 1px 2px rgba(0,0,0,0.2);
}

.level-status {
    .status-text {
        background: rgba(255,255,255,0.3);
        color: #fff;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: bold;

        &.unlocked {
            background: rgba(76, 175, 80, 0.9);
        }
    }
}

.level-card-body {
    padding: 20px;
}

.coupon-info {
    display: flex;
    align-items: center;
    background: linear-gradient(135deg, #fff5f5 0%, #fff9e6 100%);
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 20px;
}

.coupon-icon {
    font-size: 28px;
    margin-right: 12px;
}

.coupon-text {
    display: flex;
    align-items: baseline;
    gap: 4px;
}

.coupon-count {
    font-size: 28px;
    font-weight: bold;
    color: #E54847;
}

.coupon-unit {
    font-size: 13px;
    color: #666;
}

.coupon-label {
    margin-left: auto;
    background: #E54847;
    color: #fff;
    padding: 4px 10px;
    border-radius: 10px;
    font-size: 12px;
}

.level-benefits {
    h4 {
        font-size: 15px;
        color: #333;
        margin-bottom: 12px;
        font-weight: bold;
    }
}

.benefit-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
}

.benefit-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px;
    background: #f9f9f9;
    border-radius: 8px;

    .benefit-icon {
        font-size: 18px;
    }

    .benefit-text {
        font-size: 13px;
        color: #333;
    }
}

.level-requirement {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px dashed #e0e0e0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;

    .requirement-label {
        font-size: 12px;
        color: #999;
    }

    .requirement-points {
        font-size: 14px;
        font-weight: bold;
        color: #E54847;
    }
}

.benefits-cards {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.benefit-card {
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.benefit-card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 15px 20px;
    background: linear-gradient(135deg, #fff5f5 0%, #fff9e6 100%);

    .benefit-card-icon {
        font-size: 24px;
    }

    h4 {
        font-size: 16px;
        color: #333;
        font-weight: bold;
    }
}

.benefit-card-body {
    padding: 15px 20px;
}

.benefit-row {
    display: flex;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f5f5f5;

    &:last-child {
        border-bottom: none;
    }

    .benefit-row-icon {
        font-size: 18px;
        margin-right: 12px;
    }

    .benefit-row-text {
        flex: 1;
        font-size: 14px;
        color: #333;
    }

    .benefit-row-level {
        font-size: 11px;
        padding: 4px 10px;
        border-radius: 10px;
        font-weight: bold;

        &.level-1 {
            background: #fff5f5;
            color: #cd7f32;
        }

        &.level-2 {
            background: #f5f5f5;
            color: #a9a9a9;
        }

        &.level-3 {
            background: #fff9e6;
            color: #d4a017;
        }

        &.level-4 {
            background: #f0f8ff;
            color: #4682b4;
        }

        &.level-5 {
            background: #e0ffff;
            color: #20b2aa;
        }
    }
}

.ticket-filter {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    flex-wrap: wrap;
}

.filter-item {
    padding: 8px 18px;
    background: #fff;
    border-radius: 20px;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0,0,0,0.05);
    transition: all 0.3s ease;

    span {
        font-size: 13px;
        color: #666;
        transition: color 0.3s ease;
    }

    &.active {
        background: linear-gradient(135deg, #E54847 0%, #ff6b6b 100%);

        span {
            color: #fff;
            font-weight: bold;
        }
    }
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
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    display: flex;
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

.ticket-discount {
    position: absolute;
    top: 8px;
    left: 8px;

    .discount-badge {
        background: linear-gradient(135deg, #E54847 0%, #ff6b6b 100%);
        color: #fff;
        font-size: 11px;
        font-weight: bold;
        padding: 3px 8px;
        border-radius: 8px;
    }
}

.ticket-level {
    position: absolute;
    top: 8px;
    right: 8px;

    .level-badge-small {
        background: rgba(0,0,0,0.6);
        color: #fff;
        font-size: 10px;
        padding: 3px 8px;
        border-radius: 8px;
    }
}

.ticket-info {
    flex: 1;
    padding: 15px;
    display: flex;
    flex-direction: column;
}

.ticket-name {
    font-size: 15px;
    color: #333;
    font-weight: bold;
    margin-bottom: 8px;
    line-height: 1.3;
}

.ticket-date,
.ticket-venue {
    font-size: 12px;
    color: #999;
    margin-bottom: 4px;
}

.ticket-price {
    margin-top: auto;
    margin-bottom: 10px;
    display: flex;
    align-items: baseline;
    gap: 10px;

    .original-price {
        font-size: 12px;
        color: #999;
        text-decoration: line-through;
    }

    .vip-price {
        font-size: 14px;
        color: #E54847;
        font-weight: bold;

        .price-number {
            font-size: 20px;
        }
    }
}

.ticket-action {
    .buy-btn {
        width: 100%;
        padding: 10px;
        background: linear-gradient(135deg, #E54847 0%, #ff6b6b 100%);
        border: none;
        border-radius: 20px;
        color: #fff;
        font-size: 13px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(229, 72, 71, 0.3);
        }

        &:disabled {
            background: #ddd;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }
    }
}
</style>
