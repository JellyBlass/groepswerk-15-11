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
        const sortedData = data.sort((a, b) => b.timestamp - a.timestamp);
            sortedData.forEach(post => {
                output.innerHTML += `
                    <div class="post-item" id="post-${post.id}">
                        <span class="post-content">${post.title} (${post.views}) (${post.likes || 0})</span>
                        <div class="edit-form" style="display: none;">
                            <input type="text" class="edit-title" value="${post.title}">
                            <input type="number" class="edit-views" value="${post.views}">
                            <input type="number" class="edit-likes" value="${post.likes || 0}">
                            <button class="smallbutton" onclick="saveEdit('${post.id}')">S</button>
                            <button class="smallbutton" onclick="cancelEdit('${post.id}')">X</button>
                        </div>
                        <div class="button-group">
                            <button onclick="editPost('${post.id}')">Edit</button>
                            <button onclick="saveToLocal('${post.id}', '${post.title}', ${post.views}, ${post.likes || 0}, ${post.timestamp})">Save</button>
                            <button onclick="deletePost('${post.id}')">Delete</button>
                        </div>
                    </div>
                `;
            });  
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
        try {
            const savedGifts = JSON.parse(localStorage.getItem('savedGifts') || '[]');
            savedOutput.innerHTML = '';
            
            if (savedGifts.length === 0) {
                const noPostsMessage = document.createElement('div');
                noPostsMessage.className = 'no-posts-message';
                noPostsMessage.textContent = 'No saved posts yet!';
                savedOutput.appendChild(noPostsMessage);
                return;
            }
    
            // Sort saved posts by timestamp in descending order
            savedGifts.sort((a, b) => b.timestamp - a.timestamp);
            savedGifts.forEach(post => {
                const postDiv = document.createElement('div');
                postDiv.className = 'post-item';
                postDiv.innerHTML = `
                    <span>${post.title} (${post.views}) (${post.likes || 0})</span>
                    <button onclick="removeFromSaved('${post.id}')">Remove</button>
                `;
                savedOutput.appendChild(postDiv);
            });
        } catch (error) {
            console.error('Error loading saved posts:', error);
            localStorage.setItem('savedGifts', '[]');
        }
        }
    catch (error) {
        console.error('Error loading saved posts:', error);
        localStorage.setItem('savedGifts', '[]');
    }
}

function saveToLocal(postId, postTitle, postViews, postLikes, timestamp) {
    try {
        const post = {
            id: postId,  // postId is received as a string
            title: postTitle,
            views: postViews,
            likes: postLikes || 0,
            timestamp: timestamp
        };
        const savedGifts = JSON.parse(localStorage.getItem('savedGifts') || '[]');
        
        if (!savedGifts.some(p => p.id === post.id)) {  // Comparing strings with strings
            savedGifts.push(post);
            localStorage.setItem('savedGifts', JSON.stringify(savedGifts));
            loadSavedGifts();
        } else {
            alert('This post is already saved!');
        }
    } catch (error) {
        console.error('Error saving post:', error);
    }
}
function removeFromSaved(postId) {

    try {
        const savedGifts = JSON.parse(localStorage.getItem('savedGifts') || '[]');
        // Convert postId to string for consistent comparison
        const postIdString = String(postId);
        const updatedPosts = savedGifts.filter(post => post.id !== postIdString);
        localStorage.setItem('savedGifts', JSON.stringify(updatedPosts));
        loadSavedGifts();
    } catch (error) {
        console.error('Error removing saved post:', error);
    }
}


fetchdata();
loadSavedGifts();