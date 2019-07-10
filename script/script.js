$(document).ready(() => {
    //Hardcoded users in object to show login validation
    let UserService = {
        logIn: (username, password, users) => {
            let loggedIn = false;
            for (let user of users) {
                if (user.username === username) {
                    if (user.password === password) {
                        loggedIn = true;
                        location.href = "flightsHotels.html"
                    }
                }
            }
            if (!loggedIn) {
                $("body").append("<p>Incorrect Username or Password</p>")
            }
        },

        registerValidation: (username, users) => {
            let usernameCheck = false;
            for (const user of users) {
                if (username === user.username) {
                    alert("Username is already exists! Try again")
                    usernameCheck = true;
                }
            }
            if (!usernameCheck) {
                location.href = "flightsHotels.html";
                let user = new User(RegisterService.firstNameRegisterInput.val(), RegisterService.lastNameRegisterInput.val(), RegisterService.usernameRegisterInput.val(), RegisterService.passwordRegisterInput.val(), RegisterService.countryRegisterInput.val());
                Users.push(user);
                for (const user of Users) {
                    console.log(user);
                }
            }
        }
    }

    let Users = [{
        id: 1,
        firstName: "Martin",
        lastName: "Petrovski",
        username: "petrovskim",
        password: "mmm",
        country: "Macedonia"
    },
    {
        id: 2,
        firstName: "Dario",
        lastName: "Kostov",
        username: "kostovd",
        password: "ddd",
        country: "Macedonia"
    },
    {
        id: 3,
        firstName: "Goran",
        lastName: "Todorovski",
        username: "todorovskig",
        password: "ggg",
        country: "Macedonia"
    }
    ]

    let LoginService = {
        loginBtn: $("#main-login-btn"),
        usernameLoginInput: $("#main-username-login-input"),
        passwordLoginInput: $("#main-password-login-input")
    }

    let RegisterService = {
        registerBtn: $("#register-btn"),
        firstNameRegisterInput: $("#first-name-register-input"),
        lastNameRegisterInput: $("#last-name-register-input"),
        usernameRegisterInput: $("#username-register-input"),
        passwordRegisterInput: $("#password-register-input"),
        countryRegisterInput: $("#country-register-input")
    }

    //Login validation logic
    LoginService.loginBtn.on("click", (e) => {

        e.preventDefault();
        UserService.logIn(LoginService.usernameLoginInput.val(), LoginService.passwordLoginInput.val(), Users);
    })

    //Registrer logic
    RegisterService.registerBtn.on("click", (e) => {
        e.preventDefault();
        UserService.registerValidation(RegisterService.usernameRegisterInput.val(), Users);
    })

    class User {
        constructor(firstname, lastname, username, password, c) {
            this.id = Users.length + 1;
            this.firstName = firstname;
            this.lastName = lastname;
            this.userName = username;
            this.password = password;
            this.country = c === "" ? this.country = null : this.country = c;
        }
    }
})