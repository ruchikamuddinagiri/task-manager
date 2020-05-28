let animation = anime.timeline({loop: false})
  .add({
    targets: '.ml5 .line',
    opacity: [0.5,1],
    scaleX: [0, 1],
    easing: "easeInOutExpo",
    duration: 700,
    autoplay:false
  }).add({
    targets: '.ml5 .line',
    duration: 600,
    easing: "easeOutExpo",
    translateY: (el, i) => (-0.625 + 0.625*2*i) + "em",
    autoplay:false
  }).add({
    targets: '.ml5 .letters-left',
    opacity: [0,1],
    translateX: ["0.5em", 0],
    easing: "easeOutExpo",
    duration: 600,
    offset: '-=300',
    autoplay:false
  }).add({
    targets: '.ml5 .letters-right',
    opacity: [0,1],
    translateX: ["-0.5em", 0],
    easing: "easeOutExpo",
    duration: 600,
    offset: '-=600',
    autoplay:false
  });
  

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
