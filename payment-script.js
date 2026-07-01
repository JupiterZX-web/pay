document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('payment-form');
  const cardNumber = document.getElementById('card-number');
  const cardExpiry = document.getElementById('card-expiry');
  const messageBox = document.getElementById('payment-message');
  const payBtn = document.getElementById('pay-btn');

  // Auto-format Card Number (Adds spaces every 4 digits)
  cardNumber.addEventListener('input', (e) => {
    let target = e.target;
    let position = target.selectionEnd;
    let length = target.value.length;
    
    target.value = target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
    
    if(target.value.length !== length) {
        target.selectionEnd = position + (target.value.length - length);
    }
  });

  // Auto-format Expiry Date (Adds slash after MM)
  cardExpiry.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      e.target.value = value.substring(0, 2) + '/' + value.substring(2, 4);
    } else {
      e.target.value = value;
    }
  });

  // Handle Form Submission / Fake Payment API Process
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Disable elements during processing animation
    payBtn.disabled = true;
    payBtn.innerText = "Processing Transaction...";

    // Simulate server response delay (2 seconds)
    setTimeout(() => {
      payBtn.classList.add('hidden');
      form.reset();
      
      messageBox.className = "success";
      messageBox.innerText = "🎉 Payment Successful! Your ranks/coins have been added.";
    }, 2000);
  });
});

