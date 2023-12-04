document.addEventListener("DOMContentLoaded", function() {

    // Put your key here
const YOUR_TOKEN = 'YOUR_KEY_HERE';

    // Track submission of TextField
    document.getElementById('userForm').addEventListener('submit', async function(e) {
        e.preventDefault();


        // document.getElementById('alertMsg').innerHTML = "Generating flashcards. This may take a moment";


        // Sets videoURL to the input from the HTML field once the 'Enter' key is pressed
        let videoURL = document.getElementById('userInput').value;

        // Make sure input is tracked
        console.log(`You chose ${videoURL}`);

        // Pass input into method
        function OpenaiFetchAPI(videoURL) {
            // Make sure method is called
            console.log("Generating now. Please wait")
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
                        "content": `You are a helpful assistant that creates flashcards from the schema ${videoURL}. Define 10 keywords associated with the schema in 10 words
                        or less. Return them as "keyword : definition"`
                    },{
                    "role": "user",
                    "content": `${videoURL}`
                    }
                ],
                    "temperature": 1, // Tempure adjust the answer ranges
                    "top_p": 1,
                    "n": 1,
                })
            }).then(response => {
                return response.json();
            }).then(data => {
                // Print the results to the console to make sure it works
                console.log(data['choices'][0]['message']['content']);
                // document.getElementById('flashcards').innerHTML = (data['choices'][0]['message']['content']);
                const reportData = String(data['choices'][0]['message']['content']);
                // Splits the OpenAI results based on where a literal "." is, followed by numeric values. 
                const pairs = reportData.split(/\d+\.\s/).filter(Boolean);

                // Loops through the results of pairs (.split returns an array), and splits it again based on where each ':'
                // is. 
                for (const pair of pairs) {
                    // Splits the left side into 'keyword', and the right into 'definition. 
                    // map is a shorthand loop that trims each item, removing the unused whitespace
                    const [keyword, definition] = pair.split(':').map(item => item.trim());
                    // Check to ensure correct formatting
                    console.log(keyword);
                    console.log(definition);
                    generateFlashcards(keyword, definition);
                    // document.getElementById('alertMsg').style.display = 'none';
                }


                


            }).catch(error => {
                console.log('An Error Occured: ' + error);
            });
        }


        function generateFlashcards(keyword, definition) {
            const container = document.getElementById('flashcards');
        
            const newCard = document.createElement('div');
            newCard.classList.add('card');
        
            const frontSide = document.createElement('h4');
            const backSide = document.createElement('p');
        
            // Set initial content
            frontSide.textContent = keyword;
            backSide.textContent = definition;
        
            newCard.appendChild(frontSide);
            newCard.appendChild(backSide);
        
            newCard.classList.add('flashcards');
        
            // Use a data attribute to store the state of the card (keyword or description)
            newCard.setAttribute('data-state', 'keyword');
        
            container.appendChild(newCard);
            
            backSide.style.display = 'none';

            newCard.addEventListener('click', function(e) {
                // Get the current state of the card
                const currentState = newCard.getAttribute('data-state');
                // Toggle between keyword and description
                if (currentState === 'keyword') {
                    frontSide.style.display = 'none';
                    backSide.style.display = 'block';
                    newCard.setAttribute('data-state', 'description');
                } else {
                    frontSide.style.display = 'block';
                    backSide.style.display = 'none';
                    newCard.setAttribute('data-state', 'keyword');
                }
            });
        }
        
        

        // Run method
        OpenaiFetchAPI(videoURL);
    });

});