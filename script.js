document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const submitBtn = document.getElementById('submitBtn');
    const guestBtn = document.getElementById('guestBtn');

    // Handle form validation and mock submission
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevents standard page refresh

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        // Basic verification check
        if (!email || !password) {
            alert('Please fill out all required fields.');
            return;
        }

        // Visual loading state feedback
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing Secure Payment...';

        // Simulate secure bank authentication response delays
        setTimeout(() => {
            alert(`Payment Simulation Successful!\nAccount: ${email}\nAmount: $49.99`);
            
            // Restore button interface state
            submitBtn.disabled = false;
            submitBtn.textContent = 'Log In to Pay';
            loginForm.reset();
        }, 1800);
    });

    // Mock redirection handler for secondary workflow button
    guestBtn.addEventListener('click', () => {
        alert('Redirecting to the Debit/Credit standard guest checkout intake form...');
    });
});
