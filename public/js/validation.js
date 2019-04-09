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
                    $.ajax({
                        url : '/getAllCourses',
                        type : 'GET',
                        success : (result) =>{
                            window.localStorage.setItem('courses', JSON.stringify(result));
                        },
                        error : function (){
                            alert("error");
                        }
                    })
                    window.localStorage.setItem('name', response.name);
                    window.localStorage.setItem('email', response.email);
                    window.localStorage.setItem('_id', response._id);
                    window.localStorage.setItem('image',JSON.stringify(response.img));
                    window.location.replace("http://localhost:3000/courses.html");
                },
                error: function () {
                    alert("error");
                }
            })

}

const courseAdd = (courseName) =>{

    window.localStorage.setItem('count', JSON.stringify(0));

    let myArray = JSON.parse(window.localStorage.getItem('courses'));

    let obj = myArray.find(o => o.name === courseName);

    console.log(obj.questions[0].options[0]);
    let courseId = obj._id;
    window.localStorage.setItem('course', JSON.stringify(obj));
    let data = {
        name : window.localStorage.getItem('name'),
        courseName
    }



    $.ajax({
        url:'/updateCourse',
        type:'PATCH',
        data : JSON.stringify(data),
        params : courseId,
        headers: {
            'Content-Type':'application/json'
        },
        success : (response) =>{

            console.log(response);
            let data = courseName;
            $.ajax({
                url:'/getCourse/'+courseId,
                headers: {
                    'Content-Type':'application/json'
                },
                dataType : "json",
                success : (response) =>{
                    console.log(response);
                    window.localStorage.setItem('course', JSON.stringify(response));
                    window.location.replace("http://localhost:3000/quiz.html");
                },
                error: function(){
                    alert("error");
                }
            })
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

const questionChange= () =>{
    if($("input:radio[name='option']").is(":checked")){
    let course = JSON.parse(window.localStorage.getItem('course'));
    let count = JSON.parse(window.localStorage.getItem('count'));
    let question = course.questions[count].question;

    console.log(course);
    console.log(question);
    data = {
        courseId : course._id,
        question
    }
    $.ajax({
        url : '/updateQuestion',
        type : 'PATCH',
        data : JSON.stringify(data),
        headers: {
            'Content-Type':'application/json'
        },
        success : (response) =>{

        },
        error: function () {
            alert("error");
        }

    })

    count++;
    if(count === course.questions.length){
        $("div").remove(".questions-area");
        $("div").remove(".answer-fields");
        $("div").remove(".answer-fields-a");
        $("div").remove(".next-button");

        var iDiv = document.createElement('div');
        iDiv.className = 'jumbotron';

        let newElement = document.createElement('h1');
        newElement.innerHTML = 'You have scored : '

        iDiv.appendChild(newElement);

        $('#sawad').append(iDiv);
    }
    document.getElementById('question').innerHTML = (course.questions[count].question);
    document.getElementById('show').innerHTML = ('Hi, '+ window.localStorage.getItem('name')+'!');

    $("div").remove(".answer-fields");
    $("div").remove("answer-fields-a");

    for(i=0; i<course.questions[count].options.length; i++){
        var iDiv = document.createElement('div');
        iDiv.className = 'answer-fields';
        
        var innerDiv = document.createElement('div');
        innerDiv.className = 'answer-fields-a';
        
        iDiv.appendChild(innerDiv);

        var newElement = document.createElement('input');
        newElement.setAttribute('type', 'radio');
        newElement.setAttribute('id', JSON.stringify(i));
        newElement.setAttribute('class', 'opts');
        newElement.setAttribute('name', 'option');
        newElement.setAttribute('autocomplete', 'off');
        newElement.setAttribute('autocorrect', 'off');
        newElement.setAttribute('autocapitalize', 'off');
        newElement.setAttribute('spellcheck', 'false');
        newElement.setAttribute('placeholder', '');
        newElement.setAttribute('value', '');
        var newsElement = document.createElement('label');
        newsElement.setAttribute('for', JSON.stringify(i));
        newsElement.innerText = course.questions[count].options[i];

        innerDiv.appendChild(newElement);
        innerDiv.appendChild(newsElement);

        $('#questions').append(iDiv);
}
    window.localStorage.setItem('count', JSON.stringify(count));
}else{
    alert('No option has been selected. Please pick an option to proceed.');
}
}