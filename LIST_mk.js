module.exports = (robot) => {
    
    /*
    robot.respond(/リスト/i, (res) => {
	
	res.send('相手: ', Data.item["相手"], '総額: ', Data.item["総額"],
		 '詳細: ', Data.item["詳細"], '借りた日付: ', Data.item["借りた日付"],
		 '期限: ', Data.item["期限"], '残高: ', Data.item["残高"],
		 '分割: ', Data.item["分割"], '周期: ', Data.item["周期"]);
    });
    */
    
    robot.respond(/操作$/i, (res) => {
	res.send({
	    question: '操作',
	    options: ['借りる', '貸す', '一覧から選択']
	});
    });

    
    robot.respond('select', (res) => {
	if (res.json.response === null) {
            res.send(`Your question is ${res.json.question}.`);
	} else {
	    res.send({
		question: '操作',
		options: ['完了', '編集', '支払い']
	    });
	};
    });

};
