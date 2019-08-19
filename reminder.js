'use strict';
// スケジューラ用
const CronJob = require('cron').CronJob;

// テスト用
// // インスタンス
// var event;
// // 初期処理フラグ
// var isNew = 0;

// // 初期処理用に以下のようなコードを追加すること。
// module.exports = (robot) => {
//     // 書き換えた方がいいかもしれない。初期処理用に一回だけ実行する。
//     if (isNew == 0) {
//         event = new Remind(robot);
//         isNew = 1
//     }
//     // 以下はうまく動かない
//     // robot.brain.once('loaded', () => {
//     //     event = new Event(robot);
//     // });
//     robot.join((res) => event.joinFunc(res));
// };

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

    register_
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