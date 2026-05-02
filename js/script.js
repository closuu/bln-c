

document.addEventListener('DOMContentLoaded', async () => {

   
    const themeToggleBtn = document.getElementById('theme-toggle');

    if (localStorage.getItem('theme') === 'monochrome') {
        document.body.classList.add('monochrome-mode');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('monochrome-mode');
            if (document.body.classList.contains('monochrome-mode')) {
                localStorage.setItem('theme', 'monochrome');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });
    }

    
    if (typeof sb !== 'undefined') {
        const { data: { session } } = await sb.auth.getSession();
        updateNav(session);
    }
});

function updateNav(session) {
    const loginLink    = document.querySelector('a[href="login.html"]');
    const registerLink = document.querySelector('a[href="register.html"]');

    if (session) {
        if (loginLink) {
            loginLink.textContent = 'My Profile';
            loginLink.href = 'user.html';
        }
        if (registerLink) {
            registerLink.textContent = 'Logout';
            registerLink.href = '#';
            registerLink.addEventListener('click', async (e) => {
                e.preventDefault();
                await sb.auth.signOut();
                window.location.href = 'index.html';
            });
        }
    }
}
