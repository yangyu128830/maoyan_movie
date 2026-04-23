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

        <div class="quick-cards">
            <div class="quick-card balance-card" @click="goToBalance">
                <div class="card-icon">
                    <span>💳</span>
                </div>
                <div class="card-content">
                    <h3>我的余额</h3>
                    <p class="card-value">¥{{balanceInfo.balance}}</p>
                </div>
                <div class="card-arrow">
                    <span>›</span>
                </div>
            </div>

            <div class="quick-card points-card" @click="goToPoints">
                <div class="card-icon">
                    <span>⭐</span>
                </div>
                <div class="card-content">
                    <h3>消费积分</h3>
                    <p class="card-value">{{pointsInfo.points}}积分</p>
                </div>
                <div class="card-arrow">
                    <span>›</span>
                </div>
            </div>

            <div class="quick-card records-card" @click="goToRecords">
                <div class="card-icon">
                    <span>📋</span>
                </div>
                <div class="card-content">
                    <h3>消费记录</h3>
                    <p class="card-value">{{consumeRecords.length}}笔</p>
                </div>
                <div class="card-arrow">
                    <span>›</span>
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
            balanceInfo: {
                balance: 1286.50,
                totalIncome: 3500,
                totalExpense: 2213.50
            },
            pointsInfo: {
                points: 2580,
                totalEarned: 5680,
                totalUsed: 3100
            },
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
        goToBalance() {
            this.$router.push({
                path: '/balance',
                name: 'balance'
            });
        },
        goToPoints() {
            this.$router.push({
                path: '/points',
                name: 'points'
            });
        },
        goToRecords() {
            this.$router.push({
                path: '/records',
                name: 'records'
            });
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
    width: 70px;
    height: 70px;
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
    font-size: 18px;
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

.quick-cards {
    display: flex;
    gap: 10px;
    padding: 15px;
    margin-top: -15px;
    position: relative;
    z-index: 1;
}

.quick-card {
    flex: 1;
    background: #fff;
    border-radius: 12px;
    padding: 15px;
    display: flex;
    align-items: center;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:active {
        transform: scale(0.98);
        box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
    }

    .card-icon {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 12px;
        font-size: 20px;
    }

    &.balance-card .card-icon {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }

    &.points-card .card-icon {
        background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
    }

    &.records-card .card-icon {
        background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
    }

    .card-content {
        flex: 1;
    }

    .card-content h3 {
        font-size: 13px;
        color: #666;
        margin-bottom: 4px;
        font-weight: normal;
    }

    .card-value {
        font-size: 16px;
        color: #333;
        font-weight: bold;
    }

    .card-arrow {
        color: #ccc;
        font-size: 20px;
    }
}

.user-info-card {
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
        padding: 10px 0;
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

.confirm-btn {
    background: #E54847;
    color: #fff;
}
</style>
