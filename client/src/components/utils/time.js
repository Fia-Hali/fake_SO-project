export default function time(time){

    function addzero(time){
        if(time<10) return "0"+time;
        return time;
      }

    var yesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
    let text = time.toDateString();
    const t = text.split(' ');
    
    if(yesterday.getTime()>time.getTime()){ 
      //24 hours before
      if(yesterday.getFullYear()!== time.getFullYear()){
        return t[1]+" "+t[2]+","+t[3]+" at "+ addzero(time.getHours())+":"+addzero(time.getMinutes());
      }
      else return  t[1]+" "+t[2]+" at "+addzero(time.getHours())+":"+addzero(time.getMinutes());
    }
    else{
      var seconds = Math.floor((new Date() - time) / 1000);
      var interval = seconds / 31536000 / 2592000 / 86400;
      interval = seconds / 3600;
      if (interval > 1) {
        return Math.floor(interval) + " hours ago";
      }
      interval = seconds / 60;
      if (interval > 1) {
        return Math.floor(interval) + " minutes ago";
      }
      return Math.floor(seconds) + " seconds ago";
    }
  }