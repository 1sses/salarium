<template>
  <el-col class="controls-wrapper">
    <el-switch
      v-model="controls.simpleMode"
      active-text="Упрощенный режим"
      inactive-text="Расширенный режим"
      active-color="#409eff"
      inactive-color="#67c23a"
    />
    <el-col>
      <h3 style="margin-bottom: 5px;">Зарплата ({{controls.currency}}):</h3>
      <el-input-number v-model="controls.salary" placeholder="Salary" controls />
    </el-col>
    <el-col>
      <h3 style="margin-bottom: 5px;">Валюта:</h3>
      <el-select v-model="controls.currency" style="width: 300px">
        <el-option
          v-for="item in currencies"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-col>
    <el-col v-if="!controls.simpleMode">
      <h3 style="margin-bottom: 5px;">
        <el-button type="info" size="small" circle @click="emit('addWorkingPeriod')">+</el-button>
        &nbsp;Рабочие периоды:
      </h3>
    </el-col>
    <el-row v-if="!controls.simpleMode">
      <el-col :span="6" v-for="group in controls.workingPeriods" :key="group.id" style="display: flex; flex-direction: column; row-gap: 10px">
        <h4>Дни работы</h4>
        <el-date-picker v-model="group.days" placeholder="Дни работы" type="dates" format="D" value-format="D" style="width: 300px" />
        <h4>Время работы</h4>
        <el-time-picker
          v-model="group.time"
          is-range
          format="HH:mm"
          :default-value="[new Date(), new Date()]"
          range-separator="до"
          start-placeholder="Начало работы"
          end-placeholder="Конец работы"
          style="width: 300px"
        />
        <h4>
          Перерывы&nbsp;
          <el-button type="info" size="small" circle style="width: 20px; height: 20px" @click="emit('addBreak', group.id)">+</el-button>
        </h4>
        <el-time-picker
          v-for="breakGroup in group.breaks"
          :key="breakGroup.id"
          v-model="breakGroup.time"
          is-range
          format="HH:mm"
          :default-value="[new Date(), new Date()]"
          range-separator="до"
          start-placeholder="Начало перерыва"
          end-placeholder="Конец перерыва"
          style="width: 300px"
        />
        <el-button type="danger" plain style="width: 20px" @click="emit('removeWorkingPeriod', group.id)">-</el-button>
      </el-col>
    </el-row>
  </el-col>
</template>

<script setup>
import { defineProps, defineEmits, computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'addWorkingPeriod', 'removeWorkingPeriod', 'addBreak', 'removeBreak'])

const controls = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const currencies = [
  { value: '$', label: 'Доллар США (USD)' },
  { value: '€', label: 'Евро (EUR)' },
  { value: '₽', label: 'Российский рубль (RUB)' },
  { value: 'BYN', label: 'Белорусский рубль (BYN)' }
]

watch(controls.value, (value) => {
  localStorage.setItem('controls', JSON.stringify(value))
})
</script>

<style scoped>
.controls-wrapper {
  display: flex;
  flex-direction: column;
  row-gap: 20px;
  margin: 20px;
}
</style>
