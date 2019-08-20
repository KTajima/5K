module.exports = (robot) => {
    
    
    robot.respond(/リスト$/i, (res) => {
	
	res.send('相手: ', Data.item["相手"], '総額: ', Data.item["総額"],
		 '詳細: ', Data.item["詳細"], '貸借日: ', Data.item["賃借日"],
		 '期限: ', Data.item["期限"], '残高: ', Data.item["残高"],
		 '分割: ', Data.item["分割"], '周期: ', Data.item["周期"]);
    });
    
    
    robot.respond(/操作$/i, (res) => {
	res.send({
	    question: '操作',
	    options: ['借りる', '貸す', '一覧から選択']
	});
    });
    
    robot.respond('select', (res) => {
	if (res.json.question === "操作") {
	    if (res.json.options[res.json.response] === "一覧から選択") {
		let user = robot.brain.get(res.message.user.name.toLowerCase());
		let options = [];
		let min=user.current_index + 5;
		if(min>user.dataset.length) min=user.dataset.length;
		for(let i=user.current_index; i<min; i+=1|0) {
		    options.push(user.dataset[i]);
		}
		if(user.current_index+5<user.length){
		    user.current_index += 5
		    options.push("次の５件");
		    res.send({
			question: 'データ一覧',
			options: options
		    });
		} else {
		    res.send({
			question: 'データ一覧',
			options: options
		    });
		}
		return;
		
		if(res.json.options[res.json.response] != "次の５件"){
		    res.send({
			question: '選択',
			options: ['完了', '編集', '支払い']
		    });
		    if(res.json.options[res.json.response] === "完了"){
			//完了のコード
		    } else if(res.json.options[res.json.response] === "編集"){
			//編集のコード
		    } else if(res.json.options[res.json.response] === "支払い") {
			//支払いのコード
		    }
		}
		
	    } else {
		//貸し借りまとめ
		user=[];
		data=new Data();
		user.push(data);
	    }
	}
    });

};
