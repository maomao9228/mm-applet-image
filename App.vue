<script>
export default {
	globalData: {
		baseUrl: '',
	},
	data() {
		return {
			updateManager: null // updateManager，用于管理小程序更新
		};
	},
	computed: {},
	methods: {
		/**
		 * 跟新小程序
		 */
		updateReady() {
			const _this = this;
			this.updateManager.onUpdateReady(res => {
				uni.showModal({
					title: '更新提示',
					content: '新版本已经准备好，是否重启应用？',
					success(res) {
						if (res.confirm) {
							// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
							_this.updateManager.applyUpdate();
						}
					}
				});
			});

			// 新的版本下载失败
			this.updateManager.onUpdateFailed(res => {
				// 新的版本下载失败
				uni.showToast({
					title: '版本下载失败',
					icon: 'none',
					duration: 2000
				});
			});
		},

	},
	onLoad(options) {

	},
	onLaunch: function(options) {
		// updateManager，用于管理小程序更新。
		this.updateManager = uni.getUpdateManager();

		// 请求完新版本信息
		this.updateManager.onCheckForUpdate(res => {
			// 请求完新版本信息的回调
			if (res.hasUpdate) {
				this.updateReady();
			}
		});



		if (process.env.NODE_ENV === 'development') {
			// 本地环境
			// this.globalData.baseUrl = 'http://192.168.1.84:7085';
			// this.globalData.baseUrl = 'https://tjservicetest.xinguoren.cn';
			this.globalData.baseUrl = 'https://tjservice.xinguoren.cn';
		} else {
			//生产环境
			this.globalData.baseUrl = 'https://tjservice.xinguoren.cn';
			// this.globalData.baseUrl = 'https://tjservicetest.xinguoren.cn';
		}
	},

	onShow: function(options) {
 
	},
	onHide: function() {
		// console.log('App Hide');
	}
};
</script>

<style lang="scss">
@import url('./static/iconfont/iconfont.css');

/*每个页面公共css */
::-webkit-scrollbar {
	display: none;
	width: 0;
	height: 0;
	color: transparent;
}

html,
body,
page,
#app {
	// height: 100%;
	width: 100%;
	background: #f6f6f6;
	// background-color: #f5f5f5;
	// overflow: hidden;
}
page {
	box-sizing: border-box;
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);
	.globalBackgroundColor {
		background-color: #f5f5f5;
	}
}
</style>
