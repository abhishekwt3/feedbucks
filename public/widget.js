(function() {
  // Create widget container
  const widgetContainer = document.createElement('div');
  widgetContainer.id = 'shopify-feedback-widget';
  document.body.appendChild(widgetContainer);

  // Create widget button
  const widgetButton = document.createElement('button');
  widgetButton.textContent = 'Feedback';
  widgetButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    z-index: 1000;
  `;
  widgetContainer.appendChild(widgetButton);

  // Create feedback form (hidden by default)
  const feedbackForm = document.createElement('div');
  feedbackForm.style.cssText = `
    display: none;
    position: fixed;
    bottom: 80px;
    right: 20px;
    width: 300px;
    padding: 20px;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 5px;
    z-index: 1001;
  `;
  feedbackForm.innerHTML = `
    <textarea id="feedback-message" placeholder="Your feedback" style="width: 100%; margin-bottom: 10px;"></textarea>
    <input type="email" id="feedback-email" placeholder="Your email (optional)" style="width: 100%; margin-bottom: 10px;">
    <input type="number" id="feedback-rating" min="1" max="5" placeholder="Rating (1-5)" style="width: 100%; margin-bottom: 10px;">
    <button id="submit-feedback" style="padding: 5px 10px; background-color: #4CAF50; color: white; border: none; border-radius: 3px; cursor: pointer;">Submit</button>
  `;
  widgetContainer.appendChild(feedbackForm);

  // Toggle feedback form
  widgetButton.addEventListener('click', () => {
    feedbackForm.style.display = feedbackForm.style.display === 'none' ? 'block' : 'none';
  });

  // Handle feedback submission
  document.getElementById('submit-feedback').addEventListener('click', () => {
    const message = document.getElementById('feedback-message').value;
    const email = document.getElementById('feedback-email').value;
    const rating = document.getElementById('feedback-rating').value;

    fetch('https://v0-feedbuck-shopify-appwharfs-projects.vercel.app/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, email, rating }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Feedback submitted successfully!');
        feedbackForm.style.display = 'none';
      } else {
        alert('Error submitting feedback: ' + (data.error || 'Unknown error'));
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred while submitting feedback.');
    });
  });
})();

