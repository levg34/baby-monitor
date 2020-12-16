class TimeUtils {
    static today() {
        let dateString = new Date().toISOString()
        return dateString.slice(0,dateString.indexOf('T'))
    }

    static now() {
        let date = new Date()
        let hours = ('00'+date.getHours()).slice(-2)
        let minutes = ('00'+(Math.floor(date.getMinutes()/5)*5)).slice(-2)
        return hours+':'+minutes
    }

    static localeDate(date,locale) {
        if (!date) {
            date = this.today()
        }
        return new Intl.DateTimeFormat(locale).format(new Date(date))
    }
}
