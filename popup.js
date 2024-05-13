


// app.js
const dashboardLink = document.getElementById('dashboard-link');
const loginLink = document.getElementById('login-link');
const signupLink = document.getElementById('signup-link');

const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

const blockedWebsiteInput = document.getElementById('blocked-website-input');
const blockedWebsiteButton = document.getElementById('blocked-website-button');

const browsingDataButton = document.getElementById('browsing-data-button');
const browsingDataList = document.getElementById('browsing-data-list');

// Show/hide different sections
dashboardLink.addEventListener('click', () => {
    dashboard.classList.remove('hidden');
    loginForm.classList.add('hidden');
    signupForm.classList.add('hidden');
});

loginLink.addEventListener('click', () => {
    dashboard.classList.add('hidden');
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
});

signupLink.addEventListener('click', () => {
    dashboard.classList.add('hidden');
    loginForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
});




chrome.storage.sync.get('token', (result) => {
    const token = result.token;
    fetch('http://127.0.0.1:3000/browsing_times', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            Object.entries(data).forEach(([host, time]) => {
                const listItem = document.createElement('li');
                listItem.textContent = `${host} - ${Math.floor(time / 3600000)}hours ${Math.floor((time % 3600000) / 60000)}minutes`;
                browsingDataList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error(error);
            // Handle the error here, such as showing an error message to the user.
        });
});







// signupForm.addEventListener('submit', (event) => {
//     event.preventDefault();
//     const name = document.getElementById('register-name');
//     const username = document.getElementById('register-username');
//     const email = document.getElementById('register-email');
//     const password = document.getElementById('register-password');
//     const confirmPassword = document.getElementById('register-confirmpassword');
//     userData = {
//         "name": name.value,
//         "username": username.value,
//         "email": email.value,
//         "password": password.value,
//         "confirmPassword": confirmPassword.value
//     }
//     fetch('http://127.0.0.1:3000/users', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(userData)
//     })
//         .then(response => {
//             if (response.status == 201) {
//                 // Registration successful
//                 signupForm.innerHTML = `<h2>registration successfull please login</h2>`
//             } else {
//                 // Registration failed
//                 alert('registration failed');
//                 name.value = "";
//                 username.value = "";
//                 email.value = "";
//                 password.value = "";
//                 confirmPassword.value = "";
//             }
//         })
//         .catch(error => {
//             alert('Error:' + error);
//         });
// })


document.addEventListener('DOMContentLoaded', function () {
    const signupForm = document.getElementById('signup-form'); // Get the form element

    if (signupForm) { // Check if the form element exists
        signupForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const name = document.getElementById('register-name');
            const username = document.getElementById('register-username');
            const email = document.getElementById('register-email');
            const password = document.getElementById('register-password');
            const confirmPassword = document.getElementById('register-confirmpassword');

            userData = {
                "name": name.value,
                "username": username.value,
                "email": email.value,
                "password": password.value,
                "confirmPassword": confirmPassword.value
            }

            fetch('http://127.0.0.1:3000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })
                .then(response => {
                    if (response.status == 201) {
                        // Registration successful
                        signupForm.innerHTML = `<h2>Registration successful! Please log in.</h2>`;
                    } else {
                        // Registration failed
                        alert('Registration failed');
                        name.value = "";
                        username.value = "";
                        email.value = "";
                        password.value = "";
                        confirmPassword.value = "";
                    }
                })
                .catch(error => {
                    alert('Error: ' + error);
                });
        });
    } else {
        alert('signupForm element not found in the DOM.');
    }
});



loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('login-email');
    const password = document.getElementById('login-password');
    userData = {
        "email": email.value,
        "password": password.value
    }
    fetch('http://127.0.0.1:3000/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                alert('Login failed');
                email.value = "";
                password.value = "";
            }
        })
        .then(data => {
            // Store token and user information in Chrome storage
            chrome.storage.sync.set({
                'token': data.token,
                'username': data.username
            });

            // Optional: Set expiration time if needed
            localStorage.setItem('tokenExpiration', data.exp);

            // Update UI
            loginForm.innerHTML = `<h2>Login successful, happy browsing</h2>`;
        })
        .catch(error => {
            alert('Error:' + error);
        });
});


blockedWebsiteButton.addEventListener('click', (event) => {
    event.preventDefault();
    chrome.storage.sync.get('token', (data) => {
        userData = {
            "hostname": blockedWebsiteInput.value
        }
        const token = data.token;
        fetch('http://127.0.0.1:3000/blocked_hosts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(userData)
        })
            .then(response => {
                if (response.ok) {
                    alert(blockedWebsiteInput.value + 'blocked');
                } else {
                    alert('failed to block given website');
                    blockedWebsiteInput.value = "";
                }
            })
            .catch(error => {
                alert('Error:' + error);
            });
    })
})