const submitbtn = document.querySelector('#submit')
const update = document.querySelector('#update')
const title = document.querySelector('#title')
const deadline = document.querySelector('#deadline')
const status = document.querySelectorAll('#status-field input')
const search = document.querySelector('#doSearch')
const list = document.querySelector('#list')
const todoList = []
let uniId = 0

update.setAttribute('style', 'display:none')
submitbtn.addEventListener('click', handleSubmit)
update.addEventListener('click', handleUpdate)
search.addEventListener('click', handleSearch)
window.addEventListener('load',() => {
    let saveList = JSON.parse(localStorage.getItem('todolist'))
    if(saveList.length){
        for(let i = 0; i < saveList.length; i++){
            todoList.push(saveList[i])
        }
        render(todoList)
    }
});

function handleUpdate(){
    for(let i = 0; i < todoList.length; i++){
        if(todoList[i].isChooseToUpdate){
            const status = document.querySelectorAll('#status-field input')
            let statusChecked = ''
            status.forEach(item => {if(item.checked){statusChecked = item.value }})
            todoList.splice(i, 1, {
                uniqueId: todoList[i].uniqueId,
                isChooseToUpdate: false,
                title: title.value,
                deadline: deadline.value,
                status: statusChecked
            })
        }
    }
    render(todoList)
    cleanUp()
    submitbtn.removeAttribute('style')
    update.setAttribute('style', 'display:none')
    localStorage.setItem('todolist', JSON.stringify(todoList))
}

function handleSubmit(){
    const status = document.querySelectorAll('#status-field input')
    let statusChecked = ''
    status.forEach(item => {if(item.checked){statusChecked = item.value }})
    todoList.push({
        uniqueId: uniId,
        isChooseToUpdate: false,
        title: title.value,
        deadline: deadline.value,
        status: statusChecked
    })
    localStorage.setItem('todolist', JSON.stringify(todoList))
    render(todoList)
    cleanUp()
    uniId+=1
}

function handleDelete(event){
    let parentId = parseInt(event.target.parentNode.parentNode.id)
    todoList.forEach((item, index) => {
        if(item.uniqueId == parentId) todoList.splice(index, 1)
    })
    render(todoList)
    localStorage.setItem('todolist', JSON.stringify(todoList))
}

function handleEdit(event){
    update.removeAttribute('style')
    submitbtn.setAttribute('style', 'display:none')
    let parentId = parseInt(event.target.parentNode.parentNode.id)
    let todo= {}
    todoList.forEach((item, index) => {
        if(item.uniqueId == parentId) todo = item
    })
    title.value = todo.title
    deadline.value = todo.deadline
    const status = document.querySelectorAll('#status-field input')
    status.forEach(item => {if(item.value == todo.status){item.checked = true }})
    todo.isChooseToUpdate = true
}

function handleColorStatus(deadline, status){
    let color = ''
    let today = new Date()
    let dl = new Date(deadline)
    if(status == 'inprogress'&& today > dl) return `background-color:#f72585`
    if(status == 'done') color = 'green'
    if(status == 'inprogress') color = 'orange'
    return `background-color:${color}`
}

function template(index, infor){
    let {uniqueId, title, deadline, status} = infor
    return(
        `<div id='${uniqueId}' class=' w-full flex items-center justify-between border-2 border-black rounded mt-1 h-16 bg-[#ffc8dd]' style='${handleColorStatus(deadline, status)}'>
            <h3 class='w-48 text-center'>${index}</h3>
            <p class='w-48 text-center'>${title}</p>
            <p class='w-48 text-center'>${deadline}</p>
            <p class='w-48 text-center'>${status}</p>
            <div class='w-48 flex justify-around'>
                <button onclick='handleEdit(event)' class='border-2 border-black rounded w-14 bg-[white]'>edit</button>
                <button onclick='handleDelete(event)' class='border-2 border-black rounded w-14 bg-[white]'>delete</button>
            </div>
        </div>`
    )
}

function render(listToRender){
    let renderValue = ''
    listToRender.forEach((item, i) => {renderValue += template(i+1, item)})
    list.innerHTML = renderValue
}

function cleanUp(){
    const status = document.querySelectorAll('#status-field input')
    title.value = ''
    deadline.value = ''
    status.forEach(item => item.checked = false)
}

function cleanUpSearch(){
    const searchStatus = document.querySelectorAll('#status-search-field input')
    const searchTitle = document.querySelector('#search')
    const searchDate = document.querySelectorAll('.search-date')
    searchDate.value = ''
    searchTitle.value = ''
    searchStatus.forEach(item => item.checked = false)
}

// search....................

function handleSearch(){
    const searchTitle = document.querySelector('#search')
    const searchDate = document.querySelectorAll('.search-date')
    const searchStatus = document.querySelectorAll('#status-search-field input')
    let searchList = [...todoList]
    // title
    if(searchTitle.value){
        searchList = searchList.filter(item => item.title.includes(searchTitle.value))
    }
    // status
    if(Array.from(searchStatus).some(item => item.checked == true)){
        let statusChecked = ''
        searchStatus.forEach((item, i) => {if(item.checked) statusChecked = searchStatus[i].value})
        searchList = searchList.filter(item => {
            return (item.status === statusChecked)
        })
    }
    // deadline
    if(Array.from(searchDate).every(item => item.value)){
        let minDate = new Date(searchDate[0].value)
        let maxDate = new Date(searchDate[1].value)
        searchList = searchList.filter(item => {
            return (minDate < new Date(item.deadline) && new Date(item.deadline) < maxDate)
        })
    }
    render(searchList)
    cleanUpSearch()
}