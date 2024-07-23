document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
      if (data.token) {
        localStorage.setItem('token', data.token);
        alert('Login successful');
        window.location.href = '/chart';
      } else {
        console.error('Login failed');
        alert('Login failed');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred during login');
    });
  });
  