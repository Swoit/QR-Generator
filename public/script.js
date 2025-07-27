const signupForm = document.getElementById('signup-form');
const offerDiv = document.getElementById('offer');
const chatForm = document.getElementById('chat-form');
const messagesDiv = document.getElementById('messages');
const recButton = document.getElementById('get-recs');
const recList = document.getElementById('rec-list');

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        preference: document.getElementById('preference').value
    };
    const res = await fetch('/api/signup', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
    const json = await res.json();
    offerDiv.textContent = json.message;
    offerDiv.classList.remove('hidden');
});

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = document.getElementById('user-input');
    const text = input.value;
    input.value = '';
    appendMessage('You', text);
    const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({message: text})
    });
    const json = await res.json();
    appendMessage('AI', json.reply);
});

recButton.addEventListener('click', async () => {
    const res = await fetch('/api/recommendations');
    const json = await res.json();
    recList.innerHTML = '';
    json.items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        recList.appendChild(li);
    });
});

function appendMessage(sender, text) {
    const p = document.createElement('p');
    p.textContent = `${sender}: ${text}`;
    messagesDiv.appendChild(p);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
