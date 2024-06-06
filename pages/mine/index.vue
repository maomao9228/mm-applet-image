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
				const _this = this;
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