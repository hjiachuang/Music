<template>
    <v-app-bar color="white" :elevation="0">
        <v-tabs optional centered color="black" slider-size="1">
            <v-tab to="/rank">排行</v-tab>
            <v-tab to="/recommend">推荐</v-tab>
            <v-tab to="/search">搜索</v-tab>
        </v-tabs>
    </v-app-bar>
</template>

<script>
export default {
    name: "IndexHeader",
    methods: {
        toPage(link) {
            this.$router.push(link)
        }
    }
}
</script>

<style lang="scss" scoped>
@font-face {
    font-family: '源柔ゴシック';
    src: url('../../public/fonts/mine/源柔ゴシック-Part.ttf');
}
.v-tab {
    font-family: '源柔ゴシック';
    font-size: 16px;
    &.v-tab--active {
        font-size: 18px;
        font-weight: 800;
    }
}
</style>