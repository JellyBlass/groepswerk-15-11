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
            <button onclick="deletePost('${smurf.id}')" style="float:right;">Delete</button>
            <button onclick="updatePost('${smurf.id})" style="float:right;" >Update</button>
            </div>`;
            
        })
    )
    .catch(e => console.log(e));
}
fetchdata();

const button = document.getElementById('clear');



function deletePost(id) {
    fetch(`${url}/${id}`, {
        method: 'DELETE'
    })
    .then(() => fetchdata())
    .catch(e => console.error('Error deleting post:', e));
}

function addPost () {
    const newPost = {
        title: document.getElementById('title').value,
        views: parseInt(document.getElementById('views').value),
        likes: parseInt(document.getElementById('likes').value) || 0,
        createdAt: Math.floor(Date.now() / 1000)
    };
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPost)
    })
    .then(() => fetchdata())
    .catch(e => console.error('Error adding post:', e));
}
function updatePost(id) {
    const updatedData = {
        title: document.getElementById('title').value,
        views: parseInt(document.getElementById('views').value),
        likes: parseInt(document.getElementById('likes').value)
    };
    fetch(`${url}/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
    })
    .then(() => fetchdata())
    .catch(e => console.error('Error updating post:', e));
}
