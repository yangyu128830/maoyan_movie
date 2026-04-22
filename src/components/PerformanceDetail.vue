<template lang="html">
    <div class="performance-detail-page">
        <div class="detail-header" v-if="performance">
            <div class="banner">
                <img :src="performance.img" :alt="performance.title">
                <div class="banner-info">
                    <div class="tags">
                        <span class="tag" v-for="tag in performance.tags" :key="tag">{{ tag }}</span>
                        <span class="tag discount" v-if="performance.discount">限时{{ performance.discount }}折</span>
                    </div>
                    <h1 class="title">{{ performance.title }}</h1>
                    <p class="type">{{ performance.type }}</p>
                </div>
            </div>
        </div>

        <div class="detail-content" v-if="performance">
            <div class="info-section">
                <div class="info-item">
                    <span class="label">📅 演出时间</span>
                    <span class="value">{{ performance.showTime }}</span>
                </div>
                <div class="info-item">
                    <span class="label">📍 演出场馆</span>
                    <span class="value">{{ performance.venue }}</span>
                </div>
                <div class="info-item">
                    <span class="label">🎫 票价范围</span>
                    <span class="value price-range">
                        <span class="current" v-if="performance.discount">¥{{ performance.minPrice }} - ¥{{ performance.maxPrice }}</span>
                        <span class="original" v-if="performance.discount">原价 ¥{{ performance.originalPrice }}起</span>
                        <span v-else>¥{{ performance.minPrice }} - ¥{{ performance.maxPrice }}</span>
                    </span>
                </div>
                <div class="info-item">
                    <span class="label">📞 咨询电话</span>
                    <span class="value">{{ performance.phone }}</span>
                </div>
            </div>

            <div class="desc-section">
                <h3 class="section-title">📝 演出介绍</h3>
                <p class="description">{{ performance.description }}</p>
            </div>

            <div class="seat-section">
                <h3 class="section-title">💺 选择座位</h3>
                <div class="seat-list">
                    <div 
                        class="seat-item" 
                        v-for="(seat, index) in performance.ticketTypes" 
                        :key="index"
                        :class="{ selected: selectedSeatIndex === index, disabled: seat.available === 0 }"
                        @click="selectSeat(index)"
                    >
                        <div class="seat-info">
                            <h4 class="area-name">{{ seat.area }}</h4>
                            <p class="seat-price">
                                <span class="price">¥{{ seat.price }}</span>
                                <span class="available" v-if="seat.available > 0">剩余 {{ seat.available }} 张</span>
                                <span class="sold-out" v-else>已售罄</span>
                            </p>
                        </div>
                        <div class="seat-count" v-if="selectedSeatIndex === index">
                            <div class="count-control">
                                <button class="count-btn" @click.stop="decreaseCount" :disabled="ticketCount <= 1">-</button>
                                <span class="count-value">{{ ticketCount }}</span>
                                <button class="count-btn" @click.stop="increaseCount" :disabled="ticketCount >= maxTickets">+</button>
                            </div>
                            <p class="count-limit">最多可购 {{ maxTickets }} 张</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="total-section" v-if="selectedSeatIndex !== null && performance.ticketTypes[selectedSeatIndex]">
                <div class="total-info">
                    <span class="total-label">订单总价</span>
                    <span class="total-price">¥{{ totalPrice }}</span>
                </div>
                <div class="total-detail">
                    <span>{{ performance.ticketTypes[selectedSeatIndex].area }} × {{ ticketCount }} 张</span>
                </div>
            </div>
        </div>

        <div class="empty-state" v-else>
            <p>演出信息不存在</p>
            <button class="back-btn" @click="goBack">返回玩乐列表</button>
        </div>

        <div class="bottom-bar" v-if="performance">
            <div class="price-summary">
                <span class="price-label">总价：</span>
                <span class="price-value" v-if="selectedSeatIndex !== null">¥{{ totalPrice }}</span>
                <span class="price-value placeholder" v-else>请选择座位</span>
            </div>
            <button 
                class="buy-btn" 
                :class="{ disabled: selectedSeatIndex === null }"
                @click="handleBuy"
            >
                {{ selectedSeatIndex !== null ? '立即购票' : '请选择座位' }}
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PerformanceDetail',
    created() {
        this.$store.commit('changeHt', '演出详情');
        this.loadPerformance();
    },
    data() {
        return {
            performance: null,
            selectedSeatIndex: null,
            ticketCount: 1,
            maxTickets: 6
        };
    },
    computed: {
        totalPrice() {
            if (this.selectedSeatIndex !== null && this.performance && this.performance.ticketTypes[this.selectedSeatIndex]) {
                return this.performance.ticketTypes[this.selectedSeatIndex].price * this.ticketCount;
            }
            return 0;
        }
    },
    watch: {
        '$route'(to) {
            if (to.name === 'performance_detail') {
                this.loadPerformance();
                this.resetSelection();
            }
        }
    },
    methods: {
        loadPerformance() {
            try {
                const data = this.$route.query.data;
                if (data) {
                    this.performance = JSON.parse(data);
                } else {
                    this.performance = null;
                }
            } catch (e) {
                console.error('解析演出数据失败:', e);
                this.performance = null;
            }
        },
        resetSelection() {
            this.selectedSeatIndex = null;
            this.ticketCount = 1;
        },
        goBack() {
            this.$router.push({ name: 'play' });
        },
        selectSeat(index) {
            if (this.performance && this.performance.ticketTypes[index] && this.performance.ticketTypes[index].available > 0) {
                this.selectedSeatIndex = index;
                this.ticketCount = 1;
                this.maxTickets = Math.min(6, this.performance.ticketTypes[index].available);
            }
        },
        increaseCount() {
            if (this.ticketCount < this.maxTickets) {
                this.ticketCount++;
            }
        },
        decreaseCount() {
            if (this.ticketCount > 1) {
                this.ticketCount--;
            }
        },
        handleBuy() {
            if (this.selectedSeatIndex === null) {
                alert('请先选择座位和票数');
                return;
            }
            
            const seat = this.performance.ticketTypes[this.selectedSeatIndex];
            const message = `购票成功！\n\n` +
                `演出：${this.performance.title}\n` +
                `类型：${this.performance.type}\n` +
                `时间：${this.performance.showTime}\n` +
                `场馆：${this.performance.venue}\n` +
                `座位：${seat.area}\n` +
                `票数：${this.ticketCount} 张\n` +
                `总价：¥${this.totalPrice}\n\n` +
                `请凭订单信息在演出前30分钟到场。`;
            
            alert(message);
        }
    }
};
</script>

