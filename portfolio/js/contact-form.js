document.addEventListener('DOMContentLoaded', () => {
    const enquiryForm = document.getElementById('enquiry-form');
    const successModal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const submitBtn = enquiryForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    // Formspree Endpoint - Replace with your own ID
    // Create an account at https://formspree.io/ to get your ID
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mvzwdzjw'; 

    if (enquiryForm) {
        enquiryForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

            const formData = new FormData(enquiryForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch(FORMSPREE_ENDPOINT, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    // Success
                    showModal();
                    enquiryForm.reset();
                } else {
                    // Error from server
                    const result = await response.json();
                    if (Object.hasOwn(result, 'errors')) {
                        alert(result["errors"].map(error => error["message"]).join(", "));
                    } else {
                        alert('Oops! There was a problem submitting your form. Please try again later.');
                    }
                }
            } catch (error) {
                // Network error
                alert('Oops! There was a problem submitting your form. Please check your connection.');
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }

    function showModal() {
        successModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scroll
    }

    function hideModal() {
        successModal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scroll
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', hideModal);
    }

    // Close modal when clicking outside content
    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
            hideModal();
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && successModal.classList.contains('active')) {
            hideModal();
        }
    });
});
