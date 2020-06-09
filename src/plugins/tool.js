const time = (format = 'Y-M-D', date=null) => {
  let dt, year, Month, month, Day, day, Hour, hour, Min, min, Sec, sec, wek
  if (date) {
      dt = new Date(date)
  }else {
      dt = new Date()
  }
  year = dt.getFullYear();
  Month = dt.getMonth() + 1 >= 10 ? dt.getMonth() + 1 : "0" + (dt.getMonth() + 1);
  month = dt.getMonth() + 1;
  Day = dt.getDate() >= 10 ? dt.getDate() : "0" + dt.getDate();
  day = dt.getDate();
  Hour = dt.getHours() >= 10 ? dt.getHours() : "0" + dt.getHours();
  hour = dt.getHours();
  Min = dt.getMinutes() >= 10 ? dt.getMinutes() : "0" + dt.getMinutes();
  min = dt.getMinutes();
  Sec = dt.getSeconds() >= 10 ? dt.getSeconds() : "0" + dt.getSeconds();
  sec = dt.getSeconds();
  wek = dt.getDay();
  switch (wek) {
      case 0: wek = "日"; break;
      case 1: wek = "一"; break;
      case 2: wek = "二"; break;
      case 3: wek = "三"; break;
      case 4: wek = "四"; break;
      case 5: wek = "五"; break;
      case 6: wek = "六"; break;
  }
  format = format.replace('Y', year).replace('M', Month).replace('m', month).replace('D', Day).replace('d', day).replace('H', Hour).replace('h', hour).replace('I', Min).replace('i', min).replace('S', Sec).replace('s', sec).replace('w', wek)
  return format
}

export default {
  install(Vue) {
    Object.defineProperties(Vue.prototype, {
      $time: {
        get() {
          return time
        }
      },
    });
  }
};