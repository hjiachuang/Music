const artists = (arr) => {
    return arr.reduce((sum, v, i) => {
        if(i !== arr.length - 1) {
            return sum + v.name + " / "
        }else {
            return sum + v.name
        }
    }, "")
}

export default {
    artists
}