<template>
  <!-- 圆环图 -->
  <div class="circle-progress" :style="{width: size+'px', height: size+'px'}">
    <!-- canvas -->
    <canvas class="clientPie" ref="scoreCanvas" :width="size" :height="size">
      你的浏览器不支持 canvas，请升级你的浏览器。
    </canvas>
  </div>
</template>

<script>
export default {
  name: 'vue-round-progress',
  data () {
    return {
      context: "",   // canvas对象
      localValue: 0,  // 当前的Value值
    }
  },
  props: {
    // 圆环的值
    value: {
      type: Number,
      require: true
    },
    // 圆环的最大值
    maxValue: {
      type: Number,
      default: 100
    },
    // 圆环的直径大小,单位为px
    size: {
      type: Number,
      default: 225
    },
    // 边框线粗细,单位为px
    lineWidth: {
      type: Number,
      default: 20
    },
    // 有值部分的边框颜色
    lineColor: {
      type: String,
      default: "#ff9c38"
    },
    // 默认边框颜色
    lineColorDefault: {
      type: String,
      default: "#eeeeee"
    },
    // 有值的边框线虚线配置  [实线长度, 间隙长度]
    lineDash: {
      type: Array
    },
    // 默认边框线虚线配置  [实线长度, 间隙长度]
    lineDashDefault: {
      type: Array
    },
    // 起始角度，以时钟6点钟位置为0度计算
    startAge: {
      type: Number,
      default: 0
    },
    // 结束角度
    endAge: {
      type: Number,
      default: 360
    },
    // 圆环进度加载持续时间
    duration: {
      type: Number,
      default: 2000
    },
    // 是否显示value值文本
    showText: {
      type: Boolean,
      default: true
    },
    // value值文本的样式
    textStyle: {
      type: Object,
      default() {
        return {
          color: "#000",
          fontSize: "60px"
        }
      }
    }
  },
  computed: {
    // 根据传入的起始角度计算出的起始角度值
    _startAge() {
      return this._getAge(this.startAge);
    },
    // 根据传入的结束角度计算出的结束角度值
    _endAge() {
      return this._getAge(this.endAge);
    },
    // 圆环中心点位置
    _pieCenter() {
      return this.size / 2;
    },
    // 圆环半径
    _radius() {
      return (this.size - this.lineWidth) / 2;
    }
  },
  mounted() {
    // 绑定canvas对象到实例中
    const canvas = this.$refs.scoreCanvas;
    this._width = canvas.width;  // 获取canvas宽度
    this._height = canvas.height;  // 获取canvas高度
    if (!canvas.getContext) return;
    this.context = canvas.getContext("2d");

    // 渲染数值
    this._setPie(this.value);
  },
  destroyed() {
    // 组件销毁时移除定时器
    if(this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    // 渲染环形图
    _setPie(value) {
      if (!this.context) return;
      if(value == null || typeof(value) != 'number') {
        throw Error("vue-round-progress: 设置值请输入为数字类型");
        return;
      };
      
      const that = this;
      const context = that.context;

      // 有正在执行的定时器则先清空
      that.timer && clearInterval(that.timer);

      // 设置文本样式
      context.font = (that.textStyle.fontSize || "60px") + " sans-serif";
      context.fillStyle = that.textStyle.color || "#000";
      context.textAlign = "center";
      context.textBaseline = "middle";

      // 计算差值
      let diffValue = Math.abs(value - that.localValue);
      // 值未变化或重置到0
      if(diffValue == 0) {
        context.clearRect(0, 0, that._width, that._height);
        that.localValue = value;
        that._drawValue(value);
        return;
      }
      // 计算定时器多长时间执行一次
      let interval = that.duration / diffValue;
      interval > 100 && (interval = 100);  // 间隔时间太长的使用较短时间更新

      // 定时器绘制图形
      const add = value > that.localValue;
      let i = that.localValue;
      
      // 重置定时器
      that.timer = setInterval(function() {
        const condition = add ? i >= value : i <= value;
        if (condition) {
          // 设置当前的Value值
          that.localValue = value;
          // 清除渲染定时器
          clearInterval(that.timer);
        }
        context.clearRect(0, 0, that._width, that._height);
        that._drawValue(i);
        add ? i++ : i--;
      }, interval);
    },
    // 动态更改value值
    changeValue(value) {
      if(value == this.localValue) return;
      this._setPie(value);
    },
    // 重新设置value值，从0开始
    restart(value) {
      this.localValue = 0;
      if(value == undefined) {
        value = this.value;
      }
      this._setPie(value);
    },
    // 通过传入的角度值获取canvas能识别的角度值
    _getAge(initAge) {
      return (Math.PI / 180) * (initAge-270);
    },
    // 通过实际分数值计算当前分数对应的角度值
    _getScroeAge(scroe) {
      return this._getAge((scroe / this.maxValue) * (this.endAge - this.startAge) + this.startAge);
    },
    // 绘制数据的方法
    _drawValue(value) {
      let that = this;
      let context = that.context;

      // 绘制背景框
      context.beginPath();
      context.lineWidth = that.lineWidth;
      context.strokeStyle = that.lineColorDefault;
      that.lineDashDefault && context.setLineDash(that.lineDashDefault);  // [实线长度, 间隙长度]
      context.arc(that._pieCenter, that._pieCenter, that._radius, that._startAge, that._endAge);
      context.stroke();

      // 绘制分数值框
      var valueAge = that._getScroeAge(value);
      context.beginPath();
      context.lineWidth = that.lineWidth;
      context.strokeStyle = that.lineColor;
      that.lineDash && context.setLineDash(that.lineDash);  // [实线长度, 间隙长度]
      context.arc(that._pieCenter, that._pieCenter, that._radius, that._startAge, valueAge);
      context.stroke();

      // 绘制分数值
      that.showText && context.fillText(value, that._pieCenter, that._pieCenter);
    }
  }
}
</script>

<style>
div, span, p, label {
  margin: 0;
  padding: 0;
}
.circle-progress {
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
}
.circle-progress .clientPie {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
}
</style>
