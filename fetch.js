const url = 'http://localhost:3000/posts';
const output = document.getElementById('output');

function fetchdata() {
    output.innerHTML = '';
    fetch(url)
    .then(res => res.json())
    .then(
        data => data.forEach(smurf => {
            output.innerHTML += `<div class="post-item">
            <li>${smurf.id} ${smurf.title} </li>
            <button onclick="deleteGifts('${smurf.id}')">Delete gift list</button>
            </div>`;
            
        })
    )
    .catch(e => console.log(e));
}
fetchdata();

const button = document.getElementById('clear');



function deleteGifts(id) {
    fetch(`${url}/${id}`, {
        method: 'DELETE'
    })
    .then(() => fetchdata())
    .catch(e => console.error('Error deleting gift:', e));
}

function addPost () {
    const newPost = {
        title: document.getElementById('name').value,
        views: parseInt(document.getElementById('gifts').value),
    };
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPost)
    })
    .then(() => fetchdata())
    .catch(e => console.error('Error adding gift list:', e));
}

