<template>
    <div class="concert-page">
        <div class="hot-recommend-section">
            <div class="section-header">
                <h2>🔥 热门推荐</h2>
                <span class="more">更多 ></span>
            </div>
            <div class="hot-list">
                <div 
                    class="hot-item" 
                    v-for="item in hotRecommendations" 
                    :key="item.id"
                    @click="goToDetail(item.id)"
                >
                    <div class="img-wrapper">
                        <img :src="item.image" :alt="item.name">
                        <div class="tags">
                            <span class="tag" v-for="tag in item.tags" :key="tag">{{ tag }}</span>
                        </div>
                    </div>
                    <div class="info">
                        <h3 class="title textOverflow1">{{ item.name }}</h3>
                        <p class="artist">{{ item.artist }}</p>
                        <p class="location">{{ item.city }} · {{ item.venue }}</p>
                        <p class="date">{{ item.date }} {{ item.time }}</p>
                        <div class="price">
                            <span class="label">票价</span>
                            <span class="amount">¥{{ item.price }}</span>
                            <span v-if="item.maxPrice > item.price">起</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="city-filter-section">
            <div class="section-header">
                <h2>📍 按地区查询</h2>
            </div>
            <div class="city-filter">
                <div class="city-list">
                    <button 
                        class="city-btn" 
                        :class="{ active: selectedCity === 'all' }"
                        @click="filterByCity('all')"
                    >全部</button>
                    <button 
                        class="city-btn" 
                        v-for="city in cities" 
                        :key="city.id"
                        :class="{ active: selectedCity === city.name }"
                        @click="filterByCity(city.name)"
                    >{{ city.name }}</button>
                </div>
                <div class="artist-list" v-if="filteredArtists.length > 0">
                    <h3>该地区开演唱会的艺人：</h3>
                    <div class="artist-tags">
                        <span 
                            class="artist-tag" 
                            v-for="artist in filteredArtists" 
                            :key="artist.id"
                            @click="filterByArtist(artist.name)"
                        >
                            {{ artist.name }}
                            <span class="count">({{ artist.concerts }}场)</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div class="concert-list-section">
            <div class="section-header">
                <h2>🎫 演唱会列表</h2>
                <span class="count">共 {{ filteredConcerts.length }} 场演唱会</span>
            </div>
            <div class="search-bar" v-if="selectedCity !== 'all' || selectedArtist">
                <span class="filter-info">
                    <span v-if="selectedCity !== 'all'">📍 {{ selectedCity }}</span>
                    <span v-if="selectedArtist">🎤 {{ selectedArtist }}</span>
                </span>
                <button class="clear-btn" @click="clearFilters">清除筛选</button>
            </div>
            <div class="concert-list">
                <div 
                    class="concert-item" 
                    v-for="concert in filteredConcerts" 
                    :key="concert.id"
                    @click="goToDetail(concert.id)"
                >
                    <div class="concert-img">
                        <img :src="concert.image" :alt="concert.name">
                        <div class="concert-tags">
                            <span class="tag" v-for="tag in concert.tags" :key="tag">{{ tag }}</span>
                        </div>
                    </div>
                    <div class="concert-info">
                        <h3 class="concert-title textOverflow1">{{ concert.name }}</h3>
                        <p class="concert-artist">艺人：{{ concert.artist }}</p>
                        <p class="concert-city">城市：{{ concert.city }}</p>
                        <p class="concert-venue">场馆：{{ concert.venue }}</p>
                        <p class="concert-date">时间：{{ concert.date }} {{ concert.time }}</p>
                        <div class="concert-price">
                            <span class="price-label">票价：</span>
                            <span class="price-value">¥{{ concert.price }}</span>
                            <span v-if="concert.maxPrice > concert.price"> - ¥{{ concert.maxPrice }}</span>
                        </div>
                    </div>
                    <div class="buy-btn-wrapper">
                        <button class="buy-btn">立即购票</button>
                    </div>
                </div>
                <div class="empty-state" v-if="filteredConcerts.length === 0">
                    <p>😢 暂无符合条件的演唱会</p>
                    <button class="reset-btn" @click="clearFilters">查看全部演唱会</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import concertData from '@/data/concert.js';

