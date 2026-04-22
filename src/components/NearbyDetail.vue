<template lang="html">
    <div class="nearby-detail-page">
        <div class="detail-header" v-if="nearby">
            <div class="banner">
                <img :src="nearby.img" :alt="nearby.title">
                <div class="banner-info">
                    <div class="tags">
                        <span class="tag" v-for="tag in nearby.tags" :key="tag">{{ tag }}</span>
                    </div>
                    <h1 class="title">{{ nearby.title }}</h1>
                    <div class="sub-info">
                        <span class="category">{{ nearby.category }}</span>
                        <span class="distance"><i class="icon-location"></i>{{ nearby.distance }}</span>
                    </div>
                    <div class="rating">
                        <span class="score">{{ nearby.score }}</span>
                        <span class="comments">{{ nearby.comments }}条评价</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="detail-content" v-if="nearby">
            <div class="info-section">
                <div class="info-item">
                    <span class="label">📍 地址</span>
                    <span class="value">{{ nearby.address }}</span>
                </div>
                <div class="info-item">
                    <span class="label">🕐 营业时间</span>
                    <span class="value">{{ nearby.openTime }}</span>
                </div>
                <div class="info-item">
                    <span class="label">📞 电话</span>
                    <span class="value">{{ nearby.phone }}</span>
                </div>
                <div class="info-item">
                    <span class="label">💰 人均价格</span>
                    <span class="value price">¥{{ nearby.price }}/人</span>
                </div>
            </div>

            <div class="desc-section">
                <h3 class="section-title">📝 商家介绍</h3>
                <p class="description">{{ nearby.description }}</p>
            </div>

            <div class="package-section">
                <h3 class="section-title">🎁 套餐选择</h3>
                <div class="package-list">
                    <div 
                        class="package-item" 
                        v-for="(pkg, index) in nearby.packages" 
                        :key="index"
                        :class="{ selected: selectedPackageIndex === index }"
                        @click="selectPackage(index)"
                    >
                        <div class="package-header">
                            <h4 class="package-name">{{ pkg.name }}</h4>
                            <span class="package-price">¥{{ pkg.price }}</span>
                        </div>
                        <p class="package-include">{{ pkg.include }}</p>
                        <div class="package-count" v-if="selectedPackageIndex === index">
                            <div class="count-control">
                                <button class="count-btn" @click.stop="decreaseCount" :disabled="packageCount <= 1">-</button>
                                <span class="count-value">{{ packageCount }}</span>
                                <button class="count-btn" @click.stop="increaseCount">+</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="total-section" v-if="selectedPackageIndex !== null && nearby.packages[selectedPackageIndex]">
                <div class="total-info">
                    <span class="total-label">订单总价</span>
                    <span class="total-price">¥{{ totalPrice }}</span>
                </div>
                <div class="total-detail">
                    <span>{{ nearby.packages[selectedPackageIndex].name }} × {{ packageCount }} 份</span>
                </div>
            </div>
        </div>

        <div class="empty-state" v-else>
            <p>商家信息不存在</p>
            <button class="back-btn" @click="goBack">返回玩乐列表</button>
        </div>

        <div class="bottom-bar" v-if="nearby">
            <div class="action-buttons">
                <button class="contact-btn" @click="handleContact">
                    <i class="icon-phone"></i>
                    <span>电话咨询</span>
                </button>
                <button class="nav-btn" @click="handleNavigate">
                    <i class="icon-nav"></i>
                    <span>导航前往</span>
                </button>
            </div>
            <button 
                class="buy-btn" 
                :class="{ disabled: selectedPackageIndex === null }"
                @click="handleBuy"
            >
                {{ selectedPackageIndex !== null ? '立即预订' : '请选择套餐' }}
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'NearbyDetail',
    created() {
        this.$store.commit('changeHt', '商家详情');
        this.loadNearby();
    },
    data() {
        return {
            nearby: null,
            selectedPackageIndex: null,
            packageCount: 1
        };
    },
    computed: {
        totalPrice() {
            if (this.selectedPackageIndex !== null && this.nearby && this.nearby.packages[this.selectedPackageIndex]) {
                return this.nearby.packages[this.selectedPackageIndex].price * this.packageCount;
            }
            return 0;
        }
    },
    watch: {
        '$route'(to) {
            if (to.name === 'nearby_detail') {
                this.loadNearby();
                this.resetSelection();
            }
        }
    },
    methods: {
        loadNearby() {
            try {
                const data = this.$route.query.data;
                if (data) {
                    this.nearby = JSON.parse(data);
                } else {
                    this.nearby = null;
                }
            } catch (e) {
                console.error('解析商家数据失败:', e);
                this.nearby = null;
            }
        },
        resetSelection() {
            this.selectedPackageIndex = null;
            this.packageCount = 1;
        },
        goBack() {
            this.$router.push({ name: 'play' });
        },
        selectPackage(index) {
            if (this.nearby && this.nearby.packages[index]) {
                this.selectedPackageIndex = index;
                this.packageCount = 1;
            }
        },
        increaseCount() {
            this.packageCount++;
        },
        decreaseCount() {
            if (this.packageCount > 1) {
                this.packageCount--;
            }
        },
        handleContact() {
            if (this.nearby && this.nearby.phone) {
                alert(`正在拨打：${this.nearby.phone}`);
            } else {
                alert('暂无联系电话');
            }
        },
        handleNavigate() {
            if (this.nearby && this.nearby.address) {
                alert(`正在导航到：${this.nearby.address}`);
            } else {
                alert('暂无地址信息');
            }
        },
        handleBuy() {
            if (this.selectedPackageIndex === null) {
                alert('请先选择套餐');
                return;
            }
            
            const pkg = this.nearby.packages[this.selectedPackageIndex];
            const message = `预订成功！\n\n` +
                `商家：${this.nearby.title}\n` +
                `套餐：${pkg.name}\n` +
                `包含：${pkg.include}\n` +
                `数量：${this.packageCount} 份\n` +
                `总价：¥${this.totalPrice}\n\n` +
                `请凭订单信息到店使用。`;
            
            alert(message);
        }
    }
};
</script>

