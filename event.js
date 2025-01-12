document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed");

    const form = document.getElementById("upload-form");

    // Add submit event listener to the form
    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent the default form submission behavior

        const fileInput = document.getElementById("poster-upload");
        const deadlineSelect = document.getElementById("deadline");
        const resultContainer = document.getElementById("result-container");
        const uploadButton = document.getElementById("upload-button");

        // Clear previous result messages
        resultContainer.innerHTML = "";

        // Check if a file is selected
        if (fileInput.files.length === 0) {
            resultContainer.innerHTML = "<p class='text-red-500'>Please select a file to upload.</p>";
            return;
        }

        // Get selected file and deadline
        const file = fileInput.files[0];
        const deadlineValue = deadlineSelect.value;

        // Disable the upload button during upload
        uploadButton.disabled = true;
        uploadButton.classList.add("opacity-50");

        // Prepare form data for upload
        const formData = new FormData();
        formData.append("poster-upload", file);
        formData.append("deadline", deadlineValue);

        try {
            // Make the POST request to the server
            const response = await fetch("https://image-sharing-app.onrender.com/upload", {
                method: "POST",
                body: formData,
            });

            // Handle server response
            if (response.ok) {
                const data = await response.json();
                const uniqueUrl = data.url;

                // Display the uploaded file link
                resultContainer.innerHTML = `
                    <p class="text-green-500">Poster uploaded successfully!</p>
                    <p>Share this link: <a href="${uniqueUrl}" target="_blank" class="text-blue-500 underline">${uniqueUrl}</a></p>
                    <button id="copy-button" class="px-4 py-2 bg-gray-600 text-white rounded-lg shadow mt-2">Copy Link</button>
                `;

                // Add copy functionality to the button
                const copyButton = document.getElementById("copy-button");
                copyButton.addEventListener("click", function () {
                    navigator.clipboard.writeText(uniqueUrl).then(
                        () => {
                            alert("Link copied to clipboard!");
                        },
                        (err) => {
                            console.error("Failed to copy the link:", err);
                        }
                    );
                });
            } else {
                resultContainer.innerHTML = "<p class='text-red-500'>Failed to upload the poster. Try again.</p>";
            }
        } catch (error) {
            console.error("Error during upload:", error);
            resultContainer.innerHTML = "<p class='text-red-500'>An error occurred while uploading the poster.</p>";
        } finally {
            // Re-enable the upload button
            uploadButton.disabled = false;
            uploadButton.classList.remove("opacity-50");
        }
    });
});
