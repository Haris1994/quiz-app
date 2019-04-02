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
                    window.localStorage.setItem('name', response.name);
                    window.localStorage.setItem('email', response.email);
                    window.localStorage.setItem('_id', response._id);
                    window.localStorage.setItem('image',JSON.stringify(response.img));
                    console.log(window.localStorage.getItem('image'));
                    window.location.replace("http://localhost:3000/courses.html");
                },
                error: function () {
                    alert("error");
                }
            })

}

const courseAdd = (courseName) =>{
    console.log(window.localStorage);
    let data = {
        name : window.localStorage.getItem('name'),
        courseName
    }

    $.ajax({
        url:'/updateCourse',
        type:'PATCH',
        data : JSON.stringify(data),
        headers: {
            'Content-Type':'application/json'
        },
        success : (response) =>{
            console.log(response);
            window.location.replace("http://localhost:3000/courses.html");
        },
        error: function () {
            alert("error");
        }
    })
}

const signOut = () =>{
    window.localStorage.clear();
    window.location.replace("http://localhost:3000");
}

const profile = () =>{
    window.location.replace("http://localhost:3000/Account.html");
}


const dataUpdate = () =>{
    let id=window.localStorage.getItem('_id');
    let name = window.localStorage.getItem('name');
    let email = window.localStorage.getItem('email');
    let changeName = document.getElementById('changeName').value;
    let changeEmail = document.getElementById('changeEmail').value;

    if(name===changeName && email===changeEmail){
        alert('Name and email are same as updates you want');
    }else{

    data = {
        id,
        changeName,
        changeEmail
    }

    $.ajax({
        url:'/updateUser',
        type:'PATCH',
        data : JSON.stringify(data),
        headers: {
            'Content-Type':'application/json'
        },
        success : (response) =>{
            console.log(response);
            window.localStorage.setItem('name', response.name);
            window.localStorage.setItem('email', response.email);
            window.location.replace("http://localhost:3000/Account.html");
        },
        error: function () {
            alert("error");
        }
    })
    }
}