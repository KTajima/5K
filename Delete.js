
user ={dataset:[1,2], selected_id:3};
module.exports = (robot) => {
   
    //消去//
    robot.respond(/PNG$/i, (res) => {
        res.send({
            question: "本当に完済ですか？"
        });
        if(res.json.question === "本当に完済ですか？"){
            robot.respond('yesno', (res1) => {   
                if (res1.json.response === null) {
                    res1.send("無効な値です");
                } 
                else if(res1.json.response === true){//データ消去 & 最初に戻る//
                    res1.send("good");
                    user.splice(selected_id);
                    //data.state = LIST;
                }
                else if(res1.json.response === false){//選択画面に戻る//
                    //data.state = SELECT;
                }    
            }); 
        }
     });            
};