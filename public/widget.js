(function() {
  function initializeFeedbackWidget(shopOrigin, apiKey) {
    const createApp = window['createApp'];
    const actions = window['actions'];
    
    if (!createApp || !actions) {
      console.error('App Bridge is not properly loaded');
      return;
    }

    const app = createApp({
      apiKey: apiKey,
      shopOrigin: shopOrigin,
    });

    const Modal = actions.Modal;
    const Button = actions.Button;

    // Create feedback button
    const feedbackButton = Button.create(app, {
      label: 'Feedback',
      onClick: () => {
        showFeedbackModal();
      },
    });

    // Render feedback button
    feedbackButton.dispatch(Button.Action.SHOW);

    function showFeedbackModal() {
      const modalOptions = {
        title: 'Provide Feedback',
        message: 'We value your feedback. Please share your thoughts with us.',
        footer: {
          buttons: [
            {
              label: 'Cancel',
              style: Modal.Style.SECONDARY,
              action: () => modal.dispatch(Modal.Action.CLOSE),
            },
            {
              label: 'Submit',
              style: Modal.Style.PRIMARY,
              action: () => submitFeedback(),
            },
          ],
        },
      };

      const modal = Modal.create(app, modalOptions);
      modal.dispatch(Modal.Action.OPEN);

      // Add form fields to the modal
      const messageInput = document.createElement('textarea');
      messageInput.placeholder = 'Your feedback';
      messageInput.style.width = '100%';
      messageInput.style.marginBottom = '10px';

      const emailInput = document.createElement('input');
      emailInput.type = 'email';
      emailInput.placeholder = 'Your email (optional)';
      emailInput.style.width = '100%';
      emailInput.style.marginBottom = '10px';

      const ratingInput = document.createElement('input');
      ratingInput.type = 'number';
      ratingInput.min = '1';
      ratingInput.max = '5';
      ratingInput.placeholder = 'Rating (1-5)';
      ratingInput.style.width = '100%';
      ratingInput.style.marginBottom = '10px';

      modal.dispatch(Modal.Action.UPDATE, {
        contents: [messageInput, emailInput, ratingInput],
      });

      function submitFeedback() {
        const message = messageInput.value;
        const email = emailInput.value;
        const rating = ratingInput.value;

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
            modal.dispatch(Modal.Action.UPDATE, {
              message: 'Feedback submitted successfully!',
            });
            setTimeout(() => modal.dispatch(Modal.Action.CLOSE), 2000);
          } else {
            modal.dispatch(Modal.Action.UPDATE, {
              message: 'Error submitting feedback: ' + (data.error || 'Unknown error'),
            });
          }
        })
        .catch(error => {
          console.error('Error:', error);
          modal.dispatch(Modal.Action.UPDATE, {
            message: 'An error occurred while submitting feedback.',
          });
        });
      }
    }
  }

  // Expose the initialization function globally
  window.initializeFeedbackWidget = initializeFeedbackWidget;
})();

