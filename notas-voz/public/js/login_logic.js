const email_input = document.getElementById('login-email')
const password_input = document.getElementById('login-password')
const submit_button = document.getElementById('login-submit')


submit_button.addEventListener('click', async () => {

    const email_value = email_input.value
    const password_value = password_input.value
    
    if(!email_value || !password_value) {
        alert('invalid email or passowrd')
        return 
    }

    const body_json = {email: email_value, password: password_value}

    const resp = await fetch('/login', {method: 'POST', headers: {'Content-type': 'application/json'},  body: JSON.stringify(body_json)})
    const data = await resp.json()

    localStorage.setItem( 'username', data.username )

    if(data.status) window.location.href = '/'
    else alert(data.msg)
})