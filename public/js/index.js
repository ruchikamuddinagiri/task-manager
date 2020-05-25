const email = document.getElementById('email')
const password = document.getElementById('password')
const loginButton = document.getElementById('login')

const apiFetch = async (data)=>{
    const response = await fetch('/users/login', {
        method:'POST',
        credentials: 'same-origin',
        headers:{
            'Content-type':'application/json'
        },
        body: JSON.stringify(data)
    })  
    return response.json()
}

    loginButton.addEventListener('click', (e)=>{
        e.preventDefault()
         apiFetch({email: email.value, password: password.value}).then((response)=>{
             if(response){
                 document.location.href = '/home'
             }
         })
        //.then((response)=>{
        //     if(response){
        //         //const id = response.user._id
        //         //document.location.href = '/home'
        //     }
        //})
    })
