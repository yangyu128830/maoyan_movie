<template lang="html">
    <div class="attraction-detail-page">
        <div class="detail-header" v-if="attraction">
            <div class="banner">
                <img :src="attraction.img" :alt="attraction.title">
                <div class="banner-info">
                    <div class="tags">
                        <span class="tag" v-for="tag in attraction.tags" :key="tag">{{ tag }}</span>
                    </div>
                    <h1 class="title">{{ attraction.title }}</h1>
                    <div class="rating">
                        <span class="score">{{ attraction.score }}</span>
                        <span class="comments">{{ attraction.comments }}条评价</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="detail-content" v-if="attraction">
            <div class="info-section">
                <div class="info-item">
                    <span class="label">📍 地址</span>
                    <span class="value">{{ attraction.address }}</span>
                </div>
                <div class="info-item">
                    <span class="label">🕐 开放时间</span>
                    <span class="value">{{ attraction.openTime }}</span>
                </div>
                <div class="info-item">
                    <span class="label">📞 电话</span>
                    <span class="value">{{ attraction.phone }}</span>
                </div>
            </div>

            <div class="desc-section">
                <h3 class="section-title">📝 景点介绍</h3>
                <p class="description">{{ attraction.description }}</p>
            </div>

            <div class="ticket-section">
                <h3 class="section-title">🎫 选择票种</h3>
                <div class="ticket-list">
                    <div 
                        class="ticket-item" 
                        v-for="(ticket, index) in attraction.ticketTypes" 
                        :key="index"
                        :class="{ selected: selectedTicketIndex === index, disabled: ticket.available === 0 }"
                        @click="selectTicket(index)"
                    >
                        <div class="ticket-info">
                            <h4 class="ticket-type">{{ ticket.type }}</h4>
                            <p class="ticket-price">
                                <span class="price">¥{{ ticket.price }}</span>
                                <span class="available" v-if="ticket.available > 0">剩余 {{ ticket.available }} 张</span>
                                <span class="sold-out" v-else>已售罄</span>
                            </p>
                        </div>
                        <div class="ticket-count" v-if="selectedTicketIndex === index">
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

            <div class="total-section" v-if="selectedTicketIndex !== null && attraction.ticketTypes[selectedTicketIndex]">
                <div class="total-info">
                    <span class="total-label">订单总价</span>
                    <span class="total-price">¥{{ totalPrice }}</span>
                </div>
                <div class="total-detail">
                    <span>{{ attraction.ticketTypes[selectedTicketIndex].type }} × {{ ticketCount }} 张</span>
                </div>
            </div>
        </div>

        <div class="empty-state" v-else>
            <p>景点信息不存在</p>
            <button class="back-btn" @click="goBack">返回玩乐列表</button>
        </div>

        <div class="bottom-bar" v-if="attraction">
            <div class="price-summary">
                <span class="price-label">总价：</span>
                <span class="price-value" v-if="selectedTicketIndex !== null">¥{{ totalPrice }}</span>
                <span class="price-value placeholder" v-else>请选择票种</span>
            </div>
            <button 
                class="buy-btn" 
                :class="{ disabled: selectedTicketIndex === null }"
                @click="handleBuy"
            >
                {{ selectedTicketIndex !== null ? '立即预订' : '请选择票种' }}
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AttractionDetail',
    created() {
        this.$store.commit('changeHt', '景点详情');
        this.loadAttraction();
    },
    data() {
        return {
            attraction: null,
            selectedTicketIndex: null,
            ticketCount: 1,
            maxTickets: 10
        };
    },
    computed: {
        totalPrice() {
            if (this.selectedTicketIndex !== null && this.attraction && this.attraction.ticketTypes[this.selectedTicketIndex]) {
                return this.attraction.ticketTypes[this.selectedTicketIndex].price * this.ticketCount;
            }
            return 0;
        }
    },
    watch: {
        '$route'(to) {
            if (to.name === 'attraction_detail') {
                this.loadAttraction();
                this.resetSelection();
            }
        }
    },
    methods: {
        loadAttraction() {
            try {
                const data = this.$route.query.data;
                if (data) {
                    this.attraction = JSON.parse(data);
                } else {
                    this.attraction = null;
                }
            } catch (e) {
                console.error('解析景点数据失败:', e);
                this.attraction = null;
            }
        },
        resetSelection() {
            this.selectedTicketIndex = null;
            this.ticketCount = 1;
        },
        goBack() {
            this.$router.push({ name: 'play' });
        },
        selectTicket(index) {
            if (this.attraction && this.attraction.ticketTypes[index] && this.attraction.ticketTypes[index].available > 0) {
                this.selectedTicketIndex = index;
                this.ticketCount = 1;
                this.maxTickets = Math.min(10, this.attraction.ticketTypes[index].available);
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
            if (this.selectedTicketIndex === null) {
                alert('请先选择票种');
                return;
            }
            
            const ticket = this.attraction.ticketTypes[this.selectedTicketIndex];
            const message = `预订成功！\n\n` +
                `景点：${this.attraction.title}\n` +
                `票种：${ticket.type}\n` +
                `张数：${this.ticketCount} 张\n` +
                `总价：¥${this.totalPrice}\n\n` +
                `请在游玩当天凭订单信息入园。`;
            
            alert(message);
        }
    }
};
</script>

<style lang="scss" scoped>
@import '@/assets/sass/public.scss';

.attraction-detail-page {
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
                    background: #4caf50;
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
            
            .rating {
                .score {
                    font-size: 14px;
                    font-weight: bold;
                    color: #ff9800;
                    margin-right: 8px;
                }
                
                .comments {
                    font-size: 12px;
                    color: rgba(255, 255, 255, 0.8);
                }
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
    
    .ticket-section {
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
        
        .ticket-list {
            .ticket-item {
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
                
                .ticket-info {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                    
                    .ticket-type {
                        font-size: 15px;
                        font-weight: bold;
                        color: #333;
                    }
                    
                    .ticket-price {
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
                
                .ticket-count {
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
