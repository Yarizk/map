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
      .post("http://localhost:3000/user/register", data)
      .then((res) => {
        if(res.data == "User already exists"){
            document.getElementById("warning").innerHTML = "user already exists"}
          else if(res.data == "Please enter valid email address"){
            document.getElementById("warning").innerHTML = "Please enter valid email address"
          }
          else if(res.data == "Please fill all fields"){
            document.getElementById("warning").innerHTML = "please fill all fields"}
          else{
            alert("User registered successfully")
          }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  
  function login(){
    var email = document.getElementById("email").value;
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var data = {
      email: email,
      username: username,
      password: password,
    };
    console.log(data);
    axios
      .post("http://localhost:3000/user/login", data)
      .then((res) => {
        alert(res.data)
      })
      .catch((err) => {
        console.log(err);
      });
  }