'use strict';

let State = {
  TARGET: 0,
  TOTAL: 1,
  DESCRIPTION: 2,
  DATE: 3,
  LIMIT: 4,
  DIVISION: 5,
  FREQ: 6,
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
      } else if (res.json.options[res.json.response] === "借りる") {
        // 借りるのコード
      } else if (res.json.options[res.json.response] === "貸す") {
        // 貸すのコード
      }
    } else if (res.json.question === "選択") {
      if (res.json.options[res.json.response] === "完了") {
        // 完了のコード
      } else if (res.json.options[res.json.response] === "編集") {
        // 編集のコード
      } else if (res.json.options[res.json.response] === "支払い") {
        // 支払いのコード
      }
    };
  });

  robot.respond(/(..*)さん$/, (res) => {
    let user = robot.brain.get(res.message.user.name.toLowerCase()) || null;
    if (user === null) {
      res.send("NULL");
      user = {};
      user.dataset = [];
      let data = new Data();
      user.dataset.push(data);
      robot.brain.set(res.message.user.name.toLowerCase(), user);
      user = robot.brain.get(res.message.user.name.toLowerCase());
    }
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
    if (data.state == State.TOTAL) {
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

  robot.respond(/([1-9]\d*)回$/, (res) => {
    let user = robot.brain.get(res.message.user.name.toLowerCase());
    let data = user.dataset[user.dataset.length - 1];
    if (data.state === State.DIVISION) {
      data.item["分割"] = res.match[1];
      if (data.item["分割"] > 1) {
        data.state = State.FREQ;
        res.send("続いて返却周期を入力してください\n(例: 1月毎、1日毎、1年毎)");
      } else {
        data.state = State.DESCRIPTION;
        res.send("続いて詳細を例のように入力してください\n(例: 詳細: 〇〇)");
      }
    } else {
      res.send("この値は受け付けていません");
    }
  });

  robot.respond(/([1-9]\d*)(日|月|年)毎$/, (res) => {
    let user = robot.brain.get(res.message.user.name.toLowerCase());
    let data = user.dataset[user.dataset.length - 1];
    if (data.state === State.FREQ) {
      date.item["周期"] = res.match[1] + res.match[2] + "毎";
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
