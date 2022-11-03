<template>
  <el-row justify="space-evenly" align="middle" style="flex-direction: column; height: 100vh">
    <SalaryDisplay :value="thisMonthSalary" label="Вы заработали в этом месяце" :currency="controls.currency" />
    <SalaryDisplay :value="thisDaySalary" label="Вы заработали сегодня" :currency="controls.currency" />
  </el-row>
  <el-button color="black" circle size="large" @click="controlsDialog = true" :icon="Setting" style="position: absolute; top: 20px; right: 20px" />
  <el-dialog v-model="controlsDialog" width="95%" title="Настройки">
    <SalaryControls
      v-model="controls"
      @add-working-period="addWorkingPeriod"
      @remove-working-period="removeWorkingPeriod"
      @add-break="addBreak"
      @remove-break="removeBreak"
    />
  </el-dialog>
</template>

<script setup>
import { reactive, ref } from 'vue'
import * as dayjs from 'dayjs'
import { Setting } from '@element-plus/icons-vue'
import SalaryControls from '@/components/SalaryControls'
import SalaryDisplay from '@/components/CounterDisplay'

const controls = reactive(JSON.parse(localStorage.getItem('controls')) || {
  salary: 0,
  currency: '$',
  simpleMode: true,
  workingPeriods: []
})

const thisMonthSalary = ref(0)
const thisDaySalary = ref(0)
const controlsDialog = ref(false)

const addWorkingPeriod = () => {
  const id = Date.now()
  controls.workingPeriods.push({
    id,
    name: '',
    salary: 0,
    days: [],
    time: [],
    breaks: []
  })
}

const removeWorkingPeriod = (id) => {
  controls.workingPeriods = controls.workingPeriods.filter((group) => group.id !== id)
}

const addBreak = (id) => {
  const group = controls.workingPeriods.find((group) => group.id === id)
  group.breaks.push({
    id: Date.now(),
    time: []
  })
}

const removeBreak = (id) => {
  controls.workingPeriods.forEach((group) => {
    group.breaks = group.breaks.filter((breakGroup) => breakGroup.id !== id)
  })
}

// simple mode
setInterval(() => {
  if (controls.simpleMode) {
    const now = dayjs()
    const fromMonthStart = now.startOf('month')
    const fromDayStart = now.startOf('day')
    const earnInSecond = controls.salary / now.daysInMonth() / 24 / 60 / 60
    thisMonthSalary.value = earnInSecond * now.diff(fromMonthStart, 'seconds')
    thisDaySalary.value = earnInSecond * now.diff(fromDayStart, 'seconds')
  }
}, 2000)

// extended mode
setInterval(() => {
  if (!controls.simpleMode) {
    const now = dayjs()
    let earnThisMonth = 0
    let earnToday = 0
    controls.workingPeriods.forEach((group) => {
      let thisMonthWorked = 0
      let todayWorked = 0
      let thisMonthDuration = 0
      // let todayDuration = 0
      const days = group.days ? group.days?.map((day) => +day) : []
      const startTime = dayjs(group.time?.at(0)).second(0)
      const endTime = dayjs(group.time?.at(1)).second(0)
      const duration = endTime.diff(startTime, 'seconds')
      for (const day of days) {
        thisMonthDuration += duration
        if (day < now.date()) {
          thisMonthWorked += duration
        }
        if (day === now.date()) {
          // todayDuration += duration
          if (now.isBefore(startTime)) {
            thisMonthWorked += 0
            todayWorked += 0
          } else if (now.isAfter(endTime)) {
            thisMonthWorked += duration
            todayWorked += duration
          } else {
            thisMonthWorked += now.diff(startTime, 'seconds')
            todayWorked += now.diff(startTime, 'seconds')
          }
        }
      }
      for (const breakGroup of group.breaks) {
        const breakStartTime = dayjs(breakGroup.time?.at(0)).second(0)
        const breakEndTime = dayjs(breakGroup.time?.at(1)).second(0)
        const breakDuration = breakEndTime.diff(breakStartTime, 'seconds')
        thisMonthDuration -= breakDuration * days.length
        if (now.isBefore(breakStartTime)) {
          thisMonthWorked -= 0
          todayWorked -= 0
        } else if (now.isAfter(breakEndTime)) {
          thisMonthWorked -= breakDuration
          todayWorked -= breakDuration
        } else {
          thisMonthWorked -= now.diff(breakStartTime, 'seconds')
          todayWorked -= now.diff(breakStartTime, 'seconds')
        }
      }
      earnThisMonth += thisMonthDuration ? thisMonthWorked / thisMonthDuration * group.salary : 0
      earnToday += thisMonthDuration ? todayWorked / thisMonthDuration * group.salary : 0
    })
    thisMonthSalary.value = earnThisMonth
    thisDaySalary.value = earnToday
  }
}, 2000)
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Mulish:wght@200;300;400&family=Rubik:wght@300;400&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body, input, button, select, textarea {
  font-family: Mulish, sans-serif;
}

body {
  background: #fffdff;
}
</style>
