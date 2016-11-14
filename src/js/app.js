var app = angular.module('myApp', []);


app.controller('UserController', function(){
  this.list = [];
  this.addList = (id, name, ini) => {
    this.list.push({
      "_id": id,
      "name": name,
      "ini" : ini
    });
  };
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
