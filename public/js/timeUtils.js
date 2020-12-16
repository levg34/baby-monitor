class TimeUtils {
    static today() {
        return this.jsDateToDateString(new Date())
    }

    static now() {
        let date = new Date()
        let hours = ('00'+date.getHours()).slice(-2)
        let minutes = ('00'+(Math.floor(date.getMinutes()/5)*5)).slice(-2)
        return hours+':'+minutes
    }

    static jsDateToDateString(date) {
        let dateString = date.toISOString()
        return dateString.slice(0,dateString.indexOf('T'))
    }

    static localeDate(date,locale) {
        if (!date) {
            date = this.today()
        }
        return new Intl.DateTimeFormat(locale).format(new Date(date))
    }

    static nDaysFrom(date,days) {
        var oldDay = date ? new Date(date) : new Date()
        oldDay.setDate(oldDay.getDate() - days)
        return this.jsDateToDateString(oldDay)
    }

    static oneWeekFrom(date) {
        return this.nDaysFrom(date,7)
    }

    static dayBefore(date) {
        return this.nDaysFrom(date,1)
    }

    static oneWeekInterval(date) {
        return [this.oneWeekFrom(date),this.dayBefore(date)]
    }
}
