// brine se o funkcioniranju glavne stranice i navigaciji (rutama)


// ukoliko nije prijavljen, prebacivanje korisnika na ekran prijave
if (!localStorage.getItem("token")) {
    window.location = "/index.html";
}


// popis ruta i komponenti koje se prikazuju ovisno o odabranoj ruti
const routes = [
    {path: '/', component: Overview},
    {path: '/pressure', component: Pressure},
    {path: '/weight', component: Weight},
    {path: '/history', component: History}
];

// instanca VueRouter-a
const router = new VueRouter({
    routes,
    linkActiveClass: "active", // klasa koja se dodaje trenutno aktivnom linku
    scrollBehavior (to, from, savedPosition){
        if(savedPosition){
            return savedPosition
        } else {
            return {x:0, y:0}
        }
    }
});


// glavna Vue instanca
const app = new Vue({
    el: "#app",
    router,
    data: {
        loaded: false,
        username: "",
        userId: "",
        token: "",
        entries: [],
        dates: [],
        weights: [],
        weight: {
            max: 0,
            min: 0,
            avg: 0,
            current: 0
        },
        colors: {
          optimalan: '#4CAF50',
          normalan: '#009688',
          povisen: '#FF9800',
          hipertenzija1: '#F44336',
          hipertenzija2: '#E91E63',
          hipertenzija3: '#9C27B0',
          izoliranaSisHipertenzija: '#795548'
        },
        playing: false
    },

    created: function () {
        this.userName = localStorage.getItem("userName");
        this.userId = localStorage.getItem("userId");
        this.token = localStorage.getItem("token");
        this.getAllEntries();
    },

    methods: {
        logout: function () {
            localStorage.clear();
            window.location = "/index.html";
        },

        getAllEntries: function () {
            let that = this;
            $.ajax({
                type: 'GET',
                cache: true,
                dataType: 'json',
                url: '/api/entries',
                beforeSend: function (xhr) {
                    // header autorizacije
                    xhr.setRequestHeader("Authorization", that.token);
                }
            }).then(function (data) {
                //console.log(data);
                if (data) {
                    that.translateDates(data);
                } else {
                    alert("Neuspješan dohvat podataka!");
                }
            }).fail(function (jqxhr, textStatus, error) {
                console.log(textStatus + " " + error);
            });
        },

        translateDates: function (data) {
            data.forEach(entry => {
                let obj = entry;
                // prevođenje datuma iz UTC ISO formata u hrvatski format
                obj.date = new Date(obj.date).toLocaleString("hr");
                obj.diagnosis = this.diagnose(obj);
                this.entries.push(obj);
            });
            this.prepareWeightData();
        },

        prepareWeightData: function () {
            let sum = 0; // za računanje prosjeka
            this.weight.max = this.entries[0].weight;
            this.weight.min = this.entries[0].weight;
            // priprema podataka, samo datumi i tjelesna masa
            for (let element of this.entries) {
                if (!element.weight) continue;
                this.dates.push(element.date);
                this.weights.push(element.weight);
                // povećanje sume
                sum += element.weight;
                // računanje minimuma i maksimuma
                if (element.weight > this.weight.max) this.weight.max = element.weight;
                if (element.weight < this.weight.min) this.weight.min = element.weight;
            }
            // trenutna i prosječna tjelesna masa
            this.weight.current = this.weights[this.weights.length - 1];
            this.weight.avg = Math.round((sum / this.weights.length) * 100) / 100;
            this.loaded = true;
        },

        diagnose: function (e) {
            if (e.sys < 120 && e.dia < 80) {
                return("optimalan"); //<120 | <80
            } else if ((e.sys >= 120 && e.sys <= 129) && (e.dia >= 80 && e.dia <= 84)) {
                return("normalan"); //120-129 | 80-84
            } else if ((e.sys >= 130 && e.sys <= 139) && (e.dia >= 85 && e.dia <= 89)) {
                return("povisen"); //130-139 | 85-89
            } else if ((e.sys >= 140 && e.sys <= 159) && (e.dia >= 90 && e.dia <= 99)) {
                return("hipertenzija I"); //140-159 | 90-99
            } else if ((e.sys >= 160 && e.sys <= 179) && (e.dia >= 100 && e.dia <= 109)) {
                return("hipertenzija II"); //160-179 | 100-109
            } else if (e.sys >= 180 && e.dia >= 110) {
                return("hipertenzija III"); //>=180 | >=110
            } else if (e.sys >= 140 && e.dia < 90) {
                return("izolirana sistolička  hipertenzija"); //>=140 | <90
            }
            else return "nepoznato";
        },
    }
});