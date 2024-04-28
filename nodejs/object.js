var members =['egoing', 'k8805', 'hoya'];
var roles = {
'programmer': 'egoing',
'designer': 'k8805',
'manager': 'hoya'}
console.log(roles.designer);   // k8805
console.log(roles['designer']); //k8805

members.forEach(member => console.log(member));
for (let name in roles) {
  console.log('object => ', name, 'value => ', roles[name]);
}

var f = function() {
  console.log(1+1);
}

console.log(f);  // [Function: f]
f();    // 2

var a = [f];       // you can have function in the array
a[0]();    // 2

var obj = {
  func: f
}

obj.func();     //  2,  you can have function in the object

// var v1 = 'v1';
// var v2 = 'v2';

var ob = {
  v1: 'v1',
  v2: 'v2',
  f1: function(){
    console.log(this.v1)
  },
  f2: function(){
    console.log(this.v2)
  }
}
ob.f1();
ob.f2();