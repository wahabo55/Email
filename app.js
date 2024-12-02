document.addEventListener('DOMContentLoaded', () => {
    const generateButton = document.getElementById('generate');
    const input = document.getElementById('input');
    const output = document.getElementById('output');
    const recipientInput = document.getElementById('recipient'); // To: field
    const subjectInput = document.getElementById('subject'); // Subject field

    // Replace with your actual API Key from Google Cloud
    const apiKey = 'AIzaSyBOXgrBPhz01fPXrd_1_UEGhP2_iE9RCpA'; // API key for Google AI Studio
  
    generateButton.addEventListener('click', async () => {
      const draftEmail = input.value;
      const recipient = recipientInput.value.trim();
      const subject = subjectInput.value.trim();
  
      if (!draftEmail.trim()) {
        output.textContent = "Please write a draft email.";
        return;
      }
  
      if (!recipient || !subject) {
        output.textContent = "Please provide both recipient and subject.";
        return;
      }
  
      output.textContent = "Generating email...";
  
      // Insert your background here
      const background = "I’m Abdulwahab Alshatti, a computer engineer in the Information Security Section at the Public Authority of Manpower.";
  
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `Expand the following email draft into a detailed, professional email. Stick closely to the draft and avoid adding unrelated information.\n\nRecipient: ${recipient}\nSubject: ${subject}\n\nDraft: ${draftEmail}\n\nPlease focus on enhancing the content based on this information. Don't provide placeholders, and give it ready to send. Add something like "Hope you are doing fine."`
                    },
                  ],
                },
              ],
            }),
          }
        );
  
        if (!response.ok) {
          output.textContent = "Error: " + response.statusText;
          return;
        }
  
        const data = await response.json();
        console.log("API Response:", data);
  
        // Extract the generated text from the parts array
        if (data.candidates && data.candidates.length > 0) {
          const candidate = data.candidates[0];
          let generatedText = candidate?.content?.parts?.[0]?.text || "No generated content found.";
          
          // Clean and filter out unwanted content, leaving only the email's relevant parts
          generatedText = generatedText.replace(/(To:|From:|Subject:|Date:)/g, "") // Remove headers
            .replace(/\n+/g, '\n') // Remove excessive line breaks
            .trim(); // Trim extra spaces
  
          // Structure the generated text to look like an email with spaces
          const structuredEmail = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; background-color: #f4f4f4; border-radius: 10px; max-width: 600px; margin: 0 auto;">
              <p style="margin-top: 20px;">${generatedText.replace(/\n/g, '<br><br>')}</p>
            </div>
          `;
          
          // Display the structured email
          output.innerHTML = structuredEmail;
        } else {
          output.textContent = "Could not generate the email. Please try again.";
        }
      } catch (error) {
        console.error("Error:", error);
        output.textContent = "An error occurred while generating the email.";
      }
    });
});
