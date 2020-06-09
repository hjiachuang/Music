<template>
    <div>
        <index-header></index-header>
        <router-view/>
        <player v-if="$store.state.player.play_id !== ''"/>
    </div>
</template>

<script>
    import IndexHeader from '../components/IndexHeader'
    import Player from '../components/Player'
    export default {
        components: {
            IndexHeader,
            Player
        }
    }
</script>