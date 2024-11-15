const url = 'http://localhost:3000/posts';
const output = document.getElementById('output');
const savedOutput = document.getElementById('savedGifts');

function fetchdata() 
{
    output.innerHTML = '';
    fetch(url)
    .then(res => res.json())
    .then(data => {
            if(data.length ===0)
            {
                const noGiftsMessage = document.createElement('div');
                noGiftsMessage.className = 'no-gifts-message';
                noGiftsMessage.textContent = 'No gift lists available. Add your fist gift list so santa knows what you want.';
                output.appendChild(noGiftsMessage);
                return;
            }
        
            
        })
    
    .catch(e => console.log(e));
}
fetchdata();

const button = document.getElementById('clear');

document.getElementById('clearStorage').addEventListener('click', () => 
{
    if(confirm('Are you sure you want to clear all the gift requests ?'))
    {
        localStorage.removeItem('savedGifts');
        loadSavedGifts();
    }
})
document.getElementById('clear').addEventListener('click', fetchdata);

function deleteGifts(id) {
    fetch(`${url}/${id}`, {
        method: 'DELETE'
    })
    .then(() => fetchdata())
    .catch(e => console.error('Error deleting gift:', e));
}

function addGifts () {
    const newPost = {
        child: document.getElementById('namekid').value,
        toy: parseInt(document.getElementById('nametoy')),
        numtoy: parseInt(document.getElementById('gifts').value),
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

        if (savedGifts.length === 0)
        {
            const noGiftsMessage = document.createElement('div');
            noGiftsMessage.className = 'no-gifts-message';
            noGiftsMessage.textContent = 'No gift list saved yet';
            savedOutput.appendChild(noGiftsMessage);
            return;
        }

    }catch (error)
    {
        console.error('Error loading saved gift requests:', error);
        localStorage.setItem('savedGifts', '[]');
    }
}

function saveToLocal(giftId, namekid, nametoy, numtoy)
{
    try
    {
        const gift = 
        {
            id: giftId,
            namekid: namekid,
            nametoy: nametoy,
            numtoy: numtoy
        };

        const savedGifts = JSON.parse(localStorage.getItem('savedGifts') || '[]');
        
        if(!savedGifts.some(g => g.id === gift.id))
        {
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
        const updatedGifts = savedGifts.filter(gifts => gift.id !== giftIdString);
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