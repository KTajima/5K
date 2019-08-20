'use strict';
// 使用するモジュール
const CronJob = require('cron').CronJob;
require('date-utils');

// // 使用例
// var event;
// module.exports = (robot) => {
//     if (!event) {
//         event = new Remind(robot);
//     }
//     robot.respond(/START$/i, (res) => {
//         event.startReminder();
//     });

//     robot.respond(/STOP$/i, (res) => {
//         event.stopReminder();
//     });

//     robot.respond(/REGISTER$/i, (res) => {
//         var user = []
//         var user1 = { "相手": "上原さん", "期限": new Date, "一回あたりの額": 1000 }
//         user.push(user1)
//         robot.brain.set(res.message.user.name.toLowerCase(), user);
//     });
// };

// リマインドを担当するクラス
// 一つのインスタンスを作成したあと
// startReminder()を呼び出すと日付が変わるとリマインドが発行される。
// stopReminder()を呼び出すとリマインダを実行しない。
class Remind {
    // 初期処理は以下の通り*********************
    constructor(robot) {
        // 初期設定
        this.robot = robot;
        // 二重処理防止用のフラグ
        this.isReminded = false;
        // スケジューラ
        this.reminderjob = null;
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
        this.comparedDate = new Date;
        console.log("Hello")
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
    checkChangeDay() {
        console.log("Hello")
        require('date-utils');
        let now = new Date;
        if (now.getDate() != this.comparedDate.getDate()) {
            // 二重処理防止
            if (!this.isReminded) {
                this.isReminded = true;
                this.publishReminders();
                this.isReminded = false;
            }
        }
        this.comparedDate = now;
    }

    // 発行機能**************************************
    //
    // リマインダを発行する
    publishReminders() {
        // 全てのトークルームで回す
        for (let [id, room] of Object.entries(this.robot.brain.rooms())) {
            // データを取得
            var user = this.robot.brain.get(room.users[0].name.toLowerCase())

            // nullの場合はcontinue, そうでない場合処理を行う。
            if (!user) {
                continue;
            } else {
                // 現在時刻取得
                let now = new Date();

                // リマインドすべきデータのリスト
                let reminderData = [];

                // リマインドすべきデータを探す
                for (let i of user) {
                    let compareDate = i["期限"]
                    // 日付比較。同じであればリマインダすべきデータとしてマークする。
                    if (compareDate.getFullYear() == now.getFullYear() && compareDate.getMonth() == now.getMonth() && compareDate.getDate() == now.getDate()) {
                        reminderData.push(i);
                    }
                }
                // リマインドすべきデータがあればリマインドする。
                if (reminderData.length > 0) {
                    var str = "今日が返済日です。\n"
                    for (let i of user) {
                        str += i["相手"] + "さんに" + (i["一回あたりの額"]) + "円\n";
                    }
                    str += "払いましょう!!!"
                    this.robot.send({ room: id }, { text: str });
                }
            }
        }
    }
}
