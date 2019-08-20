'use strict';
// 使用するモジュール
const CronJob = require('cron').CronJob;
require('date-utils');

var event;

module.exports = (robot) => {
    if (!event) {
        event = new Remind(robot);
    }
    robot.respond(/START$/i, (res) => {
        //event.startReminder()
        //event.sayMsg('startしました')
        for (let [id, room] of Object.entries(robot.brain.rooms())) {
            console.log('key:' + id + ' value:' + room.users[0].name.toUpperCase());
            robot.send({ room: id }, { text: room.users[0].name.toUpperCase() });
            var user = robot.brain.get(room.users[0].name.toLowerCase())
            if (!user) {
                continue;
            } else {
                let now = new Date();
                let reminderData = [];
                console.log("length" + user.length)
                for (let i of user) {
                    console.log(i.相手)
                    let compareDate = i["期限"]
                    if (compareDate.getFullYear() == now.getFullYear() || compareDate.getMonth() == now.getMonth() || compareDate.getDay() == now.getDay()) {
                        reminderData.pop(i);
                    }
                }
                var str = "今日が返済日です。\n"
                for (let i of user) {
                    str += i["相手"] + "さんに" + (i["一回あたりの額"]) + "円\n";
                }
                str += "払いましょう!!!"
                robot.send({ room: id }, { text: str });
            }
        }
    });

    robot.respond(/STOP$/i, (res) => {
        // event.stopReminder()
        // event.sayMsg('stopしました')
        var user = []
        var user1 = { "相手": "上原さん", "期限": new Date, "一回あたりの額": 1000 }
        user.push(user1)
        console.log(user.length)
        robot.brain.set(res.message.user.name.toLowerCase(), user);
        var user2 = robot.brain.get(res.message.user.name.toLowerCase());
        console.log(res.message.user.name.toLowerCase())
        console.log(user2[0].相手)
    });

    robot.respond(/NUMBER$/i, (res) => {
        event.showNumber();
    });

    // ボット参加
    robot.join((res) => event.joinFunc(res));
};

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
        this.list = []
        //this.number = 0;
    }

    // 2. ボット参加時に呼び出す.
    joinFunc(res) {
        this.room = res.message.room;
        //this.number += 1;
        this.sayMsg('joined')
    }

    showNumber() {
        this.sayMsg(`${this.number}`);
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
                this.publishReminder();
                this.isReminded = false;
            }
        }
        this.comparedDate = now;
    }


    // 発行機能**************************************
    //
    // 強制的にリマインダを発行する
    publishReminder(item) {

    }

    // トークルームへメッセージを飛ばす
    sayMsg(sendObj) {
        this.robot.send({ room: this.room }, { text: sendObj });
    }

    // リマインダ登録
    registerReminder(username, data) {
        this.list.pop([username, data])
    }

    removeReminder(username, data) {

    }

    // テスト用 いずれは削除される。
    //
    //
    sendOrderMsg() {
        this.sayMsg('Hello in the remind');

    }
}