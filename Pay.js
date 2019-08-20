data = {
	state: "STATE",
	item: {
		"相手": "A",
                "残高": 10000,
                "一回当たりの額": 1000
	}
};
user = {
	dataset: [
                 data
	],
	selected_id: 0
}


pay = 0;
module.exports = (robot) => {
    robot.respond(/ONG$/i, (res) => {
                  res.send("支払い総額を〇〇円の形で入力してください");
                  robot.respond(/([1-9]\d*|0)円$/, (res) => {
                      res.send({
                          question: "より"//data.item["相手"] + "さんの残高は\n"+ data.item["残高"] + "から" + (data.item["残高"] - res.match[1]) +"\nとなります。よろしいでしょうか？"
                      });
                      pay = res.match[1];     
                       if(res.json.question === "より"){//data.item["相手"] + "さんの残高は\n"+ data.item["残高"] + "から" + (data.item["残高"] - pay) +"\nとなります。よろしいでしょうか？"){
                          robot.respond('yesno', (res) => {
                              if (res.json.response === null) {
                                  res.send("無効な値です");
                              } 
                              else if(res.json.response == true){//支払い//
                                  data.item["残高"] = (data.item["残高"]-pay);
                                  res.send(data.item["相手"] + "さんの残高は\n"+ (data.item["残高"]) + "となりました。");
                                  data.item ["一回当たりの額"] = ((2*data.item["一回当たりの額"]) -(pay));   
                                  //data.state = LIST;
                              }
                              else if(res.json.response == false){//選択画面に戻る//
                                  //data.state = SELECT;
                              }
                          });
                  }                   
                  });      
                
                   
                  
     });
};