<style lang="scss" scoped>
@import '@/assets/sass/public.scss';

.performance-detail-page {
    padding-bottom: 80px;
    background-color: #f5f5f5;
    min-height: 100vh;
}

.detail-header {
    .banner {
        position: relative;
        width: 100%;
        height: 200px;
        overflow: hidden;
        
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .banner-info {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 15px;
            background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
            
            .tags {
                margin-bottom: 8px;
                
                .tag {
                    display: inline-block;
                    padding: 3px 8px;
                    background: $color_them;
                    color: #fff;
                    font-size: 11px;
                    border-radius: 3px;
                    margin-right: 5px;
                    
                    &.discount {
                        background: #ff9800;
                        animation: pulse 2s infinite;
                    }
                }
            }
            
            .title {
                font-size: 18px;
                font-weight: bold;
                color: #fff;
                margin-bottom: 5px;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
            }
            
            .type {
                font-size: 13px;
                color: rgba(255, 255, 255, 0.9);
            }
        }
    }
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
}

.detail-content {
    padding: 15px;
    
    .info-section {
        background: #fff;
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 15px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        
        .info-item {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding: 12px 0;
            border-bottom: 1px solid #f0f0f0;
            
            &:last-child {
                border-bottom: none;
            }
            
            .label {
                font-size: 14px;
                color: #666;
            }
            
            .value {
                font-size: 14px;
                color: #333;
                font-weight: 500;
                text-align: right;
                flex: 1;
                margin-left: 10px;
                
                &.price-range {
                    .current {
                        color: $color_them;
                        font-weight: bold;
                        font-size: 16px;
                    }
                    
                    .original {
                        color: #999;
                        text-decoration: line-through;
                        font-size: 12px;
                        margin-left: 8px;
                    }
                }
            }
        }
    }
    
    .desc-section {
        background: #fff;
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 15px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        
        .section-title {
            font-size: 15px;
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
        }
        
        .description {
            font-size: 13px;
            color: #666;
            line-height: 1.8;
        }
    }
    
    .seat-section {
        background: #fff;
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 15px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        
        .section-title {
            font-size: 15px;
            font-weight: bold;
            color: #333;
            margin-bottom: 15px;
        }
        
        .seat-list {
            .seat-item {
                padding: 15px;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                margin-bottom: 10px;
                cursor: pointer;
                transition: all 0.2s;
                
                &:last-child {
                    margin-bottom: 0;
                }
                
                &:hover:not(.disabled) {
                    border-color: $color_them;
                    background: #fff8f5;
                }
                
                &.selected {
                    border-color: $color_them;
                    background: #fff8f5;
                    box-shadow: 0 0 0 2px rgba(229, 72, 71, 0.2);
                }
                
                &.disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                
                .seat-info {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                    
                    .area-name {
                        font-size: 15px;
                        font-weight: bold;
                        color: #333;
                    }
                    
                    .seat-price {
                        .price {
                            font-size: 18px;
                            font-weight: bold;
                            color: $color_them;
                        }
                        
                        .available {
                            font-size: 12px;
                            color: #4caf50;
                            margin-left: 8px;
                        }
                        
                        .sold-out {
                            font-size: 12px;
                            color: #999;
                            margin-left: 8px;
                        }
                    }
                }
                
                .seat-count {
                    margin-top: 12px;
                    padding-top: 12px;
                    border-top: 1px dashed #e0e0e0;
                    
                    .count-control {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        
                        .count-btn {
                            width: 32px;
                            height: 32px;
                            border: 1px solid #e0e0e0;
                            border-radius: 4px;
                            background: #fff;
                            font-size: 18px;
                            color: #666;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            
                            &:hover:not(:disabled) {
                                border-color: $color_them;
                                color: $color_them;
                            }
                            
                            &:disabled {
                                opacity: 0.5;
                                cursor: not-allowed;
                            }
                        }
                        
                        .count-value {
                            font-size: 16px;
                            font-weight: bold;
                            color: #333;
                            min-width: 30px;
                            text-align: center;
                        }
                    }
                    
                    .count-limit {
                        font-size: 11px;
                        color: #999;
                        margin-top: 6px;
                    }
                }
            }
        }
    }
    
    .total-section {
        background: #fff;
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 15px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        
        .total-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            
            .total-label {
                font-size: 14px;
                color: #666;
            }
            
            .total-price {
                font-size: 22px;
                font-weight: bold;
                color: $color_them;
            }
        }
        
        .total-detail {
            font-size: 12px;
            color: #999;
            margin-top: 5px;
        }
    }
}

.empty-state {
    text-align: center;
    padding: 60px 20px;
    
    p {
        font-size: 14px;
        color: #999;
        margin-bottom: 20px;
    }
    
    .back-btn {
        padding: 10px 25px;
        background: $color_them;
        border: none;
        border-radius: 4px;
        color: #fff;
        font-size: 14px;
        cursor: pointer;
    }
}

.bottom-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;
    background: #fff;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    
    .price-summary {
        .price-label {
            font-size: 13px;
            color: #666;
        }
        
        .price-value {
            font-size: 20px;
            font-weight: bold;
            color: $color_them;
            
            &.placeholder {
                color: #999;
                font-size: 14px;
                font-weight: normal;
            }
        }
    }
    
    .buy-btn {
        padding: 12px 35px;
        background: linear-gradient(135deg, $color_them, #ff7043);
        border: none;
        border-radius: 25px;
        color: #fff;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: 0 3px 10px rgba(229, 72, 71, 0.3);
        
        &:hover:not(.disabled) {
            transform: translateY(-1px);
            box-shadow: 0 5px 15px rgba(229, 72, 71, 0.4);
        }
        
        &.disabled {
            background: #ccc;
            cursor: not-allowed;
            box-shadow: none;
        }
    }
}
</style>
