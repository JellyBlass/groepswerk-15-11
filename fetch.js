const url = 'http://localhost:3000/posts';
const output = document.getElementById('output');
const savedOutput = document.getElementById('savedGifts');


function fetchdata() 
{
    output.innerHTML = '';
    fetch(url)
    .then(res => res.json())
    .then(data => {
        console.log(data.length);
        for(i = 0; i < data.length; i++){
            console.log(data[i]);
        }
        if(data.length === 0)
        {
            console.log("Ik ben erin");
            const noGiftsMessage = document.createElement('div');
            noGiftsMessage.className = 'no-gifts-message';
            noGiftsMessage.textContent = 'No gift lists available. Add your fist gift list so santa knows what you want.';
            output.appendChild(noGiftsMessage);
            return;
        }
        if (data.length > 0){
            for(i = 0; i < data.length; i++){
                output.innerHTML += `<div class="post-item">
                    <div>${data[i].child} gets ${data[i].toy}: ${data[i].numtoy} times</div>
                    <button onclick="deleteGifts('${data[i].id}')" style="float:right;">Delete</button>
                    <button onclick="updatePost('${data[i].id})" style="float:right;" >Update</button>
                </div>`;
            }
        }  
    })
    
    .catch(e => console.log(e));
}

const button = document.getElementById('clear');

document.getElementById('clearStorage').addEventListener('click', () => 
{
    if(confirm('Are you sure you want to clear all the gift requests ?'))
    {
        localStorage.removeItem('savedGifts');
        const noGiftsMessage = document.createElement('div');
        noGiftsMessage.className = 'no-gifts-message';
        noGiftsMessage.textContent = 'No gift list saved yet';
        savedOutput.appendChild(noGiftsMessage);
        return;
        loadSavedGifts();
    }
})
document.getElementById('refresh').addEventListener('click', fetchdata);

function deleteGifts(id) {
    fetch(`${url}/${id}`, {
        method: 'DELETE'
    })
    .then(() => fetchdata())
    .catch(e => console.error('Error deleting gift:', e));
}

function addGifts() {
    const newPost = {
        child: document.getElementById('namekid').value,
        toy: document.getElementById('nametoy').value,
        numtoy: parseInt(document.getElementById('gifts').value)
    };
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPost)
    })
    .then(res => res.json())
    .then(() => {
        fetchdata();
        document.getElementById('namekid').value ='';
        document.getElementById('nametoy').value = '';
        document.getElementById('gifts').value = '';
    })
    .catch(e => console.error('Error adding gift list:', e));
}

function loadSavedGifts()
{
    try
    {
        const savedGifts = JSON.parse(localStorage.getItem('savedGifts' || '[]'));
        savedOutput.innerHTML = '';
        console.log(savedGifts.length);
        if (savedGifts.length > 0)
        {
            for(i = 0; i < savedGifts.length; i++){
                savedOutput.innerHTML += `<div class="post-item">
                    <div>[${savedGifts[i].id}]${savedGifts[i].child} gets ${savedGifts[i].toy}: ${savedGifts[i].numtoy} times</div>
                    <button onclick="removeFromSaved('${savedGifts[i].id}')" style="float:right;">Delete</button>
                    <button onclick="updatePost('${savedGifts[i].id})" style="float:right;" >Update</button>
                </div>`;
            }
        }

    }catch (error)
    {
        if(error = "TypeError: Cannot read properties of null (reading 'length')"){
            localStorage.removeItem('savedGifts');
            const noGiftsMessage = document.createElement('div');
            noGiftsMessage.className = 'no-gifts-message';
            noGiftsMessage.textContent = 'No gift list saved yet';
            savedOutput.appendChild(noGiftsMessage);
            return;
        }
        console.error('Error loading saved gift requests:', error);
        localStorage.setItem('savedGifts', '[]');

    }
}

function saveToLocal(giftId)
{
    try
    {
        const gift = 
        {
            id: giftId => {
                try{
                    if(savedGifts.length > 0){
                        giftId = savedGifts.length + 1;
                    }
                }
                catch(e){
                    console.log(e);
                }
                return this.giftId;
            },
            child: document.getElementById('namekid').value,
            toy: document.getElementById('nametoy').value,
            numtoy: parseInt(document.getElementById('gifts').value)
        };
        console.log(giftId);
        const savedGifts = JSON.parse(localStorage.getItem('savedGifts') || '[]');
        
        if(!savedGifts.some(g => g.id === gift.id))
        {
            console.log("ik werk tot hier");
            savedGifts.push(gift);
            localStorage.setItem('savedGifts', JSON.stringify(savedGifts));
            loadSavedGifts();
        }
        else
        {
            alert('This gift request has already been saved!');
        }
    }
    catch(error)
    {
        console.error('Error saving gift list', error);
    }
}
function removeFromSaved(giftId)
{
    try
    {
        const savedGifts = JSON.parse(localStorage.getItem('savedGifts') || '[]');
        const giftIdString = String(giftId);
        const updatedGifts = savedGifts.filter(gift => gift.id !== giftIdString);
        localStorage.setItem('savedGifts', JSON.stringify(updatedGifts));
        loadSavedGifts();
    }
    catch (error)
    {
        console.error('Error removing saved gift request:', error);
    }
}


fetchdata();
loadSavedGifts();