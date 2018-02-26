// brine se o funkcioniranju prijave i registracije na početnoj stranici


// ukoliko je prijavljen, prebacivanje korisnika na glavnu stranicu
if (localStorage.getItem("token")) {
    window.location = "/main.html";
}


// prijava korisika
const loginVue = new Vue({
    el: '#login',
    data: {
        username: "",
        password: "",
        display: "",
        showPassword: false
    },

    methods: {
        login: function (e) {
            e.preventDefault();
            if(!this.username || !this.password) {
                Materialize.toast("Popunite sva polja!", 4000);
                return;
            }
            console.log("Pokušavam login");
            let that = this;

            $.ajax({
                type: 'POST',
                cache: true,
                dataType: 'json',
                data: {
                    "username": that.username,
                    "password": that.password
                },
                url: '/api/users/login',

            }).then(function (data) {
                console.log(data);
                if(data.success) {
                    that.memorizeUser(data);
                    Materialize.toast('Hvala na prijavi!', 4000);
                } else {
                    Materialize.toast('Neuspješna prijava! '+ data.msg, 4000);
                }
            }).fail(function(jqxhr, textStatus, error) {
                console.log(textStatus + " " + error);
                Materialize.toast('Neuspješna prijava! '+ error, 4000);
            });
        },

        memorizeUser: function (data) {
            let token = data.token;
            let userName = data.user.username;
            let userId = data.user.id;
            localStorage.setItem("token", token);
            localStorage.setItem("userName", userName);
            localStorage.setItem("userId", userId);
            setTimeout(function () {
                window.location = "/main.html";
            }, 1500);
        },

        showRegister: function () {
            this.display = "none";
            registerVue.display = "";
        }
    }
});


// registracija korisnika
const registerVue = new Vue({
    el: '#register',
    data: {
        username: "",
        password: "",
        display: "none",
        showPassword: false
    },

    methods: {
        register: function (e) {
            e.preventDefault();
            if(!this.username || !this.password) {
                Materialize.toast("Popunite sva polja!", 4000);
                return;
            }
            console.log("Pokušavam registraciju");
            let that = this;

            $.ajax({
                type: 'POST',
                cache: true,
                dataType: 'json',
                data: {
                    "username": that.username,
                    "password": that.password
                },
                url: '/api/users/register',

            }).then(function (data) {
                console.log(data);
                if(data.success) {
                    Materialize.toast(' ' + data.msg, 4000);
                    that.showLogin();
                } else {
                    Materialize.toast('Greška! ' + data.msg, 4000);
                }
            }).fail(function(jqxhr, textStatus, error) {
                console.log(textStatus + " " + error);
                Materialize.toast('Greška! ' + error, 4000);
            });
        },

        showLogin: function () {
            this.display = "none";
            loginVue.display = "";
        }
    }
});