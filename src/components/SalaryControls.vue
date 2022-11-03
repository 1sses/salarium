<template>
  <el-col class="controls-wrapper">
    <div>
      <el-switch
        v-model="controls.simpleMode"
        size="large"
        inline-prompt
        :active-icon="Lock"
        :inactive-icon="Unlock"
        active-color="#409eff"
        inactive-color="#67c23a"
      />
      <span style="margin-left: 10px;">{{controls.simpleMode ? 'Упрощенный режим' : 'Расширенный режим'}}</span>
    </div>
    <el-col v-if="controls.simpleMode">
      <h3 style="margin-bottom: 5px;">Зарплата ({{controls.currency}}):</h3>
      <el-input-number v-model="controls.salary" placeholder="4242" controls />
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
        <el-button type="success" size="small" circle @click="emit('addWorkingPeriod')">+</el-button>
        &nbsp;Рабочие периоды:
      </h3>
    </el-col>
    <el-row v-if="!controls.simpleMode" :justify="controls.workingPeriods.length > 1 ? 'space-evenly' : 'flex-start'" style="row-gap: 20px; column-gap: 20px">
      <div v-for="group in controls.workingPeriods" :key="group.id" style="display: flex">
        <el-card header="Название периода" body-style="position: relative; display: flex; flex-direction: column; justify-content: space-between; row-gap: 10px" style="width: 350px" shadow="never">
          <template #header>
            <el-input v-model="group.name" placeholder="Название периода" />
          </template>
          <h4>Зарплата ({{controls.currency}})</h4>
          <el-input-number v-model="group.salary" placeholder="4242" controls />
          <h4>Дни работы</h4>
          <el-date-picker v-model="group.days" placeholder="Нажмите чтобы выбрать" type="dates" format="D" value-format="D" style="width: auto" />
          <h4>Время работы</h4>
          <el-time-picker
            v-model="group.time"
            is-range
            format="HH:mm"
            :default-value="[new Date(), new Date()]"
            range-separator="до"
            start-placeholder="Начало"
            end-placeholder="Конец"
            style="width: auto"
          />
          <h4>
            Перерывы&nbsp;
            <el-button type="success" size="small" circle style="width: 20px; height: 20px" @click="emit('addBreak', group.id)">+</el-button>
          </h4>
          <el-row v-for="breakGroup in group.breaks" :key="breakGroup.id" style="column-gap: 10px">
            <el-time-picker
              v-model="breakGroup.time"
              is-range
              format="HH:mm"
              :default-value="[new Date(), new Date()]"
              range-separator="до"
              start-placeholder="Начало"
              end-placeholder="Конец"
              style="width: 250px"
            />
            <el-button type="danger" @click="emit('removeBreak', breakGroup.id)">-</el-button>
          </el-row>
          <el-button type="danger" size="small" circle style="position: absolute; top: 10px; right: 10px" @click="emit('removeWorkingPeriod', group.id)">-</el-button>
        </el-card>
      </div>
    </el-row>
  </el-col>
</template>

<script setup>
import { defineProps, defineEmits, computed, watch } from 'vue'
import { Lock, Unlock } from '@element-plus/icons-vue'

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
