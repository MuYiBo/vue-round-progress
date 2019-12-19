import vueRoundProgress from './vue-round-progress.vue'

// 导出模块
export default vueRoundProgress

//global 情况下 自动安装
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component('vue-round-progress', vueRoundProgress)
}