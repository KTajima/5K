'use strict';

//未完成です//

module.exports = (robot) => {
   let data = robot.brain.get(res.message.user.name.toLowerCase());
    
   function Delete(){
        delete ; 
   }
    
   function Pay(){
        robot.respond(/(.*)/, (res) => {
          res.send("いくら支払いましたか?");
          data.item["残高"] -= res.message.text;
        });
   }
   function Edit(){
       robot.respond(/(.*)/i, (res) => {
          res.send("どの項目を編集しますか?");
       });
       robot.respond('(.*/)', (res) => {
          let mes = res.message.txt;
          res.send("値を入力してください");
          robot.respond('(.*/)', (res) => {
            res.json.options[mes]= res.message.txt; 
          });   
       });
    }
   // Edit();
    Pay();
};



//id
//相手
//総額
//詳細
//借りた日付
//期限
//残高
//分割
//周期