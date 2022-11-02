<template>
  <el-row justify="center" align="bottom">
    <Vue3Odometer class="main-display" :value="value" format="( ddd),dd" :duration="130" theme="minimal" />
    <span class="currency">&nbsp;{{currency}}</span>
  </el-row>
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
  currency: {
    type: String,
    default: '$'
  }
})
</script>

<style scoped>
.main-display {
  font-family: "Segoe UI", sans-serif;
  font-size: 200px;
}

.currency {
  margin-bottom: 30px;
  font-size: 80px;
}

@media (max-width: 768px) {
  .main-display {
    font-size: 70px;
  }

  .currency {
    font-size: 50px;
  }
}
</style>
