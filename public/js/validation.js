const dataValidation = () =>{
    let name = document.getElementById ('signup_name').value;
    let email = document.getElementById ('signup_email').value;
    let password = document.getElementById ('signup_password').value;
    let data = {
        name,
        email,
        password
    }
            $.ajax({
                url:'/register',
                type:'POST',
                data : JSON.stringify(data),
                headers: {
                    'Content-Type':'application/json'
                },
                success : (response) =>{
                    window.location.replace("http://localhost:3000/signup.html");
                },
                error: function () {
                    alert("error");
                }
            })

}

const dataValidate = () =>{
    let email = document.getElementById ('login_email').value;
    let password = document.getElementById ('login_password').value;
    let data = {
        email,
        password
    }
            $.ajax({
                url:'/login',
                type:'POST',
                data : JSON.stringify(data),
                headers: {
                    'Content-Type':'application/json'
                },
                success : (response) =>{
                    console.log(response);
                    window.location.replace("http://localhost:3000/signup.html");
                },
                error: function () {
                    alert("error");
                }
            })

}