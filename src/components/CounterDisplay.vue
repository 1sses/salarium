<template>
  <div>
    <el-row justify="center">
      <h2 class="counter-header">{{label}}</h2>
    </el-row>
    <el-row justify="center" align="bottom">
      <Vue3Odometer class="counter-display" :value="value" format="( ddd),dd" :duration="130" theme="minimal" />
      <span class="counter-currency">&nbsp;{{currency}}</span>
    </el-row>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import Vue3Odometer from 'vue3-odometer'
import 'odometer/themes/odometer-theme-minimal.css'

defineProps({
  value: {
    type: Number,
    required: true
  },
  label: {
    type: String
  },
  currency: {
    type: String,
    default: '$'
  }
})
</script>

<style>
:root {
  --counter-font-size: 20px;
}

@media (max-width: 1500px) {
  :root {
    --counter-font-size: 15px;
  }
}

@media (max-width: 1000px) {
  :root {
    --counter-font-size: 10px;
  }
}

@media (max-width: 768px) {
  :root {
    --counter-font-size: 7px;
  }
}

@media (max-width: 500px) {
  :root {
    --counter-font-size: 5px;
  }
}
</style>

<style scoped>
.counter-header {
  font-size: calc(var(--counter-font-size) * 3);
  font-weight: 300;
  margin-bottom: 50px;
  text-align: center;
}

.counter-display {
  font-weight: 400;
  font-size: calc(var(--counter-font-size) * 10);
}

.counter-currency {
  margin-bottom: calc(var(--counter-font-size) * 2.5);
  font-size: calc(var(--counter-font-size) * 4);
  font-weight: 200;
}
</style>
