/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
console.log("Hello, World!");
export default {
  async fetch(request, env) {
    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    // Only allow POST requests for submissions
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), { 
        status: 405, 
        headers: { "Content-Type": "application/json" } 
      });
    }

    try {
      // Parse the JSON request from the HTML page
      const { name, email, message } = await request.json();

      // Basic validation check
      if (!name || !email || !message) {
        return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
      }

      // Execute SQL command into D1 database binding named 'DB'
      await env.DB.prepare(
        "INSERT INTO submissions (name, email, message) VALUES (?, ?, ?)"
      )
      .bind(name, email, message)
      .run();

      // Return successful response
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*", // Allows frontend to read response
        },
      });

    } catch (err) {
      return new Response(JSON.stringify({ success: false, error: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
     
      }
    

    return new Response(html, {
     ' <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Contact Form</title>
    <style>
        body { font-family: sans-serif; max-width: 400px; margin: 40px auto; padding: 20px; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; }
        input, textarea { width: 100%; padding: 8px; box-sizing: border-box; }
        button { background: #0070f3; color: white; border: none; padding: 10px 15px; cursor: pointer; }
    </style>
</head>
<body>

    <h2>Send a Message</h2>
    <form id="contactForm">
        <div class="form-group">
            <label for="name">Name:</label>
            <input type="text" id="name" required>
        </div>
        <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" required>
        </div>
        <div class="form-group">
            <label for="message">Message:</label>
            <textarea id="message" rows="4" required></textarea>
        </div>
        <button type="submit">Submit</button>
    </form>
    <p id="responseMessage"></p>

    <script>
        document.getElementById('contactForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const data = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };

            const responseText = document.getElementById('responseMessage');
            responseText.innerText = "Sending...";

            try {
                // Replace with your actual deployed Cloudflare Worker URL
                const response = await fetch('https://your-worker.workers.dev', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();
                if (result.success) {
                    responseText.innerText = "Success! Data saved.";
                    document.getElementById('contactForm').reset();
                } else {
                    responseText.innerText = "Error: " + result.error;
                }
            } catch (err) {
                responseText.innerText = "Failed to connect to backend.";
            }'
        });
    </script>
</body>
</html>



    });
  },
};
