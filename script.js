// Show welcome message
function showMessage() {
    alert('Welcome! Thanks for visiting my website!');
    console.log('Button clicked!');
}

// Handle contact form submission
function handleSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const name = form.elements[0].value;
    const email = form.elements[1].value;
    const message = form.elements[2].value;
    
    console.log('Form submitted!');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Message:', message);
    
    alert(`Thank you ${name}! Your message has been received. We'll contact you at ${email} soon.`);
    
    // Reset form
    form.reset();
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Welcome message in console
console.log('Welcome to My Website!');
console.log('Made with HTML, CSS, and JavaScript');