export default {
    name: 'Concert',
    created() {
        this.$store.commit('changeHt', '演唱会专区');
        this.hotRecommendations = concertData.hotRecommendations;
        this.allConcerts = concertData.concerts;
        this.artists = concertData.artists;
        this.cities = concertData.cities;
        this.filteredConcerts = [...this.allConcerts];
    },
    data() {
        return {
            hotRecommendations: [],
            allConcerts: [],
            filteredConcerts: [],
            artists: [],
            cities: [],
            selectedCity: 'all',
            selectedArtist: ''
        };
    },
    computed: {
        filteredArtists() {
            if (this.selectedCity === 'all') {
                return this.artists;
            }
            return this.artists.filter(artist => artist.city === this.selectedCity);
        }
    },
    methods: {
        goToDetail(id) {
            this.$router.push({
                name: 'concert_detail',
                params: {
                    concertId: id
                }
            });
        },
        filterByCity(cityName) {
            this.selectedCity = cityName;
            this.selectedArtist = '';
            this.applyFilters();
        },
        filterByArtist(artistName) {
            this.selectedArtist = artistName;
            this.applyFilters();
        },
        applyFilters() {
            let result = [...this.allConcerts];
            
            if (this.selectedCity !== 'all') {
                result = result.filter(concert => concert.city === this.selectedCity);
            }
            
            if (this.selectedArtist) {
                result = result.filter(concert => concert.artist === this.selectedArtist);
            }
            
            this.filteredConcerts = result;
        },
        clearFilters() {
            this.selectedCity = 'all';
            this.selectedArtist = '';
            this.filteredConcerts = [...this.allConcerts];
        }
    }
};
</script>

<style lang="scss" scoped>
@import '@/assets/sass/public.scss';

.concert-page {
    padding: 15px;
    background-color: #f5f5f5;
    min-height: 100vh;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    
    h2 {
        font-size: 18px;
        font-weight: bold;
        color: #333;
    }
    
    .more {
        font-size: 12px;
        color: #999;
        cursor: pointer;
    }
    
    .count {
        font-size: 12px;
        color: #999;
    }
}

.hot-recommend-section {
    background: #fff;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.hot-list {
    display: flex;
    overflow-x: auto;
    gap: 12px;
    padding-bottom: 5px;
    
    &::-webkit-scrollbar {
        height: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
        background: #ddd;
        border-radius: 2px;
    }
}

.hot-item {
    flex-shrink: 0;
    width: 160px;
    cursor: pointer;
    transition: transform 0.2s;
    
    &:hover {
        transform: translateY(-2px);
    }
    
    .img-wrapper {
        position: relative;
        width: 160px;
        height: 120px;
        border-radius: 6px;
        overflow: hidden;
        
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .tags {
            position: absolute;
            top: 8px;
            left: 8px;
            display: flex;
            gap: 4px;
            
            .tag {
                padding: 2px 6px;
                background: rgba(255, 87, 34, 0.9);
                color: #fff;
                font-size: 10px;
                border-radius: 3px;
            }
        }
    }
    
    .info {
        padding: 10px 0;
        
        .title {
            font-size: 14px;
            font-weight: bold;
            color: #333;
            margin-bottom: 4px;
        }
        
        .artist {
            font-size: 12px;
            color: #ff5722;
            margin-bottom: 4px;
        }
        
        .location, .date {
            font-size: 11px;
            color: #999;
            margin-bottom: 3px;
        }
        
        .price {
            margin-top: 6px;
            
            .label {
                font-size: 11px;
                color: #999;
            }
            
            .amount {
                font-size: 16px;
                font-weight: bold;
                color: #ff5722;
            }
        }
    }
}

