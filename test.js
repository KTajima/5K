
module.exports = (robot) => {
    
//注意: 実際に実行していないので動くか不明//
//注意: Clearconfirm_0など、確認したかの状態を判断する変数を勝手に用意//
//注意:まだ甘いところがあり、その個所を注意コメントで示唆//
    
    
    //消去//
    if(data.state === Clearconfirm_0){
        res.send({
            question: "本当に完済ですか？"
        });
        data.state = Clearconfirm_1;
    }
    if(data.state === Clearconfirm_1){
        robot.respond('yesno', (res1) => {
        if (res1.json.response === null) {
            res1.send("無効な値です");
        } 
        else if(res1.json.response == true){//データ消去 & 最初に戻る//
            delete json[data];
            data.state = LIST;
        }
        else if(res1.json.response == false){//選択画面に戻る//
            data.state = SELECT;
        }
    }

    
    //支払い//
    if(data.state === Payconfirm_0){
        res.send("支払い総額を〇〇円の形で入力してください");
        data.state = Payconfirm_1;
    }
    if(data.state === Payconfirm_1){
        robot.respond(/([1-9]\d*|0)円$/, (res) => {
            res.send({
                question: data.item["相手"] + "さんの残高は\n"+ data.item["残高"] + "から" + data.item["残高"] - res.match[1] +"\nとなります。よろしいでしょうか？"
            });
        });
        data.state = Payconfirm_2;
    }
    if(data.state === Payconfirm_3){
        robot.respond('yesno', (res) => {
            if (res.json.response === null) {
                res.send("無効な値です");
            } 
            else if(res.json.response == true){//支払い//
                data.item["残高"] -= res.match[1];
                res.send(data.item["相手"] + "さんの残高は\n"+ data.item["残高"] + "となりました。");   
                res.state = LIST;
            }
            else if(res.json.response == false){//選択画面に戻る//
                data.state = SELECT;
            }
        });
    }
    

       
    //編集//
    let kind;//注意: 編集項目を保存したいが・・・。

    if(data.state === Editconfirm_0){
        res.send("編集する項目名を教えてください \n(例: 相手)");
        data.state = Editconfirm_1;
    }
    if(data.state === Editconfirm_1){
        robot.respond('(.*/)', (res) => {
        }
        //if(res.match[1] が当てはまるのがあれば){
        //    date.state = Editconfim_2;
        //    res.send("値を入れてください");
        //}
        //else{
        //    res.send("無効な値です");
        //}
    }
    if(data.state === Editconfirm_2){
        robot.respond('(.*/)', (res) => {//注意：このままでは関係のない値も採用される//
            res.send({
                question: data.item[kind] + "が\n"+ res1.match[1]+ "\nに変更になります。よろしいでしょうか？"
            });
        }
        data.state = Editconfirm_3;
    }
    if(data.state === Editconfirm_3){
        robot.respond('yesno', (res) => {
            if (res.json.response === null) {
                res.send("無効な値です");
            } 
            else if(res.json.response == true){//変更//
                res.send(data.item[kind] + "が\n"+ res.match[1]+ "\nに変更になりました");
                data.item[kind]  res.match[1];
                data.state = SELECT;
            }
            else if(res.json.response == false){//編集画面に戻る//
                data.state = Edit;
            }
        });
    }
