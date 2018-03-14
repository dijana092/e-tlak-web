// Krvni tlak


const Pressure = Vue.component('Pressure', {
    props: ["entries", "colors"],
    template: `<div>

    <h4>Krvni tlak</h4>
    
    <div class="col s12">
            <div class="col m3">
                <div class="card-panel center-align hoverable box">
                    <strong>Ukupno mjerenja</strong><br/>{{entries.length}}
                </div>
            </div>
            
            <div class="col m3">
                <div class="card-panel center-align hoverable box">
                    <strong>Zadnji</strong><br/>
                    SYS {{lastEntry.sys}} mmHg<br/>
                    DIA {{lastEntry.dia}} mmHg<br/>
                    <i class="material-icons">favorite</i> {{lastEntry.pulse}}/min
                </div>
            </div>
            
            <div class="col m3">
                <div class="card-panel center-align hoverable box">
                    <strong>Najniži</strong><br/>
                    SYS {{minEntry.sys}} mmHg<br/>
                    DIA {{minEntry.dia}} mmHg<br/>
                    <i class="material-icons">favorite</i> {{lastEntry.pulse}}/min
                </div>
            </div>
            
            <div class="col m3">
                <div class="card-panel center-align hoverable box">
                    <strong>Najviši</strong><br/>
                    SYS {{maxEntry.sys}} mmHg<br/>
                    DIA {{maxEntry.dia}} mmHg<br/>
                    <i class="material-icons">favorite</i> {{lastEntry.pulse}}/min
                </div>
            </div>
    </div>
    
    <div class="col s12 m6">
        <div class="card-panel center-align hoverable box">
            <scatter-chart 
            :data="scatterpodaci" 
            :options="{
                responsive: true, 
                maintainAspectRatio: false,
                legend: {display: false},
                scales: {
                    xAxes: [{
                        type: 'linear',
                        position: 'bottom',
                        ticks: {
                            min: 50,
                            max: 130
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            min: 80,
                            max: 190
                        }
                    }]
                },
                tooltips: {
                    callbacks: {
                       label: function(tooltipItem, data) {
                          let label = data.labels[tooltipItem.index];
                          return 'Sistolički: ' + tooltipItem.yLabel + ', Dijastolički: ' + tooltipItem.xLabel;
                        }
                    },
                    titleFontSize: 20, 
                    titleFontStyle: normal, 
                    bodyFontSize: 20, 
                    bodyFontStyle: normal
                }
            }"
            ></scatter-chart>
        </div>
    </div>
    
    <div class="col s12 m6">
        <div class="card-panel center-align hoverable box">
            <horizontal-bar-chart
            :data="barpodaci"
            :options="{
                responsive: true, 
                maintainAspectRatio: false,
                tooltips: {
                    callbacks: {
                        title: function(){}, 
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
                legend: {display: false},
                scales: {
                    xAxes: [{    
                       categoryPercentage: 0.6,
                       barPercentage: 0.4,
                       gridLines: {display: false},
                       ticks: {
                            min: 0,
                            suggestedMax: 0,
                            callback: function(value){return value+ '%'
                        }
                    }}],
                    yAxes: [{
                        categoryPercentage: 0.8,
                        barPercentage: 0.7,
                        ticks: {beginAtZero: true, fontSize: 16},
                        gridLines: {display: true}
                    }]}
                }"
            ></horizontal-bar-chart>
        </div>
    </div>
    
    <div class="col s12">
        <div class="card-panel center-align hoverable box">
            <doughnut-chart style="display:inline-block;" :width=250 v-if="optimalan" :data="optimalanPodaci" :options="{responsive: false, maintainAspectRatio: false, 
            tooltips: {titleFontSize: 20, titleFontStyle: normal, bodyFontSize: 20, bodyFontStyle: normal}, legend:{labels:{fontSize:16}}}"></doughnut-chart>
            <doughnut-chart style="display:inline-block;" :width=250 v-if="normalan" :data="normalanPodaci" :options="{responsive: false, maintainAspectRatio: false, 
            tooltips: {titleFontSize: 20, titleFontStyle: normal, bodyFontSize: 20, bodyFontStyle: normal}, legend:{labels:{fontSize:16}}}"></doughnut-chart>
            <doughnut-chart style="display:inline-block;" :width=250 v-if="povisen" :data="povisenPodaci" :options="{responsive: false, maintainAspectRatio: false, 
            tooltips: {titleFontSize: 20, titleFontStyle: normal, bodyFontSize: 20, bodyFontStyle: normal}, legend:{labels:{fontSize:16}}}"></doughnut-chart>
            <doughnut-chart style="display:inline-block;" :width=250 v-if="hipertenzija1" :data="hipertenzija1Podaci" :options="{responsive: false, maintainAspectRatio: false, 
            tooltips: {titleFontSize: 20, titleFontStyle: normal, bodyFontSize: 20, bodyFontStyle: normal}, legend:{labels:{fontSize:16}}}"></doughnut-chart>
            <doughnut-chart style="display:inline-block;" :width=250 v-if="hipertenzija2" :data="hipertenzija2Podaci" :options="{responsive: false, maintainAspectRatio: false, 
            tooltips: {titleFontSize: 20, titleFontStyle: normal, bodyFontSize: 20, bodyFontStyle: normal}, legend:{labels:{fontSize:16}}}"></doughnut-chart>
            <doughnut-chart style="display:inline-block;" :width=250 v-if="hipertenzija3" :data="hipertenzija3Podaci" :options="{responsive: false, maintainAspectRatio: false, 
            tooltips: {titleFontSize: 20, titleFontStyle: normal, bodyFontSize: 20, bodyFontStyle: normal}, legend:{labels:{fontSize:16}}}"></doughnut-chart>
            <doughnut-chart style="display:inline-block;" :width=250 v-if="izoliranaSisHipertenzija" :data="izoliranaSisHipertenzijaPodaci" :options="{responsive: false, maintainAspectRatio: false, 
            tooltips: {titleFontSize: 20, titleFontStyle: normal, bodyFontSize: 20, bodyFontStyle: normal}, legend:{labels:{fontSize:16}}}"></doughnut-chart>
        </div>
    </div>
</div>`,


    data: function () {
        return {
            lastEntry: {},
            minEntry: {},
            maxEntry: {},
            scatterpodaci: {},
            barpodaci: {},
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

        findExtremes: function () {
            // novo polje koje sadrži zbrojeve sys i dia tlakova svakog unosa
            let zbrojevi = this.entries.map(entry => {
                return entry.sys + entry.dia;
            });
            // pronalaženje minimalnog i maksimalnog zbroja te korištenje njihovog indeksa za vraćanje odgovarajućeg unosa
            this.minEntry = this.entries[zbrojevi.indexOf(Math.min(...zbrojevi))];
            this.maxEntry = this.entries[zbrojevi.indexOf(Math.max(...zbrojevi))];
        }
    },

    created: function () {
        // 'raspršeni' grafikon traži polje objekata od kojih svaki ima x i y svojstvo
        let scatterData = [];
        this.entries.forEach(entry => {
            let obj = {};
            obj.x = entry.dia;
            obj.y = entry.sys;
            obj.labels = ["Sistolički", "Dijastolički"];
            scatterData.push(obj);
        });

        this.izracunBrojevaDijagnoza();
        // pronalaženje minimalne i maksimalne vrijednosti
        this.findExtremes();
        // izračun traženih podataka za pregled na vrhu
        this.lastEntry = this.entries[this.entries.length - 1];

        // podaci za grafikon dijagnoza
        let integerArray = [this.optimalan, this.normalan, this.povisen, this.hipertenzija1, this.hipertenzija2, this.hipertenzija3, this.izoliranaSisHipertenzija];
        let total = integerArray.reduce(function(previousValue, currentValue, currentIndex, array){
            return previousValue + currentValue;
        });
        let percentageArray = integerArray.map(currentValue => {
            return Math.floor(((currentValue/total)*100)+0.5);
        });
        this.barpodaci = {
            labels: ["Optimalan", "Normalan", "Povišen", "Hipertenzija I", "Hipertenzija II", "Hipertenzija III", "Izolirana sistolička hipertenzija"],
            datasets: [
                {
                    label: "Dijagnoza (%)",
                    data: percentageArray,
                    backgroundColor: [this.colors.optimalan, this.colors.normalan, this.colors.povisen, this.colors.hipertenzija1, this.colors.hipertenzija2, this.colors.hipertenzija3, this.colors.izoliranaSisHipertenzija],
                    borderWidth: 1
                }
            ]
        };

        // podaci za 'raspršeni' grafikon
        this.scatterpodaci = {
            datasets: [{
                pointRadius: 6,
                pointHitRadius: 6,
                pointHoverRadius: 6,
                pointBorderWidth:0,
                // data mora biti polje s objektima od kojih svaki ima x i y vrijednost, stvoren iznad na početku created() metode
                data: scatterData,
                backgroundColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                borderWidth: 1
            },
                // pozadinske boje dijagnoza na grafikonu
                {
                    pointRadius: 0,
                    pointHitRadius: 0,
                    pointHoverRadius: 0,
                    pointBorderWidth: 0,
                    showLine: true,
                    steppedLine: true,
                    borderWidth: 1,
                    spanGaps: false,
                    backgroundColor: this.colors.optimalan,
                    borderColor: '#fff',
                    data: [{x:40,y:120}, {x:80,y:0}]
                },
                {
                    pointRadius: 0,
                    pointHitRadius: 0,
                    pointHoverRadius: 0,
                    pointBorderWidth: 0,
                    showLine: true,
                    steppedLine: true,
                    borderWidth: 1,
                    spanGaps: false,
                    backgroundColor: this.colors.normalan,
                    borderColor: '#fff',
                    data: [{x:40,y:130}, {x:85,y:0}],
                },
                {
                    pointRadius: 0,
                    pointHitRadius: 0,
                    pointHoverRadius: 0,
                    pointBorderWidth: 0,
                    showLine: true,
                    steppedLine: true,
                    borderWidth: 1,
                    spanGaps: false,
                    backgroundColor: this.colors.povisen,
                    borderColor: '#fff',
                    data: [{x:40,y:140}, {x:90,y:0}],
                },
                {
                    pointRadius: 0,
                    pointHitRadius: 0,
                    pointHoverRadius: 0,
                    pointBorderWidth: 0,
                    showLine: true,
                    steppedLine: true,
                    borderWidth: 1,
                    spanGaps: false,
                    backgroundColor: this.colors.hipertenzija1,
                    borderColor: '#fff',
                    data: [{x:40,y:160}, {x:100,y:0}],
                },
                {
                    pointRadius: 0,
                    pointHitRadius: 0,
                    pointHoverRadius: 0,
                    pointBorderWidth: 0,
                    showLine: true,
                    steppedLine: true,
                    borderWidth: 1,
                    spanGaps: false,
                    backgroundColor: this.colors.hipertenzija2,
                    borderColor: '#fff',
                    data: [{x:40,y:180}, {x:110,y:0}],
                },
                {
                    pointRadius: 0,
                    pointHitRadius: 0,
                    pointHoverRadius: 0,
                    pointBorderWidth: 0,
                    showLine: true,
                    steppedLine: true,
                    borderWidth: 1,
                    spanGaps: false,
                    backgroundColor: this.colors.hipertenzija3,
                    borderColor: '#fff',
                    data: [{x:40,y:190}, {x:130,y:0}],
                }
            ]
        };

        // podaci za pojedine grafikone postojećih dijagnoza
        this.optimalanPodaci = {
            labels: ["Optimalan", "Ostalo"],
            datasets: [
                {
                    data: [this.optimalan, this.entries.length-this.optimalan],
                    backgroundColor: [this.colors.optimalan, 'lightgray'],
                    borderWidth: 1
                }
            ]
        };

        this.normalanPodaci = {
            labels: ["Normalan", "Ostalo"],
            datasets: [
                {
                    data: [this.normalan, this.entries.length-this.normalan],
                    backgroundColor: [this.colors.normalan, 'lightgray'],
                    borderWidth: 1
                }
            ]
        };

        this.povisenPodaci = {
            labels: ["Povišen", "Ostalo"],
            datasets: [
                {
                    data: [this.povisen, this.entries.length-this.povisen],
                    backgroundColor: [this.colors.povisen, 'lightgray'],
                    borderWidth: 1
                }
            ]
        };

        this.hipertenzija1Podaci = {
            labels: ["Hipertenzija I", "Ostalo"],
            datasets: [
                {
                    data: [this.hipertenzija1, this.entries.length-this.hipertenzija1],
                    backgroundColor: [this.colors.hipertenzija1, 'lightgray'],
                    borderWidth: 1
                }
            ]
        };

        this.hipertenzija2Podaci = {
            labels: ["Hipertenzija II", "Ostalo"],
            datasets: [
                {
                    data: [this.hipertenzija2, this.entries.length-this.hipertenzija2],
                    backgroundColor: [this.colors.hipertenzija2, 'lightgray'],
                    borderWidth: 1
                }
            ]
        };

        this.hipertenzija3Podaci = {
            labels: ["Hipertenzija III", "Ostalo"],
            datasets: [
                {
                    data: [this.hipertenzija3, this.entries.length-this.hipertenzija3],
                    backgroundColor: [this.colors.hipertenzija3, 'lightgray'],
                    borderWidth: 1
                }
            ]
        };

        this.izoliranaSisHipertenzijaPodaci = {
            labels: ["Izoliran", "Ostalo"],
            datasets: [
                {
                    data: [this.izoliranaSisHipertenzija, this.entries.length-this.izoliranaSisHipertenzija],
                    backgroundColor: [this.colors.izoliranaSisHipertenzija, 'lightgray'],
                    borderWidth: 1
                }
            ]
        };
    }
});