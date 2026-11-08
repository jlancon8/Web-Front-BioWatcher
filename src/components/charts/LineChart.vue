<template>
  <div :class="[heightClass, 'relative w-full min-w-0']">
    <v-chart
        v-if="points.length"
        :option="option"
        autoresize
        class="w-full"
    />
  </div>
</template>

<script setup>
import {computed} from 'vue'
import {use} from 'echarts/core'
import {CanvasRenderer} from 'echarts/renderers'
import {LineChart as EchartsLineChart} from 'echarts/charts'
import {GridComponent, TooltipComponent} from 'echarts/components'
import {LegacyGridContainLabel} from 'echarts/features'
import VChart from 'vue-echarts'
import {formatType} from "@/utils/formatter.js";

use([CanvasRenderer, EchartsLineChart, GridComponent, TooltipComponent, LegacyGridContainLabel])

const props = defineProps({
  points: {type: Array, default: () => []},
  unit: {type: String, default: ''},
  color: {type: String, default: '#2f6b47'},
  areaColor: {type: String, default: '#dcebdf'},
  heightClass: {type: String, default: 'h-72'},
  emptyText: {type: String, default: 'Aucune donnée'}
})

const SHORT_PERIOD_MS = 36 * 60 * 60 * 1000

const dateFormats = {
  hour: new Intl.DateTimeFormat('fr-FR', {hour: '2-digit', minute: '2-digit'}),
  day: new Intl.DateTimeFormat('fr-FR', {day: '2-digit', month: 'short'}),
  full: new Intl.DateTimeFormat('fr-FR', {dateStyle: 'medium', timeStyle: 'short'})
}

const periodMs = computed(() => {
  if (props.points.length < 2) return 0
  const first = new Date(props.points[0].date)
  const last = new Date(props.points[props.points.length - 1].date)
  return last - first
})

// depending on the period, choose the appropriate date format for the x-axis labels
const axisDateFormat = computed(() =>
    periodMs.value <= SHORT_PERIOD_MS ? dateFormats.hour : dateFormats.day
)

const data = computed(() => props.points.map(point => [point.date, point.value]))

const option = computed(() => ({
  grid: {
    left: 8,
    right: 16,
    top: 16,
    bottom: 8,
    containLabel: true
  },

  tooltip: {
    trigger: 'axis',
    formatter: ([{ data: [date, value] }]) =>
        `${dateFormats.full.format(new Date(date))}<br/>${formatType(value)} ${props.unit}`
  },

  xAxis: {
    type: 'time',
    interval: 'auto',
    axisLabel: {
      hideOverlap: true,
      formatter: (timestamp) =>
          axisDateFormat.value.format(timestamp)
    }
  },

  yAxis: {
    type: 'value',
    scale: true,
    axisLabel: {
      formatter: `{value} ${props.unit}`
    }
  },

  series: [{
    type: 'line',
    data: data.value,
    showSymbol: true,
    symbol: 'circle',
    symbolSize: 7.5,
    smooth: true,

    lineStyle: {
      width: 2.5,
      color: props.color
    },

    itemStyle: {
      color: props.color,
      borderWidth: 2
    },

    areaStyle: {
      color: props.areaColor
    },

    emphasis: {
      focus: 'series',
      scale: true
    }
  }]
}))
</script>