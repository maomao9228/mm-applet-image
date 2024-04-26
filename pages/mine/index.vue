<template>
	<view class="downloadHome">
		<block v-for="(url,inx) in compressImages" :key="inx">
			<image
				:src="url"
				mode="widthFix"
			/>
		</block>
		<button class="btn" @click="downLoadImg">下载压缩图</button>
	</view>
</template>

<script>
	export default {
		data(){
			return {
				compressImages: []
			}
		},
		onShow() {
			this.compressImages = uni.getStorageSync('compressImages')
		},
		methods: {
			downLoadImg(){
				if(this.compressImages.length){
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
				}
			}
		},
	}
</script>

<style scoped lang="less">
.downloadHome {
	image {
		width: 100vw;
	}
	.btn {
		position: fixed;
		width: 100%;
		left: 0;
		bottom: 0;
	}
}
</style>