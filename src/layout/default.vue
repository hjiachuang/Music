<template>
    <div>
        <playlist-header></playlist-header>
        <router-view/>
        <player v-if="$store.state.player.play_id !== ''"/>
    </div>
</template>

<script>
    import PlaylistHeader from '../components/PlaylistHeader'
    import Player from '../components/Player'
    export default {
        name: "playlist",
        components: {
            PlaylistHeader,
            Player
        }
    }
</script>