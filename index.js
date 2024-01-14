document.addEventListener("DOMContentLoaded", function() {

    // Put your key here
    const YOUR_TOKEN = 'YOUR_TOKEN_HERE';

    // Set EventListener to run once user hits "Enter" while typing input in text field.
    document.getElementById('userForm').addEventListener('submit', async function(e) {
        e.preventDefault();

        // Give user indiciation that it is infact working 
        document.getElementById('alertMsg').innerHTML = "Generating flashcards. This may take a moment";


        // Sets videoURL to the input from the HTML field once the 'Enter' key is pressed
        let videoURL = document.getElementById('userInput').value;

        // Make sure input is tracked (test purposes)
        console.log(`You chose ${videoURL}`);

        // Pass input into method
        function OpenaiFetchAPI(videoURL) {
            // Make sure method is called (test purposes)
            console.log("Generating now. Please wait")
            // Holds endpoint for API
            var url = "https://api.openai.com/v1/chat/completions";
            // Holds modification to API key so it can authenticate (OpenAI requires it to be formatted this way)
            var bearer = 'Bearer ' + YOUR_TOKEN
            // Uses Fetch, along with params needed to use OpenAI api

            fetch(url, {
                // We want to send and recieve data, so we use POST
                method: 'POST',
                headers: {
                    'Authorization': bearer,
                    'Content-Type': 'application/json'
                },
                /* 
                    This essentially passes in ChatGPT's prompt, formatted in a way that will "always" return the values so that they are able to be split at certain
                    characters. This will make displaying keyword and definition on oposite sides of the flashcard easier. "role" dignifies the GPT prompt, versus the user,
                    essentially creating a call and repsonse. 
                */
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
                    // https://platform.openai.com/docs/api-reference/chat/create
                    "temperature": 1, // Temperature adjust the answer ranges (more creative this way, won't be the same word over and over)
                    "top_p": 1, // Something OpenAI calls "Nuclear Sampling". Also the same concept as Temperature
                    "n": 1, // Same idea as temperature
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
                    // Call sister function to format each card and add it to the appropriate container div / class
                    generateFlashcards(keyword, definition);
                    // Clear the "Generating" message once finished
                    document.getElementById('alertMsg').style.display = 'none';
                }
            // Error handling incase user breaks something somehow
            }).catch(error => {
                console.log('An Error Occured: ' + error);
                // Clear current message 
                document.getElementById('alertMsg').innerHTML = '';
                // Display error message to user incase of any errors
                document.getElementById('alertMsg').innerHTML = "An error occured - did you provide an OpenAI key?";

            });
    }

        // Called by loop (line 69) for each keyword / definiton made by OpenAI.
        function generateFlashcards(keyword, definition) {
            
            // Holds place of where all flashcards will be stored
            const container = document.getElementById('flashcards');
        
            // Each card will be it's own div, with a header (keyword), as well as an paragraph (definition).
            const newCard = document.createElement('div');
            // Add the class "card" to each new card made
            newCard.classList.add('card');
        
            // Set front side of card to be a header type element
            const frontSide = document.createElement('h4');
            // Set back side of card to be a paragraph type element
            const backSide = document.createElement('p');
        
            // Set initial content of both the front and backside of the card.
            frontSide.textContent = keyword;
            backSide.textContent = definition;
        
            // Add the front and backside to each card
            newCard.appendChild(frontSide);
            newCard.appendChild(backSide);
        
            // Add the 'flashcards' class to newCard so formatting is in-line with others
            newCard.classList.add('flashcards');
        
            // Use a data attribute to store the state of the card (keyword or description)
            newCard.setAttribute('data-state', 'keyword');
            
            // Add the new card to the main container
            container.appendChild(newCard);
            
            // Set the initial display of the backside (description) to none, meaning only the keyword will display at the start
            backSide.style.display = 'none';

            // Once user clicks the card...
            newCard.addEventListener('click', function(e) {
                // Get the current state of the card
                const currentState = newCard.getAttribute('data-state');
                // Toggle between keyword and description (turns one display off, the other on).
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
        
        

        // Run method at the end of the Event.
        // Will call it's sister method if no errors occur and create 10 flashcards. 
        OpenaiFetchAPI(videoURL);
    });

});