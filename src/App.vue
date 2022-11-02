<template>
  <el-row justify="center">
    <h2 class="main-header">Вы заработали в этом месяце</h2>
  </el-row>
  <SalaryDisplay :value="thisMonthSalary" :currency="controls.currency" />
  <el-row justify="center">
    <h2 class="main-header">Вы заработали сегодня</h2>
  </el-row>
  <SalaryDisplay :value="thisDaySalary" :currency="controls.currency" />
  <SalaryControls
    v-model="controls"
    @add-working-period="addWorkingPeriod"
    @remove-working-period="removeWorkingPeriod"
    @add-break="addBreak"
    @remove-break="removeBreak"
  />
</template>

<script setup>
import { reactive, ref } from 'vue'
import * as dayjs from 'dayjs'
import SalaryControls from '@/components/SalaryControls'
import SalaryDisplay from '@/components/SalaryDisplay'

const controls = reactive(JSON.parse(localStorage.getItem('controls')) || {
  salary: 0,
  currency: '$',
  simpleMode: true,
  workingPeriods: []
})

const thisMonthSalary = ref(0)
const thisDaySalary = ref(0)

const addWorkingPeriod = () => {
  const id = Date.now()
  controls.workingPeriods.push({
    id,
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
  console.log(group)
  group.breaks.push({
    id: Date.now(),
    time: []
  })
}

const removeBreak = (id) => {
  const group = controls.workingPeriods.find((group) => group.id === id)
  group.breaks = group.breaks.filter((group) => group.id !== id)
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

setInterval(() => {
  if (!controls.simpleMode) {
    const now = dayjs()
    const working = controls.workingPeriods.reduce((acc, group) => {
      // console.log(group)
      let thisMonthWorked = 0
      let todayWorked = 0
      let thisMonthDuration = 0
      // let todayDuration = 0
      const days = group.days.map((day) => +day)
      const startTime = dayjs(group.time[0]).second(0)
      const endTime = dayjs(group.time[1]).second(0)
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
      return {
        thisMonth: acc.thisMonth + thisMonthWorked,
        today: acc.today + todayWorked,
        thisMonthDuration: acc.thisMonthDuration + thisMonthDuration
        // todayDuration: acc.todayDuration + todayDuration
      }
    }, { thisMonth: 0, today: 0, thisMonthDuration: 0/* , todayDuration: 0 */ })
    // console.log(working)
    thisMonthSalary.value = controls.salary * working.thisMonth / working.thisMonthDuration
    thisDaySalary.value = controls.salary * working.today / working.thisMonthDuration
  }
}, 2000)

</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
}

.main-header {
  font-size: 50px;
  font-weight: 500;
  margin-bottom: 50px;
}
</style>