<style lang="scss" scoped>
@import '@/assets/sass/public.scss';

.nearby-detail-page {
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
                    background: #2196f3;
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
            
            .sub-info {
                margin-bottom: 5px;
                
                .category {
                    font-size: 13px;
                    color: rgba(255, 255, 255, 0.9);
                    margin-right: 10px;
                }
                
                .distance {
                    font-size: 12px;
                    color: rgba(255, 255, 255, 0.8);
                    
                    i {
                        display: inline-block;
                        width: 12px;
                        height: 12px;
                        margin-right: 3px;
                        vertical-align: middle;
                        background-size: contain;
                        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23fff'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E");
                    }
                }
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
                
                &.price {
                    color: $color_them;
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
    
    .package-section {
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
        
        .package-list {
            .package-item {
                padding: 15px;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                margin-bottom: 10px;
                cursor: pointer;
                transition: all 0.2s;
                
                &:last-child {
                    margin-bottom: 0;
                }
                
                &:hover {
                    border-color: $color_them;
                    background: #fff8f5;
                }
                
                &.selected {
                    border-color: $color_them;
                    background: #fff8f5;
                    box-shadow: 0 0 0 2px rgba(229, 72, 71, 0.2);
                }
                
                .package-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                    
                    .package-name {
                        font-size: 15px;
                        font-weight: bold;
                        color: #333;
                    }
                    
                    .package-price {
                        font-size: 18px;
                        font-weight: bold;
                        color: $color_them;
                    }
                }
                
                .package-include {
                    font-size: 12px;
                    color: #666;
                    margin-bottom: 8px;
                }
                
                .package-count {
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
    
    .action-buttons {
        display: flex;
        gap: 10px;
        
        .contact-btn,
        .nav-btn {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 6px 12px;
            background: #f5f5f5;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
            
            &:hover {
                background: #e8e8e8;
            }
            
            &:active {
                transform: scale(0.95);
            }
            
            i {
                display: inline-block;
                width: 20px;
                height: 20px;
                margin-bottom: 2px;
                background-size: contain;
            }
            
            .icon-phone {
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z'/%3E%3C/svg%3E");
            }
            
            .icon-nav {
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E");
            }
            
            span {
                font-size: 11px;
                color: #666;
            }
        }
    }
    
    .buy-btn {
        padding: 12px 30px;
        background: linear-gradient(135deg, $color_them, #ff7043);
        border: none;
        border-radius: 25px;
        color: #fff;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: 0 3px 10px rgba(229, 72, 71, 0.3);
        flex-shrink: 0;
        
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
