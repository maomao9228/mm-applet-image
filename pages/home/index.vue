<template>
    <view class="home">
        <view class="option">
            <label class="radio" @click="checked = 'r1'"><radio value="r1" :checked="checked == 'r1'" />原图</label>
            <label class="radio" @click="checked = 'r2'"><radio value="r2" :checked="checked == 'r2'"/>压缩图</label>
            <label class="radio" @click="checked = 'r3'"><radio value="r3" :checked="checked == 'r3'"/>对比</label>
        </view>
        <view class="imgBox">
            <view class="imgList" v-if="urlList.length">
                <view v-if="checked == 'r1'" class="originalImgs">
                    <view class="imageBox" v-for="(item, index) in urlList" :key="index">
                        <image v-if="item" @click="previewImg(urlList)" :src="item" mode="widthFix"></image>
                        <text class="noImg" v-else>压缩失败</text>
                    </view>
                </view>
                <view  v-if="checked == 'r2'" class="compressImages">
                    <view class="imageBox" v-for="(item, index) in compressImages" :key="index">
                        <image  v-if="item" @click="previewImg(compressImages)" :src="item" mode="widthFix"></image>
                        <text  class="noImg" v-else>压缩失败</text>
                    </view>
                </view>
                <view  v-if="checked == 'r3'" class="comparisonImgs">
                    <view class="comparisonImgsBox">
                        <view class="imageBox" v-for="(item, index) in urlList" :key="index">
                            <image v-if="item"  @click="previewImg(index, true)" :src="item" mode="widthFix"></image>
                            <text class="noImg" v-else>压缩失败</text>
                        </view>
                    </view>
                    <view class="comparisonImgsBox">
                        <view class="imageBox" v-for="(item, index) in compressImages" :key="index">
                            <image  v-if="item"  @click="previewImg(index, true)" :src="item" mode="widthFix"></image>
                            <text  class="noImg" v-else>压缩失败</text>
                        </view>
                    </view>
                    </view>
            </view>
            <view v-else class="noData">请上传图片</view>
        </view>
        <view class="imgPer">
            <text>压缩比</text>
            <slider class="slider" :value="quality" @change="sliderChangeEvent" min="1" max="100" activeColor="#3A52D7" backgroundColor="#F5F7FB" block-color="#3A52D7" block-size="18"/>
            <text style="color: #3A52D7;">{{ quality }}%</text>
        </view>
        <view class="btnBox">
            <text  @click="uploadImg">上传</text>
            <text  @click="dealImage(0)">压缩</text>
            <text @click="downLoadImg">下载</text>
        </view>
        
    </view>
</template>

<script>
    export default {
        data() {
            return {
                urlList: [],
                quality: 50,
                compressImages: [],
                checked: 'r1'
            }
        },
        onLoad(options) {
            uni.removeStorageSync('compressImages');
        },
        methods: {
            sliderChangeEvent(e){
                this.quality = e.detail.value;
                console.log(e, this.quality);
            },
            uploadImg() {
                this.checked = 'r1';
                uni.showLoading({
                    title: '上传中···'
                });
                uni.chooseImage({
                        count: 9,
                        mediaType: ['image'],
                        sourceType: ['album','camera'],
                        sizeType:[ 'compressed'], // 选择压缩图片
                        success:  (res) => {
                            console.log('chooseImage', res);
                            this.urlList = res.tempFilePaths;
                        },
                        complete:(complete)=>{
                            uni.hideLoading();
                        },
                    });
            },
            dealImage(val) {
                if(this.urlList.length == val){
                    uni.setStorageSync('compressImages', this.compressImages);
                    uni.hideLoading();
                    return
                }
                if(!this.urlList.length) {
                    uni.showToast({
                        title: '请先上传图片',
                        duration: 2000,
                        icon: 'none'
                    });
                    return
                };
                if(val == 0){
                    this.compressImages = [];
                    uni.showLoading({
                        title: '压缩中···'
                    });
                }
                uni.compressImage({
                        src: this.urlList[val],
                        quality: this.quality || 50,
                        success: res => {
                            console.log(res.tempFilePath)
                            this.compressImages.push(res.tempFilePath);
                            this.dealImage(val + 1);
                        },
                        fail:(fail)=>{
                            this.compressImages.push(null);
                            this.dealImage(val + 1);
                        },
                    })
            },
            downLoadImg(){
                if(!this.urlList.length) {
                    uni.showToast({
                        title: '请先上传图片',
                        duration: 2000,
                        icon: 'none'
                    });
                    return
                };
				const _this = this;
                if(!this.compressImages.length){
                    uni.showToast({
                        title: '请先压缩图片',
                        duration: 2000,
                        icon: 'none'
                    });
                    return
                }
				if(this.compressImages.length){
					wx.getSetting({
					  success(res) {
					    if (!res.authSetting['scope.writePhotosAlbum']) {
					      // 用户未授权
					      wx.authorize({
					        scope: 'scope.writePhotosAlbum',
					        success() {
					          // 用户已授权，可以获取用户信息
					          _this.downLoadImg2();
					        }
					      });
					    } else {
							_this.downLoadImg2();
					    }
					  }
					});
				}
			},
			downLoadImg2(){
				this.compressImages.forEach((path) => {
							wx.getImageInfo({
							src: path,
							success:(res)=>{
								console.log('[ 2---------imgInfo ] >', res)
										uni.saveImageToPhotosAlbum({
										filePath: res.path,
										success: function () {
											console.log('save success');
										}
									});
							},
						})
				})
			},
            previewImg(url, val){
                uni.previewImage({
                    urls: val ? [this.urlList[url],this.compressImages[url]] : url,
                    fail: (res) => {
                        uni.showToast({
                            title: '预览失败',
                            duration: 3000,
                            icon: 'none'
                        })
                    }
                });

            }
        },
    }
