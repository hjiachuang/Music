<template>
  <div class="rolling-subtitles father" :ref="father">
    <div class="children" :ref="children">{{text}}</div>
  </div>
</template>
 
<script>
export default {
  name: "RollingSubtitles",
  data() {
    return {
      rollIntervalTimer: null,
      rollTimeoutTimer: null
    };
  },
  computed: {
    children() {
      let id =
        "children" +
        Math.random()
          .toString()
          .substring(5, 15);
      while (this.$refs.id) {
        id =
          "children" +
          Math.random()
            .toString()
            .substring(5, 15);
      }
      return id;
    },
    father() {
      let id =
        "father" +
        Math.random()
          .toString()
          .substring(5, 15);
      while (this.$refs.id) {
        id =
          "father" +
          Math.random()
            .toString()
            .substring(5, 15);
      }
      return id;
    }
  },
  props: {
    text: {
      type: String,
      default: "轮播字幕组件"
    },
    fontSize: {
      type: String,
      default: "14px"
    },
    fontWeight: {
      type: Number,
      default: 400
    },
    loop: {
      type: Boolean,
      default: true
    },
    speed: {
      type: Number,
      default: 20
    }
  },
  mounted() {
    this.init();
    this.roll();
  },
  methods: {
    init() {
      const children  = this.$refs[this.children];
      children.style.fontWeight = this.fontWeight;
      children.style.fontSize = this.fontSize;
    },
    roll() {
      clearInterval(this.rollTimer);
      const father = this.$refs[this.father], children = this.$refs[this.children];
      const fatherWidth = father.clientWidth;
      const childrenWidth = children.scrollWidth;
      if (Math.abs(childrenWidth - fatherWidth) <= 1) {
        return;
      }
      const time = childrenWidth / this.speed;
      this.rollTimer = setInterval(() => {
        children.style.transition = `all ${time}s linear`;
        children.style.transform = `translate3d(${-childrenWidth}px, 0, 0)`;
        this.rollTimeoutTimer = setTimeout(() => {
          children.style.transition = "all 0s";
          children.style.transform = `translate3d(${fatherWidth}px,0,0)`;
        }, (time + 0.5) * 1000);
      }, (time + 1) * 1000);
    }
  }
};
</script>
 
<style lang="scss" scoped>
.father {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .children {
    height: 100%;
    text-align: left;
    line-height: 20px;
    white-space: nowrap;
    transition: all 0s;
    transform: translate3d(0, 0, 0);
  }
}
</style>