<template>
    <div class="balance-detail">
        <div class="balance-header">
            <div class="balance-info">
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
            <button class="recharge-btn" @click="showRechargeModal = true">立即充值</button>
        </div>

        <div class="record-section">
            <div class="section-header">
                <h3>余额明细</h3>
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
    </div>
</template>

<script>
export default {
    name: 'BalanceDetail',
    created() {
        this.$store.commit('changeHt', '我的余额');
    },
    data() {
        return {
            userInfo: {
                isVip: true,
                vipLevel: 5
            },
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
            showRechargeModal: false,
            selectedRechargeAmount: 100,
            customRechargeAmount: '',
            paymentMethod: 'alipay'
        };
    },
    computed: {
        filteredBalanceRecords() {
            if (this.balanceRecordType === 'all') {
                return this.balanceRecords;
            }
            return this.balanceRecords.filter(r => r.type === this.balanceRecordType);
        },
        rechargeAmount() {
            return this.selectedRechargeAmount || (this.customRechargeAmount ? parseFloat(this.customRechargeAmount) : 0);
        }
    },
    methods: {
        handleRecharge() {
            if (this.rechargeAmount <= 0) {
                this.$toast('请输入充值金额');
                return;
            }
            this.balanceInfo.balance += this.rechargeAmount;
            this.balanceInfo.totalIncome += this.rechargeAmount;

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
            this.$toast('充值成功');
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
.balance-detail {
    background-color: #f5f5f5;
    min-height: 100vh;
}

.balance-header {
    background: linear-gradient(135deg, #E54847 0%, #ff6b6b 100%);
    padding: 30px 20px;
    text-align: center;
}

.balance-info {
    margin-bottom: 20px;
}

.balance-label {
    display: block;
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
    margin-bottom: 8px;
}

.balance-value {
    color: #fff;
    font-size: 36px;
    font-weight: bold;
}

.balance-stats {
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

.recharge-btn {
    background: #fff;
    color: #E54847;
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
        background: #E54847;
        color: #fff;
    }
}

.record-list {
    .balance-record-item {
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

.recharge-modal {
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

.confirm-btn {
    background: #E54847;
    color: #fff;
}
</style>
