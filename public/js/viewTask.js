const fetchTasks = async (url)=>{
    const response = await fetch(url,{
        method:'GET'
    })
    if(response.status == 200){
        return response.json()
    }
    else{
        alert('Found no tasks')
    }
}


const fluidContainer=document.createElement('div');
fluidContainer.className = 'container-fluid mobile-card-container'
fluidContainer.id = 'fluidContainer'

const flexrow = document.createElement('div')
flexrow.className = 'col flex-nowrap flex-sm-wrap'
flexrow.id = 'flexrow'

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

const taskBody = function(response, archived){
    let res=[];
    if(archived != 'archived'){
        res = getValidTasks(response)
        response = res
    }
    for(i=0; i<response.length; i++){   
        let columndiv = document.createElement('div')
        columndiv.className = 'col' 

        let card = document.createElement('div');
        card.className = 'card';
        let cardheader = document.createElement('div');
        cardheader.className = 'card-header'
        let cardBody = document.createElement('div');
        cardBody.className = 'card-body';
        let cardfooter = document.createElement('div');
        cardfooter.className = 'card-footer';

        let description = document.createElement('h5');
        description.className = 'card-title';

        let dueDate = document.createElement('p')
        dueDate.style.fontSize = 'x-large';
        let dueDateText = 'Due Date(yyyy-mm-dd): '

        let label = document.createElement('p')
        let labelText = 'Label: '

        let status = document.createElement('p')
        let statusText = 'Current Status: '

        let a = document.createElement('a')
        a.href = '/tasks/'+response[i]._id
        let update = document.createElement('button')
        update.className = 'btn btn-primary'
        update.innerText = 'Update'  
        a.appendChild(update) 
        

        description.innerText = response[i].description;
        dueDate.innerText = dueDateText.concat(response[i].dueDate.slice(0,10)) 
        label.innerText = labelText.concat(response[i].label)
        status.innerText = statusText.concat(response[i].taskStatus)
        cardBody.appendChild(description);
        cardBody.appendChild(dueDate);
        cardBody.appendChild(label)
        cardBody.appendChild(status)
        cardfooter.appendChild(a);
        card.appendChild(cardBody);
        card.appendChild(cardfooter);
        columndiv.appendChild(card)
        flexrow.appendChild(columndiv)
        }
        fluidContainer.appendChild(flexrow)
        
}

const replaceDiv = function(){
    
    if (fluidContainer) {
            
        document.getElementById('fluidContainer').replaceWith(fluidContainer);
                particleground(fluidContainer, {
                dotColor: '#5cbdaa',
                lineColor: '#5cbdaa'
            });
            
        return;
    }

    fluidContainer = document.getElementById('fluidContainer');
}
    window.onload = fetchTasks('/tasks?completed=false').then((response)=>{
        taskBody(response,'')
        replaceDiv()
    })

const filter = document.getElementById('filter')
filter.onclick = function(){
    const parent = document.getElementById("flexrow");
    parent.innerHTML = ''
    let url = '/tasks?completed=false'  
    let newOld = $("input[name=date]:checked").val()
    let label = $("input[name=label]:checked").val();
    let completed = $("input[name=complete]:checked").val();
    let duedate = document.getElementById('duedate').value

    if(duedate.length != 0){
        url = url.replace('?completed=false', '?')
    }

    if(newOld != undefined){
        if(newOld == 'New'){
            url= url + '&sortBy=createdAt_desc'
        }else{
            url = url + '&sortBy=createdAt_asc?'
        }
    }

    if(label != undefined){
        if(label == 'Personal'){

            url = url+'&label=Personal&sortBy=dueDate_asc'
        }else if(label == 'Work'){
            url = url + '&label=Work&sortBy=dueDate_asc'
        }else if(label == 'Others'){
            url = url+ '&label=Others&sortBy=dueDate_asc'
        }
    }
    let flag=0
    if(completed != undefined){
        if(completed == 'Complete'){
            flag=1
            
            url = url.replace('completed=false','completed=true')
            
        }
    }
    console.log(url)
    fetchTasks(url).then((response)=>{
        console.log(response)
        if(duedate.length != 0){
            const parsedDate = new Date(moment(duedate).toISOString())
            tasks = []
            let check = 0
            for(i=0; i<response.length; i++){
                let resDate = new Date(response[i].dueDate)
                resDate.setDate(resDate.getDate()-1)
                if(resDate.getDate < parsedDate.getDate()){
                    check = 1
                }
                let dddd = parsedDate.getTime() - resDate.getTime()
                if(dddd == 0){
                    tasks.push(response[i])
                }
            }
            console.log(tasks)
            if(check = 1){
                taskBody(tasks,'archived')
                replaceDiv()
            }
            else{
                taskBody(tasks,'')
            replaceDiv()
            }
            
        }else{
            if(flag ==1){
                taskBody(response,'archived')
                replaceDiv()
            }
            else{
                taskBody(response,'')
            replaceDiv()
            }
            
        }
        
    })
}