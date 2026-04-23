<template>
    <div class="records-detail">
        <div class="records-header">
            <div class="records-info">
                <span class="records-label">消费记录</span>
                <span class="records-count">共{{consumeRecords.length}}笔</span>
            </div>
            <div class="records-stats">
                <div class="stat-item">
                    <span class="stat-label">消费总额</span>
                    <span class="stat-value">¥{{totalAmount}}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">已完成</span>
                    <span class="stat-value success">{{completedCount}}笔</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">已退票</span>
                    <span class="stat-value refund">{{refundCount}}笔</span>
                </div>
            </div>
        </div>

        <div class="records-section">
            <div class="record-list" v-if="consumeRecords.length > 0">
                <div class="record-item" v-for="(record, index) in consumeRecords" :key="index">
                    <div class="record-left">
                        <img :src="record.movieImg" alt="" class="record-poster">
                    </div>
                    <div class="record-middle">
                        <h4 class="record-movie-name">{{record.movieName}}</h4>
                        <p class="record-cinema">{{record.cinemaName}}</p>
                        <p class="record-time">{{record.showTime}}</p>
                        <p class="record-seats">座位：{{record.seats}}</p>
                    </div>
                    <div class="record-right">
                        <span class="record-price">¥{{record.totalPrice}}</span>
                        <span class="record-status" :class="{'success': record.status === '已完成', 'refund': record.status === '已退票'}">{{record.status}}</span>
                    </div>
                </div>
            </div>
            <div class="no-record" v-else>
                <p>暂无消费记录</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'RecordsDetail',
    created() {
        this.$store.commit('changeHt', '消费记录');
    },
    data() {
        return {
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
            ]
        };
    },
    computed: {
        totalAmount() {
            return this.consumeRecords.reduce((sum, r) => sum + r.totalPrice, 0).toFixed(2);
        },
        completedCount() {
            return this.consumeRecords.filter(r => r.status === '已完成').length;
        },
        refundCount() {
            return this.consumeRecords.filter(r => r.status === '已退票').length;
        }
    }
};
</script>

<style lang="scss" scoped>
.records-detail {
    background-color: #f5f5f5;
    min-height: 100vh;
}

.records-header {
    background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
    padding: 30px 20px;
}

.records-info {
    text-align: center;
    margin-bottom: 20px;
}

.records-label {
    display: block;
    color: #333;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 5px;
}

.records-count {
    color: #666;
    font-size: 13px;
}

.records-stats {
    display: flex;
    justify-content: space-around;
    padding: 15px 0;
    border-top: 1px solid rgba(255, 255, 255, 0.5);
    border-bottom: 1px solid rgba(255, 255, 255, 0.5);
}

.stat-item {
    text-align: center;
}

.stat-label {
    display: block;
    color: #666;
    font-size: 12px;
    margin-bottom: 5px;
}

.stat-value {
    color: #333;
    font-size: 16px;
    font-weight: bold;

    &.success {
        color: #4caf50;
    }

    &.refund {
        color: #f44336;
    }
}

.records-section {
    background: #fff;
    margin: 15px;
    border-radius: 10px;
    padding: 15px;
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
</style>
