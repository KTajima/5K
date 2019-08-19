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
	/*
	  if (res.json.response === null) {
	  res.send(`Your question is ${res.json.question}.`);
	  }
	*/
	if (res.json.options[res.json.response]==="一覧から選択"){
	    res.send({
		question: '選択',
		options: ['完了', '編集', '支払い']
	    });
	    if(res.json.options[res.json.response]==="完了") {
		//完了のコード
	    }
	    else if(res.json.options[res.json.response]==="編集"){
		//編集のコード
	    }
	    else if(res.json.options[res.json.response]==="支払い"){
		//支払いのコード
	    }
	    else {
		//nullの場合初回に帰る
	    }

	    
	};
	else if (res.json.options[res.json.response]==="借りる"){
	    //借りるのコード
	};
	else if (res.json.options[res.json.response]==="貸す"){
	    //貸すのコード
	};
	else {
	    //nullの場合初回に帰る
	};
    });
    

};
