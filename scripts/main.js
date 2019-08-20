'use strict';

let State = {
  ID: 0,
  TARGET: 1,
  TOTAL: 2,
  DESCRIPTION: 3,
  DATE: 4,
  LIMIT: 5,
  DIVISION: 6,
  REM: 7,
  SPLIT: 8,
  FREQ: 9,
  LIST: 10,
  BORROW: 11,
  LEND: 12,
  SELECT: 13,
  DELETE: 14,
  EDIT: 15,
  PAY: 16,
};

class Data {
  constructor() {
    this.state = State.LIST;
    this.item = {};
  }
}

function dateToString(date) {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

function toHalfNumber(number) {
  return String(number).replace(/[０-９]/g, (str) => {
    return String.fromCharCode(str.charCodeAt(0) - 0xFEE0);
  });
}

module.exports = (robot) => {
  robot.respond(/操作$/i, (res) => {
    res.send({
      question: '操作',
      options: ['借りる', '貸す', '一覧から選択']
    });
  });

  robot.respond('select', (res) => {
    if (res.json.question === "操作") {
      if (res.json.options[res.json.response] === "一覧から選択") {
        res.send({
          question: '選択',
          options: ['完了', '編集', '支払い']
        });
      } else {
        let user = robot.brain.get(res.message.user.name.toLowerCase()) || null;
        if (user === null) {
          user = {};
          user.dataset = [];
        }
        let data = new Data();
        data.state = State.TARGET;
        user.dataset.push(data);
        robot.brain.set(res.message.user.name.toLowerCase(), user);
      }
    } else if (res.json.question === "選択") {
      if (res.json.options[res.json.response] === "完了") {
        // 完了のコード
      } else if (res.json.options[res.json.response] === "編集") {
        // 編集のコード
        let user = robot.brain.get(res.message.user.name.toLowerCase());
        res.send(user.dataset[user.selected_id].item["相手"]);
        res.send("「"
        + "\n総額: " + data.item["総額"]          
        + "\n期限: " + dateToString(data.item["期限"])
        + "\n分割: " + data.item["分割"] + "回払い"
        + (data.item["分割"] > 1 ? "\n周期: " + data.item["周期"] : "")
        + "\n詳細: " + data.item["詳細"]
        + "」\n編集する項目を選択してください");
        res.send({
          question: '編集したい項目を選択',
          options: ['総額', '期限', '分割方法','周期','詳細','キャンセル']
        });
      } else if (res.json.options[res.json.response] === "支払い") {
        // 支払いのコード
      }
    } else if (res.json.question === "編集したい項目を選択") {
        if(res.json.options[res.json.responce] === "総額"){
          //総額のコード
        }else if(res.json.options[res.json.responce] === "期限"){
          //詳細のコード
        }else if(res.json.options[res.json.responce] === "分割方法"){
          //期限のコード
        }else if(res.json.options[res.json.responce] === "周期"){
          //分割方法のコード
        }else if (res.json.options[res.json.responce] === "詳細"){
          //周期のコード
        }else if(res.json.options[res.json.responce] === "キャンセル"){
          //キャンセルのコード
        };
    };
  });

  robot.respond(/(..*)さん$/, (res) => {
    let user = robot.brain.get(res.message.user.name.toLowerCase()) || null;
    let data = user.dataset[user.dataset.length - 1];
    res.send(data.state);
    if (data.state === State.TARGET) {
      data.item["相手"] = res.match[1];
      data.state = State.TOTAL;
      res.send("続いて総額を〇〇円の形で入力してください");
    } else {
      res.send("この値は受け付けていません");
    }
  });

  robot.respond(/([1-9]\d*|0)円$/, (res) => {
    let user = robot.brain.get(res.message.user.name.toLowerCase());
    let data = user.dataset[user.dataset.length - 1];
    if (data.state === State.TOTAL) {
      data.item["総額"] = res.match[1];
      data.state = State.DATE;
      res.send("続いて借りた日を例のように入力してください\n(例: 1998年12月31日)");
    } else {
      res.send("この値は受け付けていません");
    }
  });

  robot.respond(/(\d{4})年(\d{1,2})月(\d{1,2})日$/, (res) => {
    let user = robot.brain.get(res.message.user.name.toLowerCase());
    let data = user.dataset[user.dataset.length - 1];
    if (data.state === State.DATE) {
      data.item["借りた日付"] = new Date(res.match[1], res.match[2], res.match[3], 0, 0);
      data.state = State.LIMIT;
      res.send("続いて期限を例のように入力してください\n(例: 1998年12月31日)");
    } else if (data.state === State.LIMIT) {
      data.item["期限"] = new Date(res.match[1], res.match[2], res.match[3], 0, 0);
      data.state = State.DIVISION;
      res.send("分割回数は何回ですか?○回の形で入力してください(ただし、一括の場合は1回を入力してください)");
    } else {
      res.send("この値は受け付けていません");
    }
  });

  robot.respond(/([1-9１-９][0-9０-９]*)回$/, (res) => {
    let user = robot.brain.get(res.message.user.name.toLowerCase());
    let data = user.dataset[user.dataset.length - 1];
    let number = toHalfNumber(res.match[1]);
    if (data.state === State.DIVISION) {
      data.item["分割"] = number;
      if (data.item["分割"] > 1) {
        data.state = State.FREQ;
        res.send("続いて返却周期を入力してください\n(例: 1日毎、1週毎、1月毎、1年毎)");
        /*
        res.send({
          question: "続いて返却周期を決定してください",
          options: ["1週間毎", "1ヶ月毎", "半年", "その他"],
        });
        */
      } else {
        data.state = State.DESCRIPTION;
        res.send("続いて詳細を例のように入力してください\n(例: 詳細: 〇〇)");
      }
    } else {
      res.send("この値は受け付けていません");
    }
  });

  robot.respond(/([1-9]\d*)(日|週|月|年)毎$/, (res) => {
    let user = robot.brain.get(res.message.user.name.toLowerCase());
    let data = user.dataset[user.dataset.length - 1];
    let number = toHalfNumber(res.match[1]);
    if (data.state === State.FREQ) {
      data.item["周期"] = number + res.match[2] + "毎";
      data.state = State.DESCRIPTION;
      res.send("続いて詳細を例のように入力してください\n(例: 詳細: 〇〇)");
    } else {
      res.send("この値は受け付けていません");
    }
  });

  robot.respond(/詳細:\s*(\S*)/, (res) => {
    let user = robot.brain.get(res.message.user.name.toLowerCase());
    let data = user.dataset[user.dataset.length - 1];
    if (data.state === State.DESCRIPTION) {
      data.item["詳細"] = res.match[1];
      data.state = State.TARGET;
      res.send("内容はこちらでよろしいですか?\n「"
        + "相手: " + data.item["相手"]
        + "\n総額: " + data.item["総額"]
        + "\n借りた日付: " + dateToString(data.item["借りた日付"])
        + "\n期限: " + dateToString(data.item["期限"])
        + "\n分割: " + data.item["分割"] + "回払い"
        + (data.item["分割"] > 1 ? "\n周期: " + data.item["周期"] : "")
        + "\n詳細: " + data.item["詳細"]
        + "」");
    } else {
      res.send("この値は受け付けていません");
    }
  });
};
