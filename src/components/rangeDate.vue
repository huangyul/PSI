/* 范围时间选择器 */
<template>
  <div class="date-box">
    <el-date-picker
      style="margin-right: 10px"
      v-model="start"
      :type="type"
      :disabled="disabled"
      placeholder="开始日期"
      :disabled-date="startValidator"
    /><span style="font-weight: bold">-</span>
    <el-date-picker
      style="margin-left: 10px"
      v-model="end"
      :type="type"
      :disabled="disabled"
      placeholder="结束日期"
      :disabled-date="endValidator"
    />
  </div>
</template>

<script>
  export default {
    data() {
      return {
        start: '',
        end: '',
      }
    },
    props: {
      propsStart: {
        default: '',
      },
      propsEnd: {
        default: '',
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      type: {
        type: String,
        default: 'date',
      },
    },
    watch: {
      propsStart: {
        immediate: true,
        handler(value) {
          if (value) {
            console.log(value)
            this.start = value
          } else {
            this.start = ''
          }
        },
      },
      propsEnd: {
        immediate: true,
        handler(value) {
          if (value) {
            this.end = value
          } else {
            this.end = ''
          }
        },
      },
      start: {
        immediate: true,
        handler(value) {
          const date = value ? this.formatDate(value) : ''
          this.$emit('update:propsStart', date)
        },
      },
      end: {
        immediate: true,
        handler(value) {
          const date = value ? this.formatDate(value) : ''
          this.$emit('update:propsEnd', date)
        },
      },
    },
    methods: {
      startValidator(time) {
        if (this.end) {
          return time.getTime() > new Date(this.end)
        }
      },
      endValidator(time) {
        if (this.start) {
          return time.getTime() < new Date(this.start) //禁止选择今天以后的时间
        }
      },
      formatDate(date) {
        if (this.type == 'date') {
          return new Date(date).toLocaleDateString().replace(/\//g, '-')
        } else if (this.type == 'datetime') {
          return new Date(date).toLocaleString().replace(/\//g, '-')
        }
      },
    },
  }
</script>

<style scoped lang="scss">
  .date-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