</script>

<style scoped lang="scss">
.home {
    width: 100vw;
    height: 100%;
    background-color: #F5F5F5;
    display: flex;
    flex-direction: column;
    padding: 26rpx;
    box-sizing: border-box;
    .option {
        display: flex;
        align-items: center;
        justify-content: space-around;
        background: #FFFFFF;
        height: 80rpx;
        padding: 20rpx;
        box-sizing: border-box;
        margin-bottom: 20rpx;
        border-radius: 10rpx;

    }
    .imgBox {
        width: 100%;
        flex: 1;
        height: 0;
        overflow-y: hidden;
        background: #FFFFFF;
        border-radius: 10rpx;
        padding: 20rpx;
        box-sizing: border-box;
        .imgList{
            width: 100%;
            height: 100%;
            background: #F5F7FB;
            .originalImgs,.compressImages {
                width: 100%;
                height: 100%;
                overflow-y: auto;
                .imageBox {
                    border: 1rpx dotted rgba(58, 82, 215, 0.8);
                    padding: 10rpx;
                    box-sizing: border-box;
                    margin-bottom: 20rpx;
                    border-radius: 10rpx;
                    image {
                        width: 100%;
                        vertical-align: bottom;
                    }
                    .noImg {
                        width: 100%;
                        text-align: center;
                        height: 100rpx;
                    }
                }
            }
            .comparisonImgs {
                width: 100%;
                height: 100%;
                display: flex;
                // align-items: center;
                justify-content: space-between;
                overflow-y: auto;
                .comparisonImgsBox {
                    width: 48%;
                    .imageBox {
                        border: 1rpx dotted rgba(58, 82, 215, 0.8);
                        padding: 10rpx;
                        box-sizing: border-box;
                        margin-bottom: 20rpx;
                        border-radius: 10rpx;
                        width: 100%;
                        image {
                            width: 100%;
                            vertical-align: bottom;
                        }
                        .noImg {
                            width: 100%;
                            text-align: center;
                            height: 100rpx;
                        }
                    }
                }
            }
        }
        .noData{
            width: 100%;
            height: 100%;
            text-align: center;
            padding-top: 30vh;
            box-sizing: border-box;
            color: #3A52D7;
            font-size: 36rpx;
            background: #F5F7FB;

        }
    }
    .imgPer {
        width: 100%;
        height: 80rpx;
        display: flex;
        align-items: center;
        background: #FFFFFF;
        margin: 20px 0;
        padding: 0rpx 20rpx;
        box-sizing: border-box;
        border-radius: 10rpx;

            .text {
                font-size: 26rpx;
                width: 100rpx;
            }
            .slider {
                flex: 1;
                width: 0;
            }
    }
    .btnBox {
        width: 100%;
        background: #FFFFFF;
        padding: 20rpx 26rpx 56rpx;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: 10rpx;

        text {
            display: inline-block;
            width: 32%;
            height: 88rpx;
            border-radius: 14rpx;
            text-align: center;
            line-height: 88rpx;
            font-size: 34rpx;
            color: #FFFFFF;
            background: #3A52D7;
        }
    }

    // padding-bottom: 300rpx;
    // box-sizing: border-box;
    // .scrollView {
    //     width: 100vw;
    //     height: 100%;
    //     overflow-y: auto;

    //     .swiper-item {
    //         position: relative;
    //     }
    //     image {
    //         width: 100vw;
    //         // height: 300rpx;
    //         // display: inline-block;

    //     }
    // }
    // .btn {
    //     position: fixed;
    //     width: 100%;
    //     left: 0;
    //     bottom: 0;
    //     .quality {
    //         padding: 26rpx; box-sizing: border-box;
    //         width: 100%;
    //         display: flex;
    //         align-items: center;
    //         .text {
    //             font-size: 26rpx;
    //             width: 100rpx;
    //         }
    //         .slider {
    //             flex: 1;
    //             width: 0;
    //         }
    //     }
    // }
}
</style>