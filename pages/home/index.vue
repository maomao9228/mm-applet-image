<template>
    <view class="home">
        <scroll-view class="scrollView"  :scroll-y="true">
            <view class="swiper-item" v-for="(item, index) in urlList" :key="index">
                    <image :src="item" mode="widthFix"></image>
                </view>
        </scroll-view>
        <view class="btn">
            <view class="quality">
                <text>图片质量</text>
                <slider class="slider" :value="quality" @change="sliderChangeEvent" min="1" max="100" show-value />
            </view>
            <button @click="uploadImg">上传图片</button>
            <view style="height: 26rpx;"></view>
            <button @click="dealImage">压缩图片</button>
        </view>
        
    </view>
</template>

<script>
    export default {
        data() {
            return {
                urlList: [],
                quality: 50,
                compressImages: []
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
                uni.chooseImage({
                        count: 9,
                        mediaType: ['image'],
                        sourceType: ['album','camera'],
                        sizeType:[ 'compressed'], // 选择压缩图片
                        success:  (res) => {
                            console.log('chooseImage', res);
                            this.urlList = res.tempFilePaths;
                            // uni.saveImageToPhotosAlbum({
                            //     filePath: res.tempFilePaths[0],
                            //     success: function () {
                            //         console.log('save success');
                            //     }
                            // });
                            // wx.getImageInfo({
                            //         src: res.tempFilePaths[0],
                            //         success:(res)=>{
                            //             console.log('[1--------- imgInfo ] >', res)
                                        
                            //         },
                            //     })
                        }
                    });
            },
            dealImage() {
                if(!this.urlList.length) {
                    uni.showToast({
                    title: '请先上传图片',
                    duration: 2000,
                    icon: 'none'
                });
                    return
                };
                let compressImages = [];
                uni.showLoading({
                    title: '压缩中···'
                });
                this.urlList.forEach(item => {
                    // 压缩图片
                    uni.compressImage({
                        src: item,
                        quality: this.quality || 50,
                        success: res => {
                            console.log(res.tempFilePath)
                            compressImages.push(res.tempFilePath);
                      
                            this.compressImages = compressImages;
                            uni.setStorageSync('compressImages', compressImages);
                        }
                    })
                })
                uni.hideLoading();
            }
        },
    }
</script>

<style scoped lang="scss">
.home {
    padding-bottom: 300rpx;
    box-sizing: border-box;
    .scrollView {
				width: 100vw;
				height: 100%;
                overflow-y: auto;

				.swiper-item {
					position: relative;
				}
				image {
					width: 100vw;
					// height: 300rpx;
                    // display: inline-block;

				}
			}
                .btn {
                    position: fixed;
                    width: 100%;
                    left: 0;
                    bottom: 0;
                    .quality {
                        padding: 26rpx; box-sizing: border-box;
                        width: 100%;
                        display: flex;
                        align-items: center;
                        .text {
                            font-size: 26rpx;
                            width: 100rpx;
                        }
                        .slider {
                            flex: 1;
                            width: 0;
                        }
                    }
                }
}
</style>