// Pregled


// postavljen 'var' umjesto 'const/let' jer se preglednik iz nekog razloga žali da je već deklariran ranije, neovisno o imenu varijable (var ima širi 'scope', a let uži)
var Overview = Vue.component('Overview', {
    props: ["entries", "weight", "weights", "dates", "colors"],
    template: `


    <div>
        <h4>Pregled</h4>
       
        <div class="col s12">
            <div class="col m3">
                <div class="card-panel center-align hoverable box">
                    <strong>Prvo mjerenje</strong><br/>{{firstMeasureDate}}
                </div>
            </div>
            
            <div class="col m3">
                <div class="card-panel center-align hoverable box">
                    <strong>Zadnje mjerenje</strong><br/>{{lastMeasureDate}}
                </div>
            </div>
            
            <div class="col m3">
                <div class="card-panel center-align hoverable box">
                    <strong>Vaš krvni tlak</strong><br/>
                    SYS {{lastEntry.sys}} mmHg<br/>
                    DIA {{lastEntry.dia}} mmHg<br/>
                    <i class="material-icons">favorite</i> {{lastEntry.pulse}}/min
                </div>
            </div>
            
            <div class="col m3">
                <div class="card-panel center-align hoverable box">
                    <strong>Vaša tjelesna masa</strong><br/>{{weight.current}} kg
                </div>
            </div>
        </div>
        
        <div class="col m6 s12">
            <div class="card-panel center-align hoverable box">
                <doughnut-chart :data="doughnutpodaci" :options="{responsive: true, maintainAspectRatio: false, 
                    tooltips: {
                        callbacks: {
                            label: function(tooltipItem, data) {
                                let dataset = data.datasets[tooltipItem.datasetIndex];
                                let total = dataset.data.reduce(function(previousValue, currentValue, currentIndex, array) {
                                    return previousValue + currentValue;
                                });
                            let currentValue = dataset.data[tooltipItem.index];
                            let precentage = Math.floor(((currentValue/total) * 100)+0.5);
                            return data.labels[tooltipItem.index] + ': ' + precentage + '%';
                            }
                        },
                        titleFontSize: 20, 
                        titleFontStyle: normal, 
                        bodyFontSize: 20, 
                        bodyFontStyle: normal
                    }, 
                    legend:{
                        labels:{fontSize:16}}
                    }"
                ></doughnut-chart>
            </div>
        </div>
        
        <div class="col m6 s12">
            <div class="card-panel center-align hoverable box">
                <img src="img/human.png" alt="dijagnoza" width="150" class="image-responsive left" :style="{backgroundColor: bojaDijagnoze}"/>
                <strong>Vaša dijagnoza</strong><br/>
                {{javiDijagnozu()}}<br/>
                {{opisDijagnoze}}
                <div class="clearfix"></div>
            </div>
        </div>
        
        <div class="col s12">
            <div class="card-panel center-align hoverable box">
                <line-chart :data="linepodaci" :options="{responsive: true, maintainAspectRatio: false, 
                    tooltips: {
                        callbacks: {
                            title: function() {return '';},
                            beforeLabel: function(tooltipItem, data) {
                                return dates[tooltipItem.index];
                            }
                        },
                        titleFontSize: 20, 
                        titleFontStyle: normal, 
                        bodyFontSize: 20, 
                        bodyFontStyle: normal
                        }, 
                        legend: {
                            display: true, 
                            labels:{fontSize:16}
                        }
                    }"
                ></line-chart>
            </div>
        </div>
    </div>`,


    data: function () {
        return {
            firstMeasureDate: "",
            lastMeasureDate: "",
            lastEntry: "",
            linepodaci: {},
            doughnutpodaci: {},
            syses: [],
            dias: [],
            pulses: [],
            optimalan: 0,
            normalan: 0,
            povisen: 0,
            hipertenzija1: 0,
            hipertenzija2: 0,
            hipertenzija3: 0,
            izoliranaSisHipertenzija: 0,
            opisDijagnoze: "",
            bojaDijagnoze: "transparent"
        }
    },

    methods: {
        izracunBrojevaDijagnoza: function () {
            this.entries.forEach(e => {
                if (e.sys < 120 && e.dia < 80) {
                    this.optimalan++; //<120 | <80
                } else if ((e.sys >= 120 && e.sys <= 129) && (e.dia >= 80 && e.dia <= 84)) {
                    this.normalan++; //120-129 | 80-84
                } else if ((e.sys >= 130 && e.sys <= 139) && (e.dia >= 85 && e.dia <= 89)) {
                    this.povisen++; //130-139 | 85-89
                } else if ((e.sys >= 140 && e.sys <= 159) && (e.dia >= 90 && e.dia <= 99)) {
                    this.hipertenzija1++; //140-159 | 90-99
                } else if ((e.sys >= 160 && e.sys <= 179) && (e.dia >= 100 && e.dia <= 109)) {
                    this.hipertenzija2++; //160-179 | 100-109
                } else if (e.sys >= 180 && e.dia >= 110) {
                    this.hipertenzija3++; //>=180 | >=110
                } else if (e.sys >= 140 && e.dia < 90) {
                    this.izoliranaSisHipertenzija++; //>=140 | <90
                }
            })
        },

        javiDijagnozu: function () {
            let tlakoviArray = [this.optimalan, this.normalan, this.povisen, this.hipertenzija1, this.hipertenzija2, this.hipertenzija3, this.izoliranaSisHipertenzija];
            let tlakoviLabels = ["- Optimalan -", "- Normalan -", "- Povišen -", "- Hipertenzija I -", "- Hipertenzija II -", "- Hipertenzija III -", "-Izolirana sistolička hipertenzija-"];
            let max = Math.max(this.optimalan, this.normalan, this.povisen, this.hipertenzija1, this.hipertenzija2, this.hipertenzija3, this.izoliranaSisHipertenzija);
            // provjera o kojem se indeksu radi, zatim ispis detaljnijeg opisa za svaku dijagnozu
            let index = tlakoviArray.indexOf(max);
            let naslov = tlakoviLabels[tlakoviArray.indexOf(max)];
            let tekst = "";
            let backgroundColors = [this.colors.optimalan, this.colors.normalan, this.colors.povisen, this.colors.hipertenzija1, this.colors.hipertenzija2, this.colors.hipertenzija3, this.colors.izoliranaSisHipertenzija];
            switch (index) {
                case 0:
                    tekst = "Vaš krvni tlak je unutar optimalnih granica. " +
                        "Držite se i dalje zdravih životnih navika, uravnotežene prehrane i redovite tjelovježbe.";
                    break;
                case 1:
                    tekst = "Vaš krvni tlak je unutar normalnih granica. Održavajte i dalje zdrav način života. " +
                        "Slijedite uravnoteženu prehranu i držite se redovite tjelovježbe.";
                    break;
                case 2:
                    tekst = "Vaš krvni tlak je unutar visokih granica. Posjetite Vašeg liječnika koji će Vam propisati odgovarajuće lijekove " +
                        "na temelju Vašeg rizika od kardiovaskularnih bolesti. Pripazite na tjelesnu masu i unos soli.";
                    break;
                case 3:
                    tekst = "U ovoj fazi visokog krvnog tlaka potrebno je obratiti se liječniku kako bi Vam propisao određenu kombinaciju lijekova. " +
                        "Promijenite način života, pripazite na tjelesnu masu i regulirajte unos soli.";
                    break;
                case 4:
                    tekst = "Obratite se liječniku kako bi Vam propisao određenu kombinaciju lijekova. " +
                        "Važno je da promijenite način života, pripazite na tjelesnu masu i regulirate unos soli.";
                    break;
                case 5:
                    tekst = "Odmah se obratite Vašem liječniku. Mogli biste doživjeti hipertenzijsku krizu. " +
                        "Postoji mogućnost od oštećenja organa, promjene u vidu, poteškoće pri govoru i sl.";
                    break;
                case 6:
                    tekst = "Obratite se svome liječniku kako bi vam propisao odgovarajući lijek. " +
                        "Pripazite na unos soli, izbjegavajte alkohol i cigarete, ograničite unos soli te pripazite da je Vaša tjelesna masa primjerena ovisno o Vašoj visini.";
                    break;
                default:
                    tekst = "Dijagnoza nije poznata.";
            }
            this.opisDijagnoze = tekst;
            this.bojaDijagnoze = backgroundColors[index];
            return naslov;
        }
    },

    created: function () {
        this.entries.forEach(entry => {
            this.syses.push(entry.sys);
            this.dias.push(entry.dia);
            this.pulses.push(entry.pulse);
        });

        this.izracunBrojevaDijagnoza();

        // izračun traženih podataka za pregled na vrhu
        this.lastEntry = this.entries[this.entries.length - 1];
        this.firstMeasureDate = this.entries[0].date;
        this.lastMeasureDate = this.lastEntry.date;

        // podaci za linijski grafikon
        this.linepodaci = {
            labels: this.dates.map(date => {return date.substring(0,14);}),
            datasets: [
                {
                    label: 'SYS',
                    data: this.syses,
                    backgroundColor: 'transparent',
                    borderColor: '#4CAF50',
                    borderWidth: 3
                },
                {
                    label: 'DIA',
                    data: this.dias,
                    backgroundColor: 'transparent',
                    borderColor: '#009688',
                    borderWidth: 3
                },
                {
                    label: 'Puls',
                    data: this.pulses,
                    backgroundColor: 'transparent',
                    borderColor: '#F44336',
                    borderWidth: 3
                },
                {
                    label: 'Masa',
                    data: this.weights,
                    backgroundColor: 'transparent',
                    borderColor: '#795548',
                    borderWidth: 3
                }
            ]
        };

        this.doughnutpodaci = {
            labels: ["Optimalan", "Normalan", "Povišen", "Hipertenzija I", "Hipertenzija II", "Hipertenzija III", "Izolirana sistolička hipertenzija"],
            datasets: [
                {
                    data: [this.optimalan, this.normalan, this.povisen, this.hipertenzija1, this.hipertenzija2, this.hipertenzija3, this.izoliranaSisHipertenzija],
                    backgroundColor: [this.colors.optimalan, this.colors.normalan, this.colors.povisen, this.colors.hipertenzija1, this.colors.hipertenzija2, this.colors.hipertenzija3, this.colors.izoliranaSisHipertenzija],
                    borderWidth: 1
                }
            ]
        };
    }
});