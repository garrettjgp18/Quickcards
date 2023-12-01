import YOUR_TOKEN from "../secret";

// Track submission of TextField
document.getElementById('userForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    let videoURL = document.getElementById('userInput').value;

    console.log(videoURL);

    
    function OpenaiFetchAPI(videoURL) {
        console.log("Calling GPT-3.5 Turbo")
        var url = "https://api.openai.com/v1/chat/completions"; // Change to the chat-based endpoint
        var bearer = 'Bearer ' + YOUR_TOKEN
        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': bearer,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "model": "gpt-3.5-turbo",
                "messages": [{
                    "role": "system",
                    "content": "You are a helpful assistant that creates flashcards based off the schema of the input"
                },{
                "role": "user",
                "content": `${videoURL}`
                }
            ],
                "temperature": 0, // Adjust temperature as needed
                "top_p": 1,
                "n": 1,
                "stream": false,
                "logprobs": null,
                "stop": "\n"
            })
        }).then(response => {
            return response.json();
        }).then(data => {
            console.log("LOOK AT ME!");
            console.log(data);
            console.log(typeof data);
            console.log(Object.keys(data));
            console.log(data['choices'][0].text);
        }).catch(error => {
            console.log('Something bad happened ' + error);
        });
    }

    OpenaiFetchAPI(videoURL);
});