.city-filter-section {
    background: #fff;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.city-filter {
    .city-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 15px;
    }
    
    .city-btn {
        padding: 6px 14px;
        border: 1px solid #e0e0e0;
        border-radius: 16px;
        background: #fff;
        font-size: 13px;
        color: #666;
        cursor: pointer;
        transition: all 0.2s;
        
        &:hover {
            border-color: #ff5722;
            color: #ff5722;
        }
        
        &.active {
            background: #ff5722;
            border-color: #ff5722;
            color: #fff;
        }
    }
    
    .artist-list {
        padding-top: 15px;
        border-top: 1px solid #f0f0f0;
        
        h3 {
            font-size: 13px;
            color: #666;
            margin-bottom: 10px;
        }
        
        .artist-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            
            .artist-tag {
                padding: 5px 12px;
                background: #f5f5f5;
                border-radius: 4px;
                font-size: 12px;
                color: #333;
                cursor: pointer;
                transition: all 0.2s;
                
                &:hover {
                    background: #fff3e0;
                    color: #ff5722;
                }
                
                .count {
                    color: #999;
                    font-size: 11px;
                }
            }
        }
    }
}

.concert-list-section {
    background: #fff;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.search-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    background: #fff8f5;
    border-radius: 6px;
    margin-bottom: 15px;
    
    .filter-info {
        font-size: 13px;
        color: #ff5722;
    }
    
    .clear-btn {
        padding: 4px 12px;
        border: 1px solid #ff5722;
        border-radius: 4px;
        background: #fff;
        color: #ff5722;
        font-size: 12px;
        cursor: pointer;
    }
}

.concert-list {
    .concert-item {
        display: flex;
        padding: 15px 0;
        border-bottom: 1px solid #f0f0f0;
        cursor: pointer;
        transition: background 0.2s;
        
        &:last-child {
            border-bottom: none;
        }
        
        &:hover {
            background: #fafafa;
        }
        
        .concert-img {
            position: relative;
            width: 120px;
            height: 90px;
            border-radius: 6px;
            overflow: hidden;
            flex-shrink: 0;
            
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            
            .concert-tags {
                position: absolute;
                top: 6px;
                left: 6px;
                display: flex;
                gap: 3px;
                
                .tag {
                    padding: 2px 5px;
                    background: rgba(255, 87, 34, 0.9);
                    color: #fff;
                    font-size: 9px;
                    border-radius: 2px;
                }
            }
        }
        
        .concert-info {
            flex: 1;
            padding: 0 15px;
            
            .concert-title {
                font-size: 15px;
                font-weight: bold;
                color: #333;
                margin-bottom: 6px;
            }
            
            .concert-artist, .concert-city, .concert-venue, .concert-date {
                font-size: 12px;
                color: #666;
                margin-bottom: 4px;
            }
            
            .concert-price {
                margin-top: 8px;
                
                .price-label {
                    font-size: 12px;
                    color: #999;
                }
                
                .price-value {
                    font-size: 18px;
                    font-weight: bold;
                    color: #ff5722;
                }
            }
        }
        
        .buy-btn-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            
            .buy-btn {
                padding: 10px 20px;
                background: linear-gradient(135deg, #ff5722, #ff7043);
                border: none;
                border-radius: 20px;
                color: #fff;
                font-size: 14px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.2s;
                box-shadow: 0 2px 8px rgba(255, 87, 34, 0.3);
                
                &:hover {
                    transform: scale(1.05);
                    box-shadow: 0 4px 12px rgba(255, 87, 34, 0.4);
                }
            }
        }
    }
    
    .empty-state {
        text-align: center;
        padding: 40px 0;
        
        p {
            font-size: 14px;
            color: #999;
            margin-bottom: 15px;
        }
        
        .reset-btn {
            padding: 8px 20px;
            background: #ff5722;
            border: none;
            border-radius: 4px;
            color: #fff;
            font-size: 13px;
            cursor: pointer;
        }
    }
}

.textOverflow1 {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>
