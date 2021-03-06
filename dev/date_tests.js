let dateString = new Date().toISOString()
dateString.slice(0,dateString.indexOf('T')) // YYYY-MM-DD
dateString.slice(dateString.indexOf('T')+1,dateString.lastIndexOf(':')) // hh:mm
dateString.slice(dateString.indexOf('T')+1,dateString.lastIndexOf('.')) // hh:mm:ss

const japanese = new Intl.Locale('ja-Jpan-JP-u-ca-japanese-hc-h12');
console.log(new Date().toLocaleString(japanese)) // "R2/12/14 午後9:53:16"
Intl.DateTimeFormat('ja-JA-u-ca-japanese', {era:'long'}).format(new Date()) // "令和2年12月17日"
Intl.DateTimeFormat('ja-u-ca-japanese', {era:'long'}).format(new Date()) // "令和2年12月17日"
