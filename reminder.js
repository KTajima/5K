'use strict';
// 使用するモジュール
const CronJob = require('cron').CronJob;
require('date-utils');

// var event;

// module.exports = (robot) => {
//     // インスタンスがなければ作成する。
//     if (!event) {
//         event = new Remind(robot);
//     }
//     robot.respond(/START$/i, (res) => {
//         event.startReminder()
//         event.sayMsg('startしました')
//     });

//     robot.respond(/STOP$/i, (res) => {
//         event.stopReminder()
//         event.sayMsg('stopしました')
//     });

//     // ボット参加
//     robot.join((res) => event.joinFunc(res));
// };

class Remind {
    // 初期処理は以下である。*********************
    // 1. インスタントを作成する。
    // 2. ボット参加時にjoinFuncを呼び出す。
    // すると、リマインドできる。
    // 1. コンストラクター
    constructor(robot) {
        // 初期設定
        this.robot = robot;
        // 二重処理防止用のフラグ
        this.isReminded = false;
        this.reminderjob = null;
    }

    // 2. ボット参加時に呼び出す.
    joinFunc(res) {
        this.room = res.message.room;
    }


    // スケジューラ関連***************************
    //
    // リマインダを止める
    stopReminder() {
        if (this.reminderjob) {
            this.reminderjob.stop();
        }
    }
    // リマインダを有効にする
    startReminder() {
        this.comparedDate = new Date
        if (!this.reminderjob) {
            // スケジューラー(5秒間隔で)
            this.reminderjob = new CronJob({
                cronTime: '*/05 * * * * *',
                onTick: () => this.checkChangeDay(),
                start: true,
                timeZone: 'Asia/Tokyo'
            });
        } else {
            this.reminderjob.start();
        }
    }
    // 日付が変わったか判定する. スケジューラにより呼び出される。
    // テスト用に分が変わっているか判定している。
    checkChangeDay() {
        require('date-utils');
        let now = new Date;
        if (now.getMinutes() != this.comparedDate.getMinutes()) {
            // 二重処理防止
            if (!this.isReminded) {
                this.isReminded = true;
                this.publishReminder(null);
                this.isReminded = false;
            }
        }
        this.comparedDate = now;
    }


    // 発行機能**************************************
    //
    // 強制的にリマインダを発行する
    publishReminder(item) {
        this.sendOrderMsg()
    }
    // トークルームへメッセージを飛ばす
    sayMsg(sendObj) {
        this.robot.send({ room: this.room }, { text: sendObj });
    }


    // テスト用 いずれは削除される。
    //
    //
    sendOrderMsg() {
        this.sayMsg('Hello in the remind');
    }
}