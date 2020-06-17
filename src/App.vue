<template>
  <v-app v-loading.fullscreen="loading">
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name: 'app',
    computed: {
      ...mapState({
        loading: state => state.load.loading
      })
    }
  }
</script>
