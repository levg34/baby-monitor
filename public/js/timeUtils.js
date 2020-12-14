class TimeUtils {
    static today() {
        let dateString = new Date().toISOString()
        return dateString.slice(0,dateString.indexOf('T'))
    }

    static now() {
        let dateString = new Date().toISOString()
        return dateString.slice(dateString.indexOf('T')+1,dateString.lastIndexOf(':'))
    }
}
