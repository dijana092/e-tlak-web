// svi grafovi


Vue.component('line-chart', {
    extends: VueChartJs.Line,
    props: ['data', 'options'],
    mounted() {
        this.renderChart(this.data, this.options);
    }
});

Vue.component('doughnut-chart', {
    extends: VueChartJs.Doughnut,
    props: ['data', 'options'],
    mounted() {
        this.renderChart(this.data, this.options)
    }
});

Vue.component('bar-chart', {
    extends: VueChartJs.Bar,
    props: ['data', 'options'],
    mounted() {
        this.renderChart(this.data, this.options)
    }
});

Vue.component('horizontal-bar-chart', {
    extends: VueChartJs.HorizontalBar,
    props: ['data', 'options'],
    mounted() {
        this.renderChart(this.data, this.options)
    }
});

Vue.component('scatter-chart', {
    extends: VueChartJs.Scatter,
    props: ['data', 'options'],
    mounted() {
        this.renderChart(this.data, this.options)
    }
});