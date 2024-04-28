var M = {
  v: 'v',
  f: function() {
    console.log(this.v);
  }
}

module.exports = M;    //  M을 바깥에서 사용할 수 있게끔 허용하겠다 