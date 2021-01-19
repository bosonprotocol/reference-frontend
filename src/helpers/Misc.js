export function GetToday(increment = 0) {
  let d = new Date()
  let future = new Date(d)
  future.setDate(future.getDate() + increment)

  let month = '' + (future.getMonth() + 1)
  let day = '' + future.getDate()
  let year = future.getFullYear()

  if (month.length < 2)
      month = '0' + month;
  if (day.length < 2)
      day = '0' + day;

  return [year, month, day].join('-');
}