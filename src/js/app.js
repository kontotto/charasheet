var app = angular.module('myApp', []);

// number d max のサイコロを振る
function diceRoll(number, max){
  let sum = 0;
  for(let i = 0 ;i< number;i++){
    sum += Math.floor(Math.random() * max) + 1;
  }
  return sum;
}

app.controller('UserController', function(Profile, Stats, $http){
  this.user = {skills:[]};
  this.skills = [];

  this.getJobAll = () => {
    let sum = 0;
    for(let i = 0; i < this.skills.length; i++){
      sum += this.skills[i].job;
    }
    return sum;
  };

  this.getJob = () => {
    for(let i = 0; i < Stats.length; i++){
      if(Stats[i].id == 'edu') return Stats[i].sum * 20;
    }
  };

  this.getIntAll = () => {
    let sum = 0;
    for(let i = 0; i < this.skills.length; i++){
      sum += this.skills[i].int;
    }
    return sum;
  };

  this.getInt = () => {
    for(let i = 0; i < Stats.length; i++){
      if(Stats[i].id == 'int') return Stats[i].sum * 10;
    }
  };

  this.outputText = () => {
    this.updateUser();
    let blob = new Blob([ JSON.stringify(this.user) ], { "type" : "text/plain" });
    window.URL = window.URL || window.webkitURL;
    window.open(window.URL.createObjectURL(blob));
  };

  this.updateUser = () => {
    // プロフィール
    this.user.name = Profile.name;
    this.user.job = Profile.job;
    this.user.desc = Profile.dsc;

    // ステータス
    for(let i = 0; i < Stats.length; i++){
      this.user[Stats[i].id] = Stats[i].sum;
    }

    // スキル一覧
    // 冪等性を保つため一度スキル一覧を空にする
    this.user.skills.length = 0;
    for(let i = 0; i < this.skills.length; i++){
      this.user.skills.push({
        "_id": this.skills[i]._id,
        "name": this.skills[i].name,
        "ini": this.skills[i].ini,
        "current": this.skills[i].sum
      });
    }
  };

  this.regUser = () => {
    let method;
    let apiname = '';
    let host = "http://" + window.location.hostname + ":3001/users";
    let me = this;

    // user情報の更新
    this.updateUser();

    // _idが要素中に含まれていればDBに登録済みなのでPUTで更新
    if('_id' in this.user){
      method = 'GET';
      apiname = '/' + this.user._id;
    // それ以外はPOSTで新規作成
    } else {
      method = 'POST';
    }

    $http({
      method: method,
      url: host + apiname,
      data: JSON.stringify(this.user),
      hearders: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(data, status, header, config){
      me.user._id = data._id;
      console.log(data);
    }).error(function(data, status, header, config){
      alert("Error ::" + data);
    });
  };

  this.changeSum = (index) => {
    this.skills[index].sum = this.skills[index].ini +　this.skills[index].int + this.skills[index].job;
  };

  this.addList = (id, name, ini) => {
    this.skills.push({
      "_id": id,
      "name": name,
      "ini" : ini
    });
    console.log(this.skills);
  };

  this.deleteList = (index) => {
    this.skills.splice(index, 1);
  }
});

app.controller('ProfileController', function(Profile){
  this.profile = Profile;
});

app.controller('StatusController', function(Stats){
  this.statusSet = () => {
    for(var i = 0; i < this.list.length;i++){
      this.list[i].origin = diceRoll(2, 6);
      this.changeSum(i);
    }
  };

  this.changeSum = (index) => {
    this.list[index].sum = this.list[index].origin + this.list[index].vary;
  };

  this.list = Stats;
});

app.controller('SkillController', function(){

  this.addList = (id, name, ini) => {
    angular.element(uctrl).scope().us.addList(id, name, ini);
  };

  this.all={
    "groups": [
      {
        "_id": 0,
        "name": "戦闘技能",
        "skills": [
          {
            "_id": 0,
            "name": "キック",
            "ini": 15
          },
          {
            "_id": 1,
            "name": "あいうえお",
            "ini": 15
          }
        ]
      }
    ]
  };
});

app.factory('Stats', function(){
  return [
    {
      "name": "STR",
      "id": "str",
      "readonly": false
    },
    {
      "name": "CON",
      "id": "con",
      "readonly": false
    },
    {
      "name": "POW",
        "id": "pow",
          "readonly": false
    },
    {
      "name": "DEX",
        "id": "dex",
          "readonly": false
    },
    {
      "name": "APP",
        "id": "app",
          "readonly": false
    },
    {
      "name": "SIZ",
        "id": "siz",
          "readonly": false
    },
    {
      "name": "INT",
        "id": "int",
          "readonly": false
    },
    {
      "name": "EDU",
        "id": "edu",
          "readonly": false
    },
    {
      "name": "HP",
        "id": "hp",
          "readonly": true
    },
    {
      "name": "MP",
        "id": "mp",
          "readonly": true
    },
    {
      "name": "SAN",
        "id": "san",
          "readonly": true
    },
    {
      "name": "アイデア",
        "id": "idea",
          "readonly": true
    },
    {
      "name": "幸運",
        "id": "lucky",
          "readonly": true
    },
    {
      "name": "知識",
        "id": "wisdom",
          "readonly": true
    },
    {
      "name": "回避",
        "id": "dodge",
          "readonly": true
    }
  ];
});

app.factory('Profile', function(){
  return {
    "name" : "",
    "job" : "",
    "dsc" : ""
  };
});