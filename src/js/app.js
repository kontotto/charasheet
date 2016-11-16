var app = angular.module('myApp', []);

function diceRoll(number, max){
  let sum = 0;
  for(let i = 0 ;i< number;i++){
    sum += Math.floor(Math.random() * max) + 1;
  }
  return sum;
}

app.controller('UserController', function(){
  this.list = [];
  
  this.changeSum = (index) => {
    console.log("changeSum()");
    this.list[index].sum = this.list[index].origin + this.list[index].vary;
  };

  this.addList = (id, name, ini) => {
    this.list.push({
      "_id": id,
      "name": name,
      "ini" : ini
    });
  };
});

app.controller('StatusController', function(){
  this.statusSet = () => {
    for(var i = 0; i < this.list.length;i++){
      this.list[i].origin = diceRoll(2, 6);
    }
  };
  this.list=[
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
