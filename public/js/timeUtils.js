class TimeUtils {
    static today() {
        let dateString = new Date().toISOString()
        return dateString.slice(0,dateString.indexOf('T'))
    }

    static now() {
        let date = new Date()
        let hours = ('00'+date.getHours()).slice(-2)
        let minutes = ('00'+date.getMinutes()).slice(-2)
        return hours+':'+minutes
    }
}
