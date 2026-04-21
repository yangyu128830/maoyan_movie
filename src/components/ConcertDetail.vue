<template>
    <div class="concert-detail-page">
        <div class="detail-header" v-if="concert">
            <div class="banner">
                <img :src="concert.image" :alt="concert.name">
                <div class="banner-info">
                    <div class="tags">
                        <span class="tag" v-for="tag in concert.tags" :key="tag">{{ tag }}</span>
                    </div>
                    <h1 class="title">{{ concert.name }}</h1>
                    <p class="artist">艺人：{{ concert.artist }}</p>
                </div>
            </div>
        </div>

        <div class="detail-content" v-if="concert">
            <div class="info-section">
                <div class="info-item">
                    <span class="label">📅 演出时间</span>
                    <span class="value">{{ concert.date }} {{ concert.time }}</span>
                </div>
                <div class="info-item">
                    <span class="label">📍 演出场馆</span>
                    <span class="value">{{ concert.city }} · {{ concert.venue }}</span>
                </div>
                <div class="info-item">
                    <span class="label">🎫 票档价格</span>
                    <span class="value price-range">¥{{ concert.price }} - ¥{{ concert.maxPrice }}</span>
                </div>
            </div>

            <div class="desc-section">
                <h3 class="section-title">📝 演出介绍</h3>
                <p class="description">{{ concert.description }}</p>
            </div>

            <div class="seat-section">
                <h3 class="section-title">💺 选择座位</h3>
                <div class="seat-list">
                    <div 
                        class="seat-item" 
                        v-for="(seat, index) in concert.seats" 
                        :key="index"
                        :class="{ selected: selectedSeatIndex === index, disabled: seat.available === 0 }"
                        @click="selectSeat(index)"
                    >
                        <div class="seat-info">
                            <h4 class="area-name">{{ seat.area }}</h4>
                            <p class="seat-price">¥{{ seat.price }}</p>
                        </div>
                        <div class="seat-status">
                            <span class="available" v-if="seat.available > 0">剩余 {{ seat.available }} 张</span>
                            <span class="sold-out" v-else>已售罄</span>
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

            <div class="total-section" v-if="selectedSeatIndex !== null && concert.seats[selectedSeatIndex]">
                <div class="total-info">
                    <span class="total-label">订单总价</span>
                    <span class="total-price">¥{{ totalPrice }}</span>
                </div>
                <div class="total-detail">
                    <span>{{ concert.seats[selectedSeatIndex].area }} × {{ ticketCount }} 张</span>
                </div>
            </div>
        </div>

        <div class="empty-state" v-else>
            <p>演唱会信息不存在</p>
            <button class="back-btn" @click="goBack">返回演唱会列表</button>
        </div>

        <div class="bottom-bar" v-if="concert">
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
import concertData from '@/data/concert.js';

export default {
    name: 'ConcertDetail',
    created() {
        this.$store.commit('changeHt', '演唱会详情');
        this.loadConcert();
    },
    data() {
        return {
            concert: null,
            selectedSeatIndex: null,
            ticketCount: 1,
            maxTickets: 6
        };
    },
    computed: {
        totalPrice() {
            if (this.selectedSeatIndex !== null && this.concert && this.concert.seats[this.selectedSeatIndex]) {
                return this.concert.seats[this.selectedSeatIndex].price * this.ticketCount;
            }
            return 0;
        }
    },
    watch: {
        '$route'(to) {
            if (to.name === 'concert_detail') {
                this.loadConcert();
                this.resetSelection();
            }
        }
    },
    methods: {
        loadConcert() {
            const concertId = parseInt(this.$route.params.concertId);
            const allConcerts = concertData.concerts;
            this.concert = allConcerts.find(c => c.id === concertId) || null;
        },
        resetSelection() {
            this.selectedSeatIndex = null;
            this.ticketCount = 1;
        },
        goBack() {
            this.$router.push({ name: 'concert' });
        },
        selectSeat(index) {
            if (this.concert && this.concert.seats[index] && this.concert.seats[index].available > 0) {
                this.selectedSeatIndex = index;
                this.ticketCount = 1;
                this.maxTickets = Math.min(6, this.concert.seats[index].available);
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
            
            const seat = this.concert.seats[this.selectedSeatIndex];
            const message = `购票成功！\n\n` +
                `演唱会：${this.concert.name}\n` +
                `艺人：${this.concert.artist}\n` +
                `时间：${this.concert.date} ${this.concert.time}\n` +
                `场馆：${this.concert.city} ${this.concert.venue}\n` +
                `座位：${seat.area}\n` +
                `票数：${this.ticketCount} 张\n` +
                `总价：¥${this.totalPrice}`;
            
            alert(message);
        }
    }
};
</script>

<style lang="scss" scoped>
@import '@/assets/sass/public.scss';

.concert-detail-page {
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
                    background: #ff5722;
                    color: #fff;
                    font-size: 11px;
                    border-radius: 3px;
                    margin-right: 5px;
                }
            }
            
            .title {
                font-size: 18px;
                font-weight: bold;
                color: #fff;
                margin-bottom: 5px;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
            }
            
            .artist {
                font-size: 13px;
                color: #fff;
                opacity: 0.9;
            }
        }
    }
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
            align-items: center;
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
                
                &.price-range {
                    color: #ff5722;
                    font-weight: bold;
                    font-size: 16px;
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
                    border-color: #ff5722;
                    background: #fff8f5;
                }
                
                &.selected {
                    border-color: #ff5722;
                    background: #fff8f5;
                    box-shadow: 0 0 0 2px rgba(255, 87, 34, 0.2);
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
                        font-size: 18px;
                        font-weight: bold;
                        color: #ff5722;
                    }
                }
                
                .seat-status {
                    .available {
                        font-size: 12px;
                        color: #4caf50;
                    }
                    
                    .sold-out {
                        font-size: 12px;
                        color: #999;
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
                                border-color: #ff5722;
                                color: #ff5722;
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
                color: #ff5722;
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
        background: #ff5722;
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
            color: #ff5722;
            
            &.placeholder {
                color: #999;
                font-size: 14px;
                font-weight: normal;
            }
        }
    }
    
    .buy-btn {
        padding: 12px 35px;
        background: linear-gradient(135deg, #ff5722, #ff7043);
        border: none;
        border-radius: 25px;
        color: #fff;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: 0 3px 10px rgba(255, 87, 34, 0.3);
        
        &:hover:not(.disabled) {
            transform: translateY(-1px);
            box-shadow: 0 5px 15px rgba(255, 87, 34, 0.4);
        }
        
        &.disabled {
            background: #ccc;
            cursor: not-allowed;
            box-shadow: none;
        }
    }
}
</style>
