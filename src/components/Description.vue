<template>
  <transition :enter-active-class="enterActiveClass" :leave-active-class="leaveActiveClass" :duration="{enter: 1000, leave: 500}">
    <div class="description animated">
      <div class="close">
        <v-icon class="i-close" @click="$emit('show')">mdi-close</v-icon>
      </div>
      <div class="logo">
        <img :src="logo"/>
      </div>
      <div class="title">
        <h1>{{name}}</h1>
      </div>
      <div class="tag" v-if="tags.length !== 0">
        <span>标签：</span>
        <ul>
          <li v-for="(item,index) in tags" :key="index">{{item.name}}</li>
        </ul>
      </div>
      <div class="content">
        <p v-html="description(desc)"></p>
      </div>
    </div>
  </transition>
</template>
 
<script>
export default {
  name: "description",
  props: {
    name: {
      type: String,
      default: ""
    },
    logo: {
      type: String,
      default: ""
    },
    tags: {
      type: Array,
      default: () => []
    },
    desc: {
      type: String,
      default: ""
    },
    enterActiveClass: {
      type: String,
      default: 'slideInUp'
    },
    leaveActiveClass: {
      type: String,
      default: 'slideOutDown'
    }
  },
  methods: {
    description(str) {
      const re = /\n/g
      return str.replace(re, "<br>")
    }
  }
};
</script>
 
<style lang="scss" scoped>
.description {
  position: fixed;
  top: 56px;
  left: 0;
  right: 0;
  bottom: 0;
  padding-bottom: 75px;
  overflow: auto;
  background: #fff;
  z-index: 1000001;
  .close {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50px;
    .i-close {
      position: absolute;
      top: 0;
      right: 0;
      width: 50px;
      height: 50px;
      line-height: 50px;
      text-align: center;
      vertical-align: middle;
      font-size: 26px;
    }
  }
  .logo {
    width: 200px;
    margin: 80px auto 30px;
    border-radius: 4px;
    img {
      width: 200px;
      height: 200px;
      vertical-align: middle;
    }
  }
  .title {
    width: 90%;
    margin: 0 auto;
    padding: 0 0 20px;
    border-bottom: 1px solid #eee;
    h1 {
      font-size: 18px;
      text-align: center;
    }
  }
  .tag {
    display: flex;
    padding: 20px;
    height: 22px;
    line-height: 22px;
    span {
      display: inline-block;
      height: 22px;
    }
    ul {
      list-style: none;
      display: flex;
      padding: 0;
      flex: 1;
      li {
        margin: 0 4px;
        padding: 0 8px;
        height: 22px;
        line-height: 22px;
        background: #eee;
        border-radius: 8px;
        font-size: 12px;
      }
    }
  }
  .content {
    padding: 20px;
    p {
      font-size: 14px;
      line-height: 22px;
    }
  }
}
</style>