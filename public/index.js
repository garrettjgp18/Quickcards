document.addEventListener("DOMContentLoaded", function() {

    // Put your key here
    const YOUR_TOKEN = 'YOUR KEY';

    // Track submission of TextField
    document.getElementById('userForm').addEventListener('submit', async function(e) {
        e.preventDefault();

        // Sets videoURL to the input from the HTML field once the 'Enter' key is pressed
        let videoURL = document.getElementById('userInput').value;

        // Make sure input is tracked
        console.log(videoURL);

        // Pass input into method
        function OpenaiFetchAPI(videoURL) {
            // Make sure method is called
            console.log("Fetching API")
            // Holds endpoint for API
            var url = "https://api.openai.com/v1/chat/completions"; // Change to the chat-based endpoint
            // Holds modification to API key so it can authenticate
            var bearer = 'Bearer ' + YOUR_TOKEN
            // Uses Fetch, along with params needed to use OpenAI api
            fetch(url, {
                // We want to send and recieve data, so we use POST
                method: 'POST',
                headers: {
                    'Authorization': bearer,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "model": "gpt-3.5-turbo",
                    "messages": [{
                        "role": "system",
                        "content": `You are a helpful assistant that creates flashcards from the schema ${videoURL}. Pick 10 keywords that deal with the schema and define them.`
                    },{
                    "role": "user",
                    "content": `${videoURL}`
                    }
                ],
                    "temperature": 0.5, // Tempure adjust the answer ranges
                    "top_p": 1,
                    "n": 1,
                    "stream": false,
                    "logprobs": null,
                    "stop": "\n"
                })
            }).then(response => {
                return response.json();
            }).then(data => {
                console.log(data);
                console.log(typeof data);
                console.log(Object.keys(data));
                console.log(data['choices'][0]['message']['content']);
                document.getElementById('flashcards').innerHTML = (data['choices'][0]['message']['content']);
            }).catch(error => {
                console.log('Something bad happened ' + error);
            });
        }

        // Run method
        OpenaiFetchAPI(videoURL);
    });

});


// This was the python code - try to mimic it

// # Construct a single prompt containing all keywords
// #     prompt = "\n".join(
// #         [
// #             f"Define the keyword '{keyword}' in the context of the schema: {summary}. Definitions cannot be more than 10 words"
// #             for keyword in keywordArray
// #         ]
// #     )

// #     # Add system and user messages to the prompt
// #     messages = [
// #         {
// #             "role": "system",
// #             "content": "You are a helpful assistant that creates Flashcards",
// #         },
// #         {"role": "user", "content": prompt},
// #     ]

// #     # Add assistant messages for each keyword
// #     for keyword in keywordArray:
// #         messages.append({"role": "assistant", "content": f"Define {keyword}"})

// #     # Make a single API call
// #     response = openai.ChatCompletion.create(
// #         model="gpt-3.5-turbo",
// #         messages=messages,
// #         max_tokens=1500
// #         # 1000 tokens gets roughly 50 flashcards
// #     )

// #     # Extract and print definitions for each keyword

// #     for keyword, choice in zip(keywordArray, response["choices"]):
// #         definition = choice["message"]["content"]
// #         f = open("OpenAI.txt", "w")
// #         f.write(f"{definition}")
// #         print("Output written in OpenAI.txt")
// #         f.close()
