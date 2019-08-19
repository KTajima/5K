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

module.exports = (robot) => {
	robot.respond(/(..*)さん$/, (res) => {
		let data = robot.brain.get(res.message.user.name.toLowerCase()) || null
		if (data === null)
		{
			res.send("NULL");
			data = {};
			data.state = State.TARGET;
			data.info = {};
		}
		res.send(data.state);
		if (data.state === State.TARGET) {
			data.info["相手"] = res.match[1];
			data.state = State.TOTAL;
			res.send("続いて総額を〇〇円の形で入力してください");
			robot.brain.set(res.message.user.name.toLowerCase(), data);
		} else {
			res.send("この値は受け付けていません");
		}
	});

	robot.respond(/([1-9]\d*|0)円$/, (res) => {
		let data = robot.brain.get(res.message.user.name.toLowerCase());
		if (data.state == State.TOTAL) {
			data.info["総額"] = res.match[1];
			data.state = State.DATE;
			res.send("続いて借りた日を例のように入力してください\n(例: 1998年12月31日)");
		} else {
			res.send("この値は受け付けていません");
		}
	});

	robot.respond(/(\d{4})年(\d{1,2})月(\d{1,2})日$/, (res) => {
		let data = robot.brain.get(res.message.user.name.toLowerCase());
		if (data.state === State.DATE) {
			data.info["借りた日付"] = new Date(res.match[1], res.match[2], res.match[3], 0, 0);
			data.state = State.LIMIT;
			res.send("続いて期限を例のように入力してください\n(例: 1998年12月31日)");
		} else if (data.state === State.LIMIT) {
			data.info["期限"] = new Date(res.match[1], res.match[2], res.match[3], 0, 0);
			data.state = State.DIVISION;
			res.send("分割回数は何回ですか?○回の形で入力してください(ただし、一括の場合は1回を入力してください)");
		} else {
			res.send("この値は受け付けていません");
		}
	});

	robot.respond(/([1-9]\d*)回$/, (res) => {
		let data = robot.brain.get(res.message.user.name.toLowerCase());
		if (data.state === State.DIVISION) {
			data.info["分割回数"] = res.match[1];
			if (data.info["分割回数"] > 1) {
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
		let data = robot.brain.get(res.message.user.name.toLowerCase());
		if (data.state === State.FREQ) {
			data.info["周期"] = res.match[1];
			data.state = State.DESCRIPTION;
			res.send("続いて詳細を例のように入力してください\n(例: 詳細: 〇〇)");
		} else {
			res.send("この値は受け付けていません");
		}
	});

	robot.respond(/詳細: (\S*)/, (res) => {
		let data = robot.brain.get(res.message.user.name.toLowerCase());
		if (data.state === State.DESCRIPTION) {
			data.info["詳細"] = res.match[1];
			data.state = State.TARGET;
			res.send("内容はこちらでよろしいですか?\n「" + data.info["詳細"] + "」");
		} else {
			res.send("この値は受け付けていません");
		}
	});
};
