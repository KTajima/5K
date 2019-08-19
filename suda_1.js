// Description:
//   Utility commands surrounding Hubot uptime.
//
// Commands:
//   ping - Reply with pong
//   echo <text> - Reply back with <text>
//   time - Reply with current time
'use strict';

var balance_yen = 20000;

module.exports = (robot) => {
  robot.respond(/情報/i, (res) => {

class data{
  constructor( id, name,total,desc,date,deadline,balance,split,period) {
    this.id = id;
    this.name = name;
    this.total = total;
    this.desc = desc;
    this.date = date;
    this.deadline = deadline;
    this.balance = balance;
    this.split = split;
    this.period = period;
  }

  getName() {
    return this.name;
}

}

var user1 = new data(1,"はる",20000,"お茶会",20190908,201909030,balance_yen,2,1);

test = console.log(user1.getName());

  res.send(test);
});
};
