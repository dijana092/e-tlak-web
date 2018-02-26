// Povijest unosa


const History = Vue.component('History', {
    props: ["entries", "weight", "weights", "dates"],
    template: `


    <div>
        <h4>Povijest unosa</h4>
        
        <div class="col s12">
            <form class="section" class="box-filter-history">
                <strong>Filtriraj: &nbsp;</strong>          
                Od: <input type="date" id="datepicker-from" class="datepicker browser-default" v-model="dateFrom" value="2018-01-01"/>     &nbsp;&nbsp;
                Do: <input type="date" id="datepicker-to" class="datepicker browser-default" v-model="dateTo" value="2018-12-31"/><br/><br/>                              
                <strong>Prikaži: </strong>
                <input type="checkbox" id="showSys" v-model="showSys" class="check" />
                <label for="showSys">Sistolički</label>
                <input type="checkbox" id="showDia" v-model="showDia" class="check" />
                <label for="showDia">Dijastolički</label>
                <input type="checkbox" id="showPulse" v-model="showPulse" class="check" />
                <label for="showPulse">Puls</label>
                <input type="checkbox" id="showDiagnose" v-model="showDiagnose" class="check" />
                <label for="showDiagnose">Dijagnoza</label>
                <input type="checkbox" id="showWeight" v-model="showWeight" class="check" />
                <label for="showWeight">Tjelesna masa</label><br/><br/>
            </form>
        </div>
        
        <div class="col s12">
            <div class="card-panel center-align hoverable box-history">
                <table class="responsive-table striped centered section">
                    <thead title="Sortiranje">
                        <tr>
                            <th>R.br.</th>
                            <th @click="sortBy='date'" class="th">Datum <i v-if="sortBy=='date'" class="material-icons sort-tag" >expand_more</i></th>
                            <th @click="sortBy='date'" class="th">Vrijeme </th>
                            <th v-show="showSys" @click="sortBy='sys'" class="th">Sistolički <i v-if="sortBy=='sys'" class="material-icons sort-tag" >expand_more</i></th>
                            <th v-show="showDia" @click="sortBy='dia'" class="th">Dijastolički <i v-if="sortBy=='dia'" class="material-icons sort-tag" >expand_more</i></th>
                            <th v-show="showPulse" @click="sortBy='pulse'" class="th">Puls <i v-if="sortBy=='pulse'" class="material-icons sort-tag" >expand_more</i></th>
                            <th v-show="showDiagnose" class="th">Dijagnoza</th>
                            <th v-show="showWeight" @click="sortBy='weight'" class="th">Masa <i v-if="sortBy=='weight'" class="material-icons sort-tag" >expand_more</i></th>
                        </tr>
                    </thead>
               
                    <transition-group name="flip-list" tag="tbody">
                        <tr v-for="(entry, index) in filteredEntries" :key="entry._id">
                            <td>{{index+1}}</td>
                            <td>{{entry.date | dateToDate}}</td>
                            <td>{{entry.date | dateToTime}}</td>
                            <td v-show="showSys">{{entry.sys}}</td>
                            <td v-show="showDia">{{entry.dia}}</td>
                            <td v-show="showPulse">{{entry.pulse}}</td>
                            <td v-show="showDiagnose">{{entry.diagnosis}}</td>
                            <td v-show="showWeight">{{entry.weight}}</td>
                        </tr>
                    </transition-group>  
                </table>
            </div>
        </div>
    </div>`,


    data: function () {
        return {
            dateFrom: "2018-01-01",
            dateTo: "2018-12-31",
            showSys:true,
            showDia:true,
            showPulse:true,
            showDiagnose:true,
            showWeight:true,
            sortBy:"date"
        }
    },
    
    computed:  {
        filteredEntries: function () {
            let foundEntries = this.entries;
            if(!this.dateFrom || !this.dateTo) return foundEntries;

            // 'offset' za vremensku zonu postavljen na sat vremena
            let fromDate = new Date(this.dateFrom).getTime()  - 1000*3600;
            // kako bi se filtriralo do kraja odabranog dana postavljeno na sat vremena natrag ali 24 sata naprijed
            let toDate = new Date(this.dateTo).getTime() + 1000*3600*24 -1000*3600;
            let that = this;

            foundEntries = foundEntries.filter(function(item){
                // problem sa mjesecima i danima u raznim tipovima kalendara - treba zamijeniti dane i mjesece kako bi se pročitalo kako treba
                // 18. 11. 2017. 19:07:32
                let customDate = item.date.substring(4,8) + item.date.substring(0,4) + item.date.substring(8);
                let iDate = new Date(customDate).getTime();
                if(iDate>=fromDate && iDate<=toDate) return true;
            });

            foundEntries.sort(function (a, b) {
                let by = that.sortBy;
                if(by === "date") {
                    // pretvaranje hrvatskih datuma u .js kompatibilne datume
                    let customDate1 = a.date.substring(4,8) + a.date.substring(0,4) + a.date.substring(8);
                    let customDate2 = b.date.substring(4,8) + b.date.substring(0,4) + b.date.substring(8);
                    // pretvaranje tih datuma u milisekunde
                    let iDate1 = new Date(customDate1).getTime();
                    let iDate2 = new Date(customDate2).getTime();
                    // sortiranje po datumu i vremenu
                    return iDate1 - iDate2;
                }
                if(by === "sys") return a.sys - b.sys;
                if(by === "dia") return a.dia - b.dia;
                if(by === "pulse") return a.pulse - b.pulse;
                if(by === "weight") return a.weight - b.weight;
                if(by === "diagnosis") return a.diagnosis[0] - b.diagnosis[0];
            });

            return foundEntries;
        }
    },
    
    filters: {
        dateToDate: function (value) {
            return value.substring(0, value.indexOf(":") - 3);
        },
        dateToTime: function (value) {
            return value.substring(value.indexOf(":") - 3);
        },
    },
    
    methods: {},

    created: function () {}
});