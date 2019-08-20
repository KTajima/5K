// Description:
//   Utility commands surrounding Hubot uptime.
//
// Commands:
//   ping - Reply with pong
//   echo <text> - Reply back with <text>
//   time - Reply with current time
'use strict';


let State = {
  ID:{},
  TARGET: {},
  TOTAL: {},
  DESCRIPTION: {},
  DATE: {},
  LIMIT: {},
  DIVISION: {},
  REM: {},
  SPLIT:{},
  FREQ:{},
  LIST:{},
  BORROW:{},
  LEND:{},
  SELECT:{},
  DELETE:{},
  EDIT:{},
  PAY:{}
};

class data{
  constructor() {
    this.State = State.LIST;
  }
};
