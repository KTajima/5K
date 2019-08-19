'use strict';
// スケジューラ用
const CronJob = require('cron').CronJob;

// テスト用
// // インスタンス
// var event;
// // 初期処理フラグ
// var isNew = 0;

var remind = null;

// // 初期処理用に以下のようなコードを追加すること。
module.exports = (robot) => {
  if (remind === null) {
    remind = new Remind(robot);
  }
  let job = () => {
    Object.entries(robot.brain.rooms()).map(([id, room]) => {
      robot.send({ room: id }, { text: "CRON TEST at " + id });
    });
  };
  //   動作チェック済み。ただし、実験のため一時コメントアウト。
//   new CronJob({
//     cronTime: '*/05 * * * * *',
//     onTick: () => job(),
//     timeZone: 'Asia/Tokyo'
//   }).start();
};

// const joinFunc = function (res) {
//     event.joinFunc(res);
// }

class Remind {
    // 初期処理は以下である。
    // 1. インスタントを作成する。
    // 2. ボット参加時にjoinFuncを呼び出す。
    // すると、リマインドできる。
    constructor(robot) {
        //　初期設定
        this.robot = robot;
        this.isReminded = false;
    }

    // トークルームへメッセージを飛ばす
    sayMsg(sendObj) {
        this.robot.send({ room: this.room }, { text: sendObj });
    }


    sendOrderMsg() {
        this.sayMsg('Hello in the remind');
    }

    // ボット参加時に呼び出す.
    joinFunc(res) {
        this.room = res.message.room;

        // スケジューラー(5秒間隔で)
        this.reminderjob = new CronJob({
            cronTime: '*/05 * * * * *',
            onTick: () => this.sendOrderMsg(),
            start: true,
            timeZone: 'Asia/Tokyo'
        });
    }


}
