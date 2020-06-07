const fetchTasks = async (url)=>{
    const response = await fetch(url,{
        method:'GET'
    })
    if(response.status == 200){
        return response.json()
    }
    else{
        alert('Uh oh! There was an error.')
    }
}

const tasksdiv = document.createElement('div')
tasksdiv.className = 'w-100'
tasksdiv.style.height = 'fit-content'
tasksdiv.id = 'tasksdiv'
tasksdiv.style.backgroundColor = '#5cbdaa'
tasksdiv.style.opacity = 0.8

const marquee = document.createElement('marquee')
marquee.id = 'marquee'
marquee.direction = 'up'
marquee.scrollAmount = "1"
marquee.style.height = 'fit-content'

const tasksText = document.createElement('p')
tasksText.style.fontSize = 'x-large'

const makeMarquee = function(response){
    if(!marquee){
        for(i=0; i<response.length; i++){  
            let ul = document.createElement('ul')
            let li = document.createElement('li')
            li.innerText = response[i].description.concat(', Due by:', response[i].dueDate.slice(10))
            li.style.width = '100%'
            li.style.fontSize = 'large'
            marquee.appendChild(li)
        }
        return marquee
    }
    else{
        marquee.innerText = ""
        for(i=0; i<response.length; i++){   
            let ul = document.createElement('ul')
            let li = document.createElement('li')
            li.innerText = response[i].description.concat(', Due by: ', response[i].dueDate.slice(0,10))
            li.style.width = '100%'
            li.style.fontSize = 'large'
            marquee.appendChild(li)
        }
        return marquee        
    }
}

const replaceDiv = function(){
    if(tasksdiv){
        document.getElementById('tasksdiv').replaceWith(tasksdiv);
        return
    }
    tasksdiv = document.getElementById('tasksdiv');
}

const defaultMarquee = function(response, p){
    tasksdiv.appendChild(p)
    let marquee = makeMarquee(response)
    tasksdiv.appendChild(marquee)
}

const newT = document.getElementById('new')
const old = document.getElementById('old')
const personal = document.getElementById('personal')
const work = document.getElementById('work')
const others = document.getElementById('others')
const completed = document.getElementById('completed')

const getValidTasks = function(response){
    tasks = []
    for(i=0; i<response.length; i++){
        let dueDateObj = new Date(response[i].dueDate)
        let currentDate = new Date()
        let difference = dueDateObj - currentDate
        if(difference > 0){
            tasks.push(response[i])
        }
    }
    return tasks
}

window.onload = fetchTasks('/tasks?sortBy=dueDate_asc&completed=false').then((response)=>{
    let res = getValidTasks(response)
    response = res    
    if(response.length == 0){
        tasksText.innerText = 'Good news! You have no pending tasks.'
    }
    else if(tasksText.innerText != 'These are the tasks that you need to complete ASAP.'){
        tasksText.innerText = 'These are the tasks that you need to complete ASAP.'
    }
    defaultMarquee(response, tasksText)
    replaceDiv()
})

newT.onclick = function(){
    fetchTasks('/tasks?sortBy=createdAt_desc&completed=false').then((response)=>{
        let res = getValidTasks(response)
        response = res
        if(response.length == 0){
            tasksText.innerText = 'Good news! You have no pending tasks.'
        }
        else if(tasksText.innerText != 'These are your newest tasks.'){
            tasksText.innerText = 'These are your newest tasks.'
        }
        defaultMarquee(response, tasksText)
        replaceDiv()
    })
}
old.onclick = function(){
    fetchTasks('/tasks?sortBy=createdAt_asc&completed=false').then((response)=>{
        let res = getValidTasks(response)
        response = res
        if(response.length == 0){
            tasksText.innerText = 'Good news! You have no pending tasks.'
        }
        else if(tasksText.innerText != 'These are your oldest pending tasks.'){
            tasksText.innerText = 'These are your oldest pending tasks.'
        }
        defaultMarquee(response, tasksText)
        replaceDiv()
    })
}

personal.onclick = function(){
    fetchTasks('/tasks?label=Personal&completed=false&sortBy=dueDate_asc').then((response)=>{
        let res = getValidTasks(response)
        response = res
        if(response.length == 0){
            tasksText.innerText = 'Good news! You have no personal tasks.'
        }
        else if(tasksText.innerText != 'These are your pending personal tasks.'){
            tasksText.innerText = 'These are your pending personal tasks.'
        }
        defaultMarquee(response, tasksText)
        replaceDiv()
    })
}

work.onclick = function(){
    fetchTasks('/tasks?label=Work&completed=false&sortBy=dueDate_asc').then((response)=>{
        let res = getValidTasks(response)
        response = res
        if(response.length == 0){
            tasksText.innerText = 'Good news! You have no pending work tasks.'
        }
        else if(tasksText.innerText != 'These are your pending work tasks.'){
            tasksText.innerText = 'These are your pending work tasks.'
        }
        defaultMarquee(response, tasksText)
        replaceDiv()
    })
}

others.onclick = function(){
    fetchTasks('/tasks?label=Others&completed=false&sortBy=dueDate_asc').then((response)=>{
        let res = getValidTasks(response)
        response = res
        if(response.length == 0){
            tasksText.innerText = 'Good news! You have no pending tasks.'
        }
        else if(tasksText.innerText != 'These are your pending tasks.'){
            tasksText.innerText = 'These are your pending tasks.'
        }
        defaultMarquee(response, tasksText)
        replaceDiv()
    })
}

completed.onclick = function(){
    fetchTasks('/tasks?completed=true&sortBy=createdAt_desc').then((response)=>{
        let res = getValidTasks(response)
        response = res
        if(response.length == 0){
            tasksText.innerText = 'Uh Oh! You have not completed any task yet.'
        }
        else if(tasksText.innerText != 'These are your completed tasks.'){
            tasksText.innerText = 'These are your completed tasks.'
        }
        defaultMarquee(response, tasksText)
        replaceDiv()
    })
}