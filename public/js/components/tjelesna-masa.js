// Tjelesna masa


const Weight = Vue.component('Weight', {
    props: ["entries", "weight", "weights", "dates"],
    template: `


    <div>
        <h4>Tjelesna masa</h4>
        
        <div class="col s12">
           <div class="card-panel center-align hoverable box">
                <bar-chart
                    :data="weightpodaci"
                    :options="{
                        tooltips: {
                            callbacks: {
                                title: function() {return '';},
                                beforeLabel: function(tooltipItem, data) {
                                    return dates[tooltipItem.index];}
                            },
                            titleFontSize: 20, 
                            titleFontStyle: normal, 
                            bodyFontSize: 20, 
                            bodyFontStyle: normal
                        },
                        responsive: true, 
                        maintainAspectRatio: false,
                        legend: {display: false},
                        scales: {
                            xAxes: [{    
                                categoryPercentage: 0.9,
                                barPercentage: 0.8,
                                gridLines: {display: true},
                            }],
                            yAxes: [{
                                ticks: {beginAtZero: true},
                                gridLines: {display: false}
                            }]
                        }
                    }"
                ></bar-chart>
            </div>
        </div>
        
        <div class="col s12">
            <div class="col m3">
                <div class="card-panel center-align hoverable box">
                    <strong>Trenutna</strong><br/>{{weight.current}} kg
                </div>
            </div>
        
            <div class="col m3">
                <div class="card-panel center-align hoverable box">
                    <strong>Najmanja</strong><br/>{{weight.min}} kg
                </div>
            </div>
            
            <div class="col m3">
                <div class="card-panel center-align hoverable box">
                    <strong>Najveća</strong><br/>{{weight.max}} kg
                </div>
            </div>
            
            <div class="col m3">
                <div class="card-panel center-align hoverable box">
                    <strong>Prosječna</strong><br/>{{weight.avg}} kg
                </div>
            </div>
        </div>
    </div>`,


    data: function () {
        return {
            weightpodaci: {}
        }
    },

    methods: {},

    created: function () {
        this.weightpodaci = {
            labels: this.dates.map(date => {return date.substring(0,14);}),
            datasets: [{
                label: 'Masa',
                data: this.weights,
                backgroundColor: '#FF9800',
                borderColor: '#FFB74D',
                borderWidth: 1,
            }]
        };
    }
});