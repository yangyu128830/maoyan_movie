<template>
    <div class="user-center">
        <div class="user-header">
            <div class="avatar-section">
                <div class="avatar-wrapper">
                    <img :src="userInfo.avatar" alt="头像" class="avatar" @click="showAvatarPicker = true">
                    <div class="avatar-edit-icon" @click="showAvatarPicker = true">
                        <span>编辑</span>
                    </div>
                </div>
                <div class="user-basic">
                    <h2 class="username">{{userInfo.nickname}}</h2>
                    <div class="vip-badge" v-if="userInfo.isVip">
                        <span class="vip-icon">VIP</span>
                        <span class="vip-level">Lv.{{userInfo.vipLevel}}</span>
                    </div>
                    <div class="no-vip-badge" v-else>
                        <span>普通用户</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="user-info-card" v-if="!isEditing">
            <div class="card-header">
                <h3>个人信息</h3>
                <button class="edit-btn" @click="editUserInfo">编辑</button>
            </div>
            <div class="info-list">
                <div class="info-item">
                    <span class="info-label">用户名</span>
                    <span class="info-value">{{userInfo.nickname}}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">性别</span>
                    <span class="info-value">{{userInfo.gender}}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">生日</span>
                    <span class="info-value">{{userInfo.birthday}}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">手机号</span>
                    <span class="info-value">{{userInfo.phone}}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">邮箱</span>
                    <span class="info-value">{{userInfo.email}}</span>
                </div>
            </div>
        </div>

        <div class="user-info-card" v-else>
            <div class="card-header">
                <h3>编辑个人信息</h3>
                <button class="save-btn" @click="saveUserInfo">保存</button>
            </div>
            <div class="info-list">
                <div class="info-item edit-mode">
                    <span class="info-label">用户名</span>
                    <input type="text" v-model="editForm.nickname" class="info-input">
                </div>
                <div class="info-item edit-mode">
                    <span class="info-label">性别</span>
                    <select v-model="editForm.gender" class="info-select">
                        <option value="男">男</option>
                        <option value="女">女</option>
                        <option value="保密">保密</option>
                    </select>
                </div>
                <div class="info-item edit-mode">
                    <span class="info-label">生日</span>
                    <input type="date" v-model="editForm.birthday" class="info-input">
                </div>
                <div class="info-item edit-mode">
                    <span class="info-label">手机号</span>
                    <input type="tel" v-model="editForm.phone" class="info-input">
                </div>
                <div class="info-item edit-mode">
                    <span class="info-label">邮箱</span>
                    <input type="email" v-model="editForm.email" class="info-input">
                </div>
            </div>
        </div>

        <div class="vip-info-card" v-if="userInfo.isVip">
            <div class="card-header">
                <h3>会员信息</h3>
                <span class="vip-status">会员中</span>
            </div>
            <div class="vip-detail">
                <div class="vip-level-display">
                    <div class="level-icon">
                        <span>VIP</span>
                    </div>
                    <div class="level-info">
                        <h4>钻石会员 Lv.{{userInfo.vipLevel}}</h4>
                        <p>有效期至：{{userInfo.vipExpireDate}}</p>
                    </div>
                </div>
                <div class="vip-progress">
                    <div class="progress-label">
                        <span>成长值：{{userInfo.vipPoints}}/{{userInfo.vipNextLevelPoints}}</span>
                        <span>距离下一等级还需{{userInfo.vipNextLevelPoints - userInfo.vipPoints}}成长值</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" :style="{width: (userInfo.vipPoints / userInfo.vipNextLevelPoints * 100) + '%'}"></div>
                    </div>
                </div>
                <div class="vip-privileges">
                    <h5>会员特权</h5>
                    <div class="privilege-list">
                        <div class="privilege-item">
                            <span class="privilege-icon">🎬</span>
                            <span>购票8折</span>
                        </div>
                        <div class="privilege-item">
                            <span class="privilege-icon">🎁</span>
                            <span>生日礼包</span>
                        </div>
                        <div class="privilege-item">
                            <span class="privilege-icon">🎟️</span>
                            <span>专属优惠券</span>
                        </div>
                        <div class="privilege-item">
                            <span class="privilege-icon">⭐</span>
                            <span>首映抢先看</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="no-vip-card" v-else>
            <div class="no-vip-content">
                <div class="no-vip-icon">
                    <span>🎬</span>
                </div>
                <h3>开通会员，享受更多特权</h3>
                <p>购票8折、生日礼包、专属优惠券等超多特权等你来拿</p>
                <button class="open-vip-btn">立即开通会员</button>
            </div>
        </div>

        <div class="balance-card">
            <div class="card-header">
                <h3>我的余额</h3>
                <span class="recharge-btn" @click="showRechargeModal = true">充值</span>
            </div>
            <div class="balance-info">
                <div class="balance-amount">
                    <span class="balance-label">账户余额</span>
                    <span class="balance-value">¥{{balanceInfo.balance}}</span>
                </div>
                <div class="balance-stats">
                    <div class="stat-item">
                        <span class="stat-label">累计收入</span>
                        <span class="stat-value income">+¥{{balanceInfo.totalIncome}}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">累计支出</span>
                        <span class="stat-value expense">-¥{{balanceInfo.totalExpense}}</span>
                    </div>
                </div>
            </div>
            <div class="balance-records">
                <div class="records-header">
                    <h4>余额明细</h4>
                    <div class="record-tabs">
                        <span class="tab-item" :class="{'active': balanceRecordType === 'all'}" @click="balanceRecordType = 'all'">全部</span>
                        <span class="tab-item" :class="{'active': balanceRecordType === 'income'}" @click="balanceRecordType = 'income'">收入</span>
                        <span class="tab-item" :class="{'active': balanceRecordType === 'expense'}" @click="balanceRecordType = 'expense'">支出</span>
                    </div>
                </div>
                <div class="record-list" v-if="filteredBalanceRecords.length > 0">
                    <div class="balance-record-item" v-for="(record, index) in filteredBalanceRecords" :key="index">
                        <div class="record-icon" :class="record.type">
                            <span>{{record.icon}}</span>
                        </div>
                        <div class="record-info">
                            <h4 class="record-title">{{record.title}}</h4>
                            <p class="record-desc">{{record.description}}</p>
                            <p class="record-time">{{record.time}}</p>
                        </div>
                        <div class="record-amount" :class="record.type">
                            <span>{{record.type === 'income' ? '+' : '-'}}¥{{record.amount}}</span>
                        </div>
                    </div>
                </div>
                <div class="no-record" v-else>
                    <p>暂无余额明细</p>
                </div>
            </div>
        </div>

        <div class="points-card">
            <div class="card-header">
                <h3>消费积分</h3>
                <span class="exchange-btn" @click="showExchangeModal = true">去兑换</span>
            </div>
            <div class="points-info">
                <div class="points-amount">
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
            </div>
            <div class="points-records">
                <div class="records-header">
                    <h4>积分明细</h4>
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
        </div>

        <div class="recharge-modal" v-if="showRechargeModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>余额充值</h3>
                    <span class="close-btn" @click="showRechargeModal = false">×</span>
                </div>
                <div class="recharge-options">
                    <div class="recharge-option" :class="{'selected': selectedRechargeAmount === 50}" @click="selectedRechargeAmount = 50">
                        <span class="amount">¥50</span>
                        <span class="bonus" v-if="userInfo.isVip">VIP额外+5积分</span>
                    </div>
                    <div class="recharge-option" :class="{'selected': selectedRechargeAmount === 100}" @click="selectedRechargeAmount = 100">
                        <span class="amount">¥100</span>
                        <span class="bonus" v-if="userInfo.isVip">VIP额外+10积分</span>
                    </div>
                    <div class="recharge-option" :class="{'selected': selectedRechargeAmount === 200}" @click="selectedRechargeAmount = 200">
                        <span class="amount">¥200</span>
                        <span class="bonus" v-if="userInfo.isVip">VIP额外+20积分</span>
                    </div>
                    <div class="recharge-option" :class="{'selected': selectedRechargeAmount === 500}" @click="selectedRechargeAmount = 500">
                        <span class="amount">¥500</span>
                        <span class="bonus" v-if="userInfo.isVip">VIP额外+50积分</span>
                    </div>
                </div>
                <div class="custom-amount">
                    <span class="label">自定义金额</span>
                    <input type="number" v-model="customRechargeAmount" placeholder="请输入金额" min="1" @input="selectedRechargeAmount = null">
                </div>
                <div class="payment-methods">
                    <h4>选择支付方式</h4>
                    <div class="method-list">
                        <div class="method-item" :class="{'selected': paymentMethod === 'alipay'}" @click="paymentMethod = 'alipay'">
                            <span class="method-icon">💳</span>
                            <span class="method-name">支付宝</span>
                        </div>
                        <div class="method-item" :class="{'selected': paymentMethod === 'wechat'}" @click="paymentMethod = 'wechat'">
                            <span class="method-icon">💚</span>
                            <span class="method-name">微信支付</span>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="cancel-btn" @click="showRechargeModal = false">取消</button>
                    <button class="confirm-btn" @click="handleRecharge">立即充值 ¥{{rechargeAmount}}</button>
                </div>
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

        <div class="avatar-picker-modal" v-if="showAvatarPicker">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>选择头像</h3>
                    <span class="close-btn" @click="showAvatarPicker = false">×</span>
                </div>
                <div class="avatar-options">
                    <div class="avatar-option" v-for="(avatar, index) in avatarOptions" :key="index" @click="selectAvatar(avatar)">
                        <img :src="avatar" alt="" :class="{'selected': selectedAvatar === avatar}">
                    </div>
                </div>
                <div class="upload-option">
                    <label class="upload-label">
                        <input type="file" accept="image/*" @change="handleFileUpload" style="display: none">
                        <span class="upload-icon">+</span>
                        <span>上传自定义头像</span>
                    </label>
                </div>
                <div class="modal-footer">
                    <button class="cancel-btn" @click="showAvatarPicker = false">取消</button>
                    <button class="confirm-btn" @click="confirmAvatar">确认</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'User',
    created() {
        this.$store.commit('changeHt', '个人中心');
    },
    data() {
        return {
            isEditing: false,
            showAvatarPicker: false,
            selectedAvatar: '',
            userInfo: {
                avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cat%20avatar%20cartoon%20style%20round%20icon&image_size=square_hd',
                nickname: '电影爱好者',
                gender: '男',
                birthday: '1995-06-15',
                phone: '138****8888',
                email: 'movie@example.com',
                isVip: true,
                vipLevel: 5,
                vipPoints: 3580,
                vipNextLevelPoints: 5000,
                vipExpireDate: '2027-12-31'
            },
            editForm: {
                nickname: '',
                gender: '',
                birthday: '',
                phone: '',
                email: ''
            },
            avatarOptions: [
                'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cat%20avatar%20cartoon%20style%20round%20icon&image_size=square_hd',
                'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20dog%20avatar%20cartoon%20style%20round%20icon&image_size=square_hd',
                'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=panda%20avatar%20cartoon%20style%20round%20icon&image_size=square_hd',
                'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=rabbit%20avatar%20cartoon%20style%20round%20icon&image_size=square_hd',
                'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fox%20avatar%20cartoon%20style%20round%20icon&image_size=square_hd',
                'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=owl%20avatar%20cartoon%20style%20round%20icon&image_size=square_hd'
            ],
            consumeRecords: [
                {
                    id: 1,
                    movieName: '流浪地球3',
                    movieImg: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20sci-fi%20movie%20poster%20wandering%20earth%20style&image_size=square_hd',
                    cinemaName: '万达影城(天河店)',
                    showTime: '2026-04-20 14:30',
                    seats: '5排8座',
                    totalPrice: 68.00,
                    status: '已完成'
                },
                {
                    id: 2,
                    movieName: '速度与激情11',
                    movieImg: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fast%20and%20furious%20movie%20poster%20cars%20racing&image_size=square_hd',
                    cinemaName: 'CGV影城(正佳店)',
                    showTime: '2026-04-18 20:00',
                    seats: '8排12座、8排13座',
                    totalPrice: 136.00,
                    status: '已完成'
                },
                {
                    id: 3,
                    movieName: '复仇者联盟5',
                    movieImg: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=avengers%20marvel%20superhero%20movie%20poster%20epic&image_size=square_hd',
                    cinemaName: '百丽宫影城(太古汇店)',
                    showTime: '2026-04-15 19:30',
                    seats: '6排5座',
                    totalPrice: 85.00,
                    status: '已退票'
                },
                {
                    id: 4,
                    movieName: '疯狂动物城2',
                    movieImg: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=zootopia%20disney%20animation%20movie%20poster%20cute%20animals&image_size=square_hd',
                    cinemaName: '金逸影城(北京路店)',
                    showTime: '2026-04-10 15:00',
                    seats: '7排9座、7排10座、7排11座',
                    totalPrice: 180.00,
                    status: '已完成'
                }
            ],
            balanceInfo: {
                balance: 1286.50,
                totalIncome: 3500,
                totalExpense: 2213.50
            },
            balanceRecordType: 'all',
            balanceRecords: [
                {
                    id: 1,
                    type: 'income',
                    icon: '💰',
                    title: '账户充值',
                    description: '支付宝充值',
                    amount: 500,
                    time: '2026-04-20 10:30:00'
                },
                {
                    id: 2,
                    type: 'expense',
                    icon: '🎬',
                    title: '购买电影票',
                    description: '流浪地球3 - 万达影城(天河店)',
                    amount: 68,
                    time: '2026-04-20 14:25:00'
                },
                {
                    id: 3,
                    type: 'expense',
                    icon: '🎬',
                    title: '购买电影票',
                    description: '速度与激情11 - CGV影城(正佳店)',
                    amount: 136,
                    time: '2026-04-18 19:50:00'
                },
                {
                    id: 4,
                    type: 'income',
                    icon: '↩️',
                    title: '退票退款',
                    description: '复仇者联盟5 - 退款到账',
                    amount: 85,
                    time: '2026-04-16 09:00:00'
                },
                {
                    id: 5,
                    type: 'expense',
                    icon: '🎬',
                    title: '购买电影票',
                    description: '疯狂动物城2 - 金逸影城(北京路店)',
                    amount: 180,
                    time: '2026-04-10 14:45:00'
                },
                {
                    id: 6,
                    type: 'income',
                    icon: '🎁',
                    title: '邀请好友奖励',
                    description: '成功邀请好友注册',
                    amount: 50,
                    time: '2026-04-08 16:20:00'
                },
                {
                    id: 7,
                    type: 'income',
                    icon: '💰',
                    title: '账户充值',
                    description: '微信支付充值',
                    amount: 1000,
                    time: '2026-04-01 09:15:00'
                },
                {
                    id: 8,
                    type: 'expense',
                    icon: '🎤',
                    title: '购买演唱会门票',
                    description: '周杰伦演唱会 - 广州站',
                    amount: 880,
                    time: '2026-03-28 20:00:00'
                }
            ],
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
            showRechargeModal: false,
            selectedRechargeAmount: 100,
            customRechargeAmount: '',
            paymentMethod: 'alipay',
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
        filteredBalanceRecords() {
            if (this.balanceRecordType === 'all') {
                return this.balanceRecords;
            }
            return this.balanceRecords.filter(r => r.type === this.balanceRecordType);
        },
        filteredPointsRecords() {
            if (this.pointsRecordType === 'all') {
                return this.pointsRecords;
            }
            return this.pointsRecords.filter(r => r.type === this.pointsRecordType);
        },
        rechargeAmount() {
            return this.selectedRechargeAmount || (this.customRechargeAmount ? parseFloat(this.customRechargeAmount) : 0);
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
        editUserInfo() {
            this.editForm = {
                nickname: this.userInfo.nickname,
                gender: this.userInfo.gender,
                birthday: this.userInfo.birthday,
                phone: this.userInfo.phone,
                email: this.userInfo.email
            };
            this.isEditing = true;
        },
        saveUserInfo() {
            if (this.editForm.nickname && this.editForm.nickname.trim() !== '') {
                this.userInfo.nickname = this.editForm.nickname;
            }
            if (this.editForm.gender && this.editForm.gender !== '') {
                this.userInfo.gender = this.editForm.gender;
            }
            if (this.editForm.birthday && this.editForm.birthday !== '') {
                this.userInfo.birthday = this.editForm.birthday;
            }
            if (this.editForm.phone && this.editForm.phone.trim() !== '') {
                this.userInfo.phone = this.editForm.phone;
            }
            if (this.editForm.email && this.editForm.email.trim() !== '') {
                this.userInfo.email = this.editForm.email;
            }
            this.isEditing = false;
            this.$toast('保存成功');
        },
        selectAvatar(avatar) {
            this.selectedAvatar = avatar;
        },
        handleFileUpload(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.selectedAvatar = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        },
        confirmAvatar() {
            if (this.selectedAvatar) {
                this.userInfo.avatar = this.selectedAvatar;
            }
            this.showAvatarPicker = false;
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
        handleRecharge() {
            if (this.rechargeAmount <= 0) {
                this.$toast('请输入充值金额');
                return;
            }
            this.balanceInfo.balance += this.rechargeAmount;
            this.balanceInfo.totalIncome += this.rechargeAmount;
            
            const bonusPoints = this.userInfo.isVip ? Math.floor(this.rechargeAmount / 10) : 0;
            if (bonusPoints > 0) {
                this.pointsInfo.points += bonusPoints;
                this.pointsInfo.totalEarned += bonusPoints;
                this.pointsRecords.unshift({
                    id: Date.now(),
                    type: 'income',
                    icon: '✨',
                    title: '充值赠送积分',
                    description: `VIP充值${this.rechargeAmount}元额外赠送${bonusPoints}积分`,
                    amount: bonusPoints,
                    time: this.formatTime(new Date())
                });
            }
            
            this.balanceRecords.unshift({
                id: Date.now(),
                type: 'income',
                icon: '💰',
                title: '账户充值',
                description: this.paymentMethod === 'alipay' ? '支付宝充值' : '微信支付充值',
                amount: this.rechargeAmount,
                time: this.formatTime(new Date())
            });
            
            this.showRechargeModal = false;
            this.$toast(`充值成功${bonusPoints > 0 ? `，VIP额外赠送${bonusPoints}积分` : ''}`);
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
.user-center {
    background-color: #f5f5f5;
    min-height: 100vh;
    padding-bottom: 20px;
}

.user-header {
    background: linear-gradient(135deg, #E54847 0%, #ff6b6b 100%);
    padding: 30px 20px;
}

.avatar-section {
    display: flex;
    align-items: center;
}

.avatar-wrapper {
    position: relative;
    margin-right: 20px;
}

.avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 3px solid #fff;
    object-fit: cover;
}

.avatar-edit-icon {
    position: absolute;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);
    color: #fff;
    font-size: 10px;
    padding: 2px 8px;
    border-radius: 10px;
    cursor: pointer;
}

.user-basic {
    flex: 1;
}

.username {
    color: #fff;
    font-size: 20px;
    margin-bottom: 8px;
}

.vip-badge {
    display: inline-flex;
    align-items: center;
    background: linear-gradient(90deg, #ffd700 0%, #ffaa00 100%);
    border-radius: 15px;
    padding: 2px 12px;
}

.vip-icon {
    color: #8b4513;
    font-weight: bold;
    font-size: 12px;
    margin-right: 6px;
}

.vip-level {
    color: #8b4513;
    font-size: 12px;
    font-weight: bold;
}

.no-vip-badge {
    display: inline-block;
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
    border-radius: 15px;
    padding: 2px 12px;
    font-size: 12px;
}

.user-info-card, .vip-info-card, .consume-record-card {
    background: #fff;
    margin: 15px;
    border-radius: 10px;
    padding: 15px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f0f0f0;
}

.card-header h3 {
    font-size: 16px;
    color: #333;
}

.edit-btn {
    background: none;
    border: 1px solid #E54847;
    color: #E54847;
    padding: 5px 15px;
    border-radius: 15px;
    font-size: 12px;
    cursor: pointer;
}

.save-btn {
    background: #E54847;
    border: none;
    color: #fff;
    padding: 5px 15px;
    border-radius: 15px;
    font-size: 12px;
    cursor: pointer;
}

.info-list {
    .info-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid #f5f5f5;

        &:last-child {
            border-bottom: none;
        }

        &.edit-mode {
            flex-direction: column;
            align-items: flex-start;
        }
    }

    .info-label {
        color: #999;
        font-size: 14px;
    }

    .info-value {
        color: #333;
        font-size: 14px;
    }

    .info-input, .info-select {
        width: 100%;
        margin-top: 8px;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 14px;
        box-sizing: border-box;
    }

    .info-input:focus, .info-select:focus {
        outline: none;
        border-color: #E54847;
    }
}

.vip-status {
    background: #e8f5e9;
    color: #4caf50;
    padding: 3px 10px;
    border-radius: 10px;
    font-size: 12px;
}

.vip-detail {
    .vip-level-display {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
    }

    .level-icon {
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #ffd700 0%, #ffaa00 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 15px;

        span {
            color: #8b4513;
            font-weight: bold;
            font-size: 12px;
        }
    }

    .level-info {
        h4 {
            font-size: 16px;
            color: #333;
            margin-bottom: 5px;
        }

        p {
            font-size: 12px;
            color: #999;
        }
    }
}

.vip-progress {
    margin-bottom: 20px;

    .progress-label {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: #666;
        margin-bottom: 8px;
    }

    .progress-bar {
        height: 8px;
        background: #f0f0f0;
        border-radius: 4px;
        overflow: hidden;
    }

    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #E54847 0%, #ff6b6b 100%);
        border-radius: 4px;
        transition: width 0.3s ease;
    }
}

.vip-privileges {
    h5 {
        font-size: 14px;
        color: #333;
        margin-bottom: 15px;
    }

    .privilege-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    .privilege-item {
        width: 48%;
        display: flex;
        align-items: center;
        padding: 10px;
        background: #f9f9f9;
        border-radius: 8px;
        margin-bottom: 10px;

        .privilege-icon {
            font-size: 20px;
            margin-right: 8px;
        }

        span:last-child {
            font-size: 13px;
            color: #333;
        }
    }
}

.no-vip-card {
    background: #fff;
    margin: 15px;
    border-radius: 10px;
    padding: 30px 20px;
    text-align: center;
}

.no-vip-content {
    .no-vip-icon {
        font-size: 50px;
        margin-bottom: 15px;
    }

    h3 {
        font-size: 16px;
        color: #333;
        margin-bottom: 10px;
    }

    p {
        font-size: 13px;
        color: #999;
        margin-bottom: 20px;
    }

    .open-vip-btn {
        background: linear-gradient(135deg, #ffd700 0%, #ffaa00 100%);
        border: none;
        color: #8b4513;
        padding: 10px 40px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
    }
}

.record-list {
    .record-item {
        display: flex;
        padding: 15px 0;
        border-bottom: 1px solid #f5f5f5;

        &:last-child {
            border-bottom: none;
        }
    }

    .record-left {
        margin-right: 12px;
    }

    .record-poster {
        width: 60px;
        height: 80px;
        border-radius: 5px;
        object-fit: cover;
    }

    .record-middle {
        flex: 1;
    }

    .record-movie-name {
        font-size: 15px;
        color: #333;
        margin-bottom: 5px;
    }

    .record-cinema, .record-time, .record-seats {
        font-size: 12px;
        color: #999;
        margin-bottom: 3px;
    }

    .record-right {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: center;
    }

    .record-price {
        font-size: 16px;
        color: #E54847;
        font-weight: bold;
        margin-bottom: 5px;
    }

    .record-status {
        font-size: 12px;
        padding: 2px 8px;
        border-radius: 10px;

        &.success {
            background: #e8f5e9;
            color: #4caf50;
        }

        &.refund {
            background: #ffebee;
            color: #f44336;
        }
    }
}

.no-record {
    text-align: center;
    padding: 40px 0;
    color: #999;
    font-size: 14px;
}

.avatar-picker-modal {
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

.avatar-options {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-bottom: 20px;
}

.avatar-option {
    width: 60px;
    height: 60px;
    cursor: pointer;
    position: relative;

    img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
        border: 3px solid transparent;

        &.selected {
            border-color: #E54847;
        }
    }
}

.upload-option {
    margin-bottom: 20px;
}

.upload-label {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15px;
    border: 2px dashed #ddd;
    border-radius: 10px;
    cursor: pointer;

    &:hover {
        border-color: #E54847;
    }

    .upload-icon {
        font-size: 20px;
        color: #999;
        margin-right: 8px;
    }

    span:last-child {
        font-size: 14px;
        color: #666;
    }
}

.modal-footer {
    display: flex;
    gap: 15px;
}

.cancel-btn, .confirm-btn {
    flex: 1;
    padding: 12px;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;
    border: none;
}

.cancel-btn {
    background: #f5f5f5;
    color: #666;
}

.balance-card, .points-card {
    background: #fff;
    margin: 15px;
    border-radius: 10px;
    padding: 15px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.balance-info, .points-info {
    background: linear-gradient(135deg, #E54847 0%, #ff6b6b 100%);
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 15px;
}

.balance-amount, .points-amount {
    text-align: center;
    margin-bottom: 15px;
}

.balance-label, .points-label {
    display: block;
    color: rgba(255, 255, 255, 0.8);
    font-size: 12px;
    margin-bottom: 5px;
}

.balance-value {
    color: #fff;
    font-size: 32px;
    font-weight: bold;
}

.points-value {
    color: #fff;
    font-size: 32px;
    font-weight: bold;
}

.balance-stats, .points-stats {
    display: flex;
    justify-content: space-around;
    padding-top: 15px;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-item {
    text-align: center;
}

.stat-item .stat-label {
    display: block;
    color: rgba(255, 255, 255, 0.7);
    font-size: 12px;
    margin-bottom: 5px;
}

.stat-item .stat-value {
    color: #fff;
    font-size: 14px;
    font-weight: bold;
}

.stat-value.income {
    color: #a8e6cf;
}

.stat-value.expense {
    color: #ffd3b6;
}

.records-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f0f0f0;
}

.records-header h4 {
    font-size: 14px;
    color: #333;
}

.record-tabs {
    display: flex;
    gap: 10px;
}

.tab-item {
    font-size: 12px;
    color: #999;
    padding: 4px 10px;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.tab-item.active {
    background: #E54847;
    color: #fff;
}

.balance-record-item, .points-record-item {
    display: flex;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f5f5f5;

    &:last-child {
        border-bottom: none;
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

.recharge-btn, .exchange-btn {
    background: #E54847;
    color: #fff;
    padding: 5px 15px;
    border-radius: 15px;
    font-size: 12px;
    cursor: pointer;
}

.recharge-modal, .exchange-modal {
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

.recharge-options {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin-bottom: 15px;
}

.recharge-option {
    border: 2px solid #ddd;
    border-radius: 10px;
    padding: 15px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;

    &.selected {
        border-color: #E54847;
        background: #fff5f5;
    }

    .amount {
        display: block;
        font-size: 20px;
        font-weight: bold;
        color: #333;
        margin-bottom: 5px;
    }

    .bonus {
        display: block;
        font-size: 11px;
        color: #E54847;
    }
}

.custom-amount {
    margin-bottom: 15px;
    padding: 10px;
    background: #f9f9f9;
    border-radius: 8px;

    .label {
        display: block;
        font-size: 13px;
        color: #666;
        margin-bottom: 8px;
    }

    input {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 16px;
        box-sizing: border-box;

        &:focus {
            outline: none;
            border-color: #E54847;
        }
    }
}

.payment-methods {
    margin-bottom: 15px;

    h4 {
        font-size: 14px;
        color: #333;
        margin-bottom: 10px;
    }

    .method-list {
        display: flex;
        gap: 10px;
    }

    .method-item {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 12px;
        border: 2px solid #ddd;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;

        &.selected {
            border-color: #E54847;
            background: #fff5f5;
        }

        .method-icon {
            font-size: 20px;
            margin-right: 8px;
        }

        .method-name {
            font-size: 14px;
            color: #333;
        }
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
