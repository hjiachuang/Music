<template>
    <div>
        <default-header></default-header>
        <router-view/>
        <player v-if="$store.state.player.play_id !== ''"/>
    </div>
</template>

<script>
    import DefaultHeader from '../components/DefaultHeader'
    import Player from '../components/Player'
    export default {
        name: "playlist",
        components: {
            DefaultHeader,
            Player
        }
    }
</script>