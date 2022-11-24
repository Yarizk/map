function register() {
    var email = document.getElementById("email").value;
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var data = {
      email: email,
      username: username,
      password: password,
    };
    axios
      .post("/register", data)
      .then((res) => {
        if(res.data == "User already exists"){
            document.getElementById("warning").innerHTML = "user already exists"}
          else if(res.data == "Please enter valid email address"){
            document.getElementById("warning").innerHTML = "Please enter valid email address / username"
          }
          else if(res.data == "Please fill all fields"){
            document.getElementById("warning").innerHTML = "please fill all fields"}
          else{
            window.location.href = "/login"
          }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  
  function login(){
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var data = {
      email: email,
      password: password,
    };
    //console.log(data);
    axios
      .post("/login", data)
      .then((res) => {
        if(res.data == "Email does not exist"){
            document.getElementById("warning").innerHTML = "User not found"}
          else if(res.data == "Wrong Password"){
            document.getElementById("warning").innerHTML = "Incorrect password"
          }
          else{
            window.location.href = "/map"
          }
      })
      .catch((err) => {
        console.log(err);
      })
    }

    function warningClear(){
        document.getElementById("warning").innerHTML = ""
    }