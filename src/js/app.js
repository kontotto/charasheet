var app = angular.module('myApp', []);

//affix用バグフィックス
$(function() {
  var $affixElement = $('div[data-spy="affix"]');
  $affixElement.width($affixElement.parent().width());
});

// number d max のサイコロを振る
function diceRoll(number, max){
  let sum = 0;
  for(let i = 0 ;i< number;i++){
    sum += Math.floor(Math.random() * max) + 1;
  }
  return sum;
}

function getTheme(groupid){
  let theme = 'default';
    switch(groupid % 6){
      case 0: theme = 'primary'; break;
      case 1: theme = 'danger'; break;
      case 2: theme = 'info'; break;
      case 3: theme = 'success'; break;
      case 4: theme = 'warning'; break;
      case 5: theme = 'default'; break;
    }
  return theme;
}

app.controller('UserController', function(Profile, Stats, $http){
  this.user = {skills:[]};
  this.skills = [];

  this.skillPointDenominator = (skillname) => {
    console.log("numerator: "+ skillname);
    for(let i = 0; i < Stats.length; i++){
      if(skillname == 'job' && Stats[i].id == 'edu') return Stats[i].sum * 20;
      else if(skillname == 'int' && Stats[i].id == 'int') return Stats[i].sum * 10;
    }
  };

  this.skillPointNumerator = (skillname) => {
    let sum = 0;
    for(let i = 0; i < this.skills.length; i++){
      sum += 
        (skillname == 'int') ? this.skills[i].int
      : (skillname == 'job') ? this.skills[i].job
      : 0;
    }
    return sum;
  };

  this.outputText = () => {
    this.updateUser();
    let blob = new Blob([ JSON.stringify(this.user) ], { "type" : "text/plain" });
    window.URL = window.URL || window.webkitURL;
    if(window.navigator.msSaveBlob){
      window.navigator.msSaveBlob(blob, "chara.txt");
    }else{
      window.open(window.URL.createObjectURL(blob));
    }
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
      method = 'PUT';
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

  this.changeSum = (item) => {
    //this.skills[index].sum = this.skills[index].ini +　this.skills[index].int + this.skills[index].job;
    item.sum = item.ini + item.int + item.job;
  };

  this.addList = (id, name, ini, groupid) => {
    this.skills.push({
      "_id": id,
      "name": name,
      "ini" : ini,
      "theme": getTheme(groupid),
      "groupid": groupid
    });
    console.log(this.skills);
  };

  this.deleteList = (item) => {
    this.skills.splice(this.skills.indexOf(item), 1);
  }
});

app.controller('ProfileController', function(Profile){
  this.profile = Profile;
});

app.controller('StatusController', function(Stats){
  this.statusSet = () => {
    for(let i = 0; i < this.list.length;i++){
      let origin = this.list[i].origin;
      // パラメータの決定
      switch(this.list[i].id){
        case 'str': {this.list[i].origin = diceRoll(3, 6); break;}
        case 'con': {this.list[i].origin = diceRoll(3, 6); break;}
        case 'pow': {this.list[i].origin = diceRoll(3, 6); break;}
        case 'dex': {this.list[i].origin = diceRoll(3, 6); break;}
        case 'app': {this.list[i].origin = diceRoll(3, 6); break;}
        case 'siz': {this.list[i].origin = diceRoll(2, 6) + 6; break;}
        case 'int': {this.list[i].origin = diceRoll(2, 6) + 6; break;}
        case 'edu': {this.list[i].origin = diceRoll(3, 6) + 3; break;}
      }
      // 設定の反映
      this.changeSum(i);
    }
  };

  this.getIndex = (id) => {
    for(let i = 0; i < this.list.length;i++){
      if(this.list[i].id == id) return i;
    }
  };

  this.changeSum = (index) => {
    this.list[index].sum = this.list[index].origin + this.list[index].vary;
    
    // 連動して変更
    switch(this.list[index].id){
      case 'int': 
        this.list[this.getIndex('idea')].origin = this.list[index].sum * 5;
        break;
      case 'pow': 
        this.list[this.getIndex('san')].origin = this.list[index].sum * 5;
        this.list[this.getIndex('lucky')].origin = this.list[index].sum * 5;
        this.list[this.getIndex('mp')].origin = this.list[index].sum;
        break;
      case 'edu': 
        this.list[this.getIndex('wisdom')].origin = this.list[index].sum * 5;
        break;
      case 'con': 
      case 'siz':
        this.list[this.getIndex('hp')].origin = 
          Math.ceil((this.list[this.getIndex('con')].sum + this.list[this.getIndex('siz')].sum)/2);
        break;
      case 'dex':
        this.list[this.getIndex('dodge')].origin = this.list[index].sum * 2;
        break;
    }
  };

  this.list = Stats;
});

app.controller('SkillController', function(Skills){

  this.addList = (id, name, ini, theme) => {
    angular.element(uctrl).scope().us.addList(id, name, ini, theme);
  };

  this.getTheme = (groupid) =>{
    return getTheme(groupid);
  };

  this.all = Skills;
});


app.factory('Profile', function(){
  return {
    "name" : "",
    "job" : "",
    "dsc" : ""
  };
});

app.factory('Skills', function(){
  return {
    "groups": [
      {
        "_id": 0,
        "name": "戦闘技能",
        "skills": [
          {
            "id": 0,
            "name": "キック",
            "ini": 25
          },
          {
            "id": 1,
            "name": "組み付き",
            "ini": 25 
          },
          {
            "id": 2,
            "name": "こぶし（パンチ）",
            "ini": 50
          },
          {
            "id": 3,
            "name": "頭突き",
            "ini": 10
          },
          {
            "id": 4,
            "name": "投擲",
            "ini": 25
          },
          {
            "id": 5,
            "name": "マーシャルアーツ",
            "ini": 1
          },
          {
            "id": 6,
            "name": "拳銃",
            "ini": 20
          },
          {
            "id": 7,
            "name": "サブマシンガン",
            "ini": 15
          },
          {
            "id": 8,
            "name": "ショットガン",
            "ini": 30
          },
          {
            "id": 9,
            "name": "マシンガン",
            "ini": 15
          },
          {
            "id": 10,
            "name": "ライフル",
            "ini": 25
          }
        ]
      },
      {
        "_id": 1,
        "name": "探索技能",
        "skills": [
          {
            "id": 0,
            "name": "応急手当",
            "ini": 30
          },
          {
            "id": 1,
            "name": "鍵開け",
            "ini": 1
          },
          {
            "id": 2,
            "name": "隠す",
            "ini": 15
          },
          {
            "id": 3,
            "name": "隠れる",
            "ini": 15
          },
          {
            "id": 4,
            "name": "聞き耳",
            "ini": 25
          },
          {
            "id": 5,
            "name": "忍び歩き",
            "ini": 10
          },
          {
            "id": 6,
            "name": "写真術",
            "ini": 10
          },
          {
            "id": 7,
            "name": "精神分析",
            "ini": 1
          },
          {
            "id": 8,
            "name": "追跡",
            "ini": 10
          },
          {
            "id": 9,
            "name": "登攀",
            "ini": 40
          },
          {
            "id": 10,
            "name": "図書館",
            "ini": 25
          },
          {
            "id": 11,
            "name": "目星",
            "ini": 25
          }
        ]
      },
      {
        "_id": 2,
        "name": "行動技能",
        "skills": [
          {
            "id": 0,
            "name": "運転()",
            "ini": 20
          },
          {
            "id": 1,
            "name": "機械修理",
            "ini": 20
          },
          {
            "id": 3,
            "name": "重機械操作",
            "ini": 1
          },
          {
            "id": 4,
            "name": "乗馬",
            "ini": 5
          },
          {
            "id": 5,
            "name": "水泳",
            "ini": 25
          },
          {
            "id": 6,
            "name": "製作()",
            "ini": 5
          },
          {
            "id": 7,
            "name": "操縦()",
            "ini": 1
          },
          {
            "id": 8,
            "name": "跳躍",
            "ini": 25
          },
          {
            "id": 9,
            "name": "電気修理",
            "ini": 10
          },
          {
            "id": 10,
            "name": "ナビゲート",
            "ini": 10
          },
          {
            "id": 11,
            "name": "変装",
            "ini": 1
          }
        ]
      },
      {
        "_id": 3,
        "name": "交渉技能",
        "skills": [
          {
            "id": 0,
            "name": "言いくるめ",
            "ini": 5
          },
          {
            "id": 1,
            "name": "信用",
            "ini": 15
          },
          {
            "id": 2,
            "name": "説得",
            "ini": 15
          },
          {
            "id": 3,
            "name": "値切り",
            "ini": 5
          },
          {
            "id": 4,
            "name": "母国語()",
            "ini": 20
          }
        ]
      },
      {
        "_id": 4,
        "name": "知識技能",
        "skills": [
          {
            "id": 0,
            "name": "医学",
            "ini": 5

          },
          {
            "id": 1,
            "name": "オカルト",
            "ini": 5

          },
          {
            "id": 2,
            "name": "化学",
            "ini": 1

          },
          {
            "id": 3,
            "name": "クトゥルフ神話",
            "ini": 0

          },
          {
            "id": 4,
            "name": "芸術()",
            "ini": 5

          },
          {
            "id": 5,
            "name": "経理",
            "ini": 10

          },
          {
            "id": 6,
            "name": "考古学",
            "ini": 1

          },
          {
            "id": 7,
            "name": "コンピューター",
            "ini": 1

          },
          {
            "id": 8,
            "name": "心理学",
            "ini": 5

          },
          {
            "id": 9,
            "name": "人類学",
            "ini": 1

          },
          {
            "id": 10,
            "name": "生物学",
            "ini": 1

          },
          {
            "id": 11,
            "name": "地質学",
            "ini": 1

          },
          {
            "id": 12,
            "name": "電子工学",
            "ini": 1

          },
          {
            "id": 13,
            "name": "天文学",
            "ini": 1
          },
          {
            "id": 14,
            "name": "博物学",
            "ini": 10

          },
          {
            "id": 15,
            "name": "物理学",
            "ini": 1

          },
          {
            "id": 16,
            "name": "法律",
            "ini": 5

          },
          {
            "id": 17,
            "name": "薬学",
            "ini": 1
          },
          {
            "id": 18,
            "name": "歴史",
            "ini": 20
          }
        ]
      }
    ]
  }
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

