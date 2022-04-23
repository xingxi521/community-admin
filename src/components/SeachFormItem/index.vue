<template>
  <FormItem :prop="item.model" :label="item.label" :label-width="item.labelWidth" :required="item.required" :rules="item.rules" :error="item.error" :show-message="item.showMessage" :inline-message="item.inlineMessage" :size="item.size" :class="['oc-form-item', item.class]">
    <!-- text/textarea/number -->
    <Input v-if="['text', 'textarea', 'number'].includes(item.type)" :style="item.style || item.width ? `width:${item.width}` : 'flex: 1'" :class="[item.arrow===false ? 'disable-arrow' : '']" clearable v-bind="$attrs" v-on="$listeners">
      <!-- 支持文本框添加文本前缀，比如：https -->
      <template v-if="item.prepend" slot="prepend">{{ item.prepend }}</template>
      <!-- 支持文本框后添加文本后缀，比如：邮箱.com -->
      <template v-if="item.append" slot="append">{{ item.append }}</template>
    </Input>
    <!-- input-number -->
    <InputNumber v-else-if="item.type === 'input-number'" :style="item.style || item.width?`width:${item.width}`:'width:100%'" v-bind="$attrs" v-on="$listeners" />
    <!-- 下拉控件 -->
    <Select v-else-if="item.type === 'select'" :style="item.style || item.width?`width:${item.width}`:'width:100%'" clearable filterable v-bind="$attrs" v-on="$listeners">
      <Option v-for="option in item.options" :key="option.value" :label="option[item.field ? item.field.label : 'label']" :value="option[item.field ? item.field.value : 'value']" :disabled="option.disabled" />
    </Select>
    <!-- TimePicker-任意时间 -->
    <TimePicker v-else-if="item.type === 'time-picker'" :style="item.style || item.width?`width:${item.width}`:''" v-bind="$attrs" v-on="$listeners" />
    <!-- 支持Element所有日期类型 -->
    <DatePicker
      v-else-if="['date', 'week', 'month', 'year', 'dates', 'datetime'].includes(item.type)"
      :style="item.style || item.width?`width:${item.width}`:''"
      v-bind="$attrs"
      :format="item.valueFormat || 'yyyy-MM-dd'"
      :placeholder="item.placeholder || '选择日期'"
      :options="{
        ...item.pickerOptions,
        ...(item.shortcuts ? pickerOptions.date:{})}
      "
      v-on="$listeners" />
    <!-- 支持Element所有日期范围类型 -->
    <DatePicker
      v-else-if="['daterange', 'monthrange', 'datetimerange'].includes(item.type)"
      :style="item.style || item.width?`width:${item.width}`:''"
      v-bind="$attrs"
      :format="item.valueFormat || 'yyyy-MM-dd'"
      :options="{
        ...item.pickerOptions,
        ...(item.shortcuts ? ['monthrange'].includes(item.type) ? pickerOptions.monthRange : pickerOptions.daterange:{})}
      "
      v-on="$listeners" />
    <!-- 单选按钮组 -->
    <RadioGroup v-else-if="['radio', 'radiogroup','radio-group'].includes(item.type)" :style="item.style || item.width?`width:${item.width}`:'width:100%'" v-bind="$attrs" v-on="$listeners">
      <Radio v-for="radio in item.options" :key="radio.value" :label="radio.value">{{ radio.label }}</Radio>
    </RadioGroup>
    <!-- 开关 -->
    <Switch v-else-if="item.type === 'switch'" :style="item.style || item.width ? `width:${item.width}` : 'width:100%'" v-bind="$attrs" v-on="$listeners" />
    <!-- 单个复选，一般可用switch代替 -->
    <Checkbox v-else-if="item.type === 'checkbox' && !item.options" :style="item.style || item.width?`width:${item.width}`:'width:100%'" v-bind="$attrs" v-on="$listeners">{{ item.showLabel?item.label:'' }}</Checkbox>
    <!-- 复选框组，为了便于开发，仅通过options区分 -->
    <CheckboxGroup v-else-if="item.type === 'checkbox' && item.options" :style="item.style || item.width?`width:${item.width}`:'width:100%'" :size="item.size" :disabled="item.disabled" :min="item.min" :max="item.max" :text-color="item.textColor" :fill="item.fill" v-bind="$attrs" v-on="$listeners">
      <Checkbox v-for="check in item.options" :key="check.label" :label="check.value" v-bind="check">{{ check.label }}</Checkbox>
    </CheckboxGroup>
    <!-- 级联框 -->
    <Cascader v-else-if="item.type === 'cascader'" :style="item.style || item.width?`width:${item.width}`:'width:100%'" clearable v-bind="$attrs" v-on="$listeners" />
    <!-- 穿梭框 -->
    <Transfer v-else-if="item.type === 'transfer'" :style="item.style || item.width?`width:${item.width}`:'width:100%'" v-bind="$attrs" v-on="$listeners" />
    <!-- 按钮 -->
    <Button v-if="item.type === 'button'" :style="item.style || item.width?`width:${item.width}`:'width:100%'" v-bind="item.button" v-on="$listeners">
      {{ item.button.text }}
    </Button>
    <!-- 纯文本 -->
    <div v-if="item.type === 'label'" :style="item.style || `min-height: 18px`">{{ item.text || $attrs.value }}</div>
    <template v-if="item.tips || item.type === 'tips'">
      <!-- 默认tips在文本框右边 -->
      <span v-if="typeof item.tips === 'string' || item.tips.align === 'right'" class="form-tip ml10">{{ typeof item.tips === 'string' ? item.tips : item.tips.text }}</span>
      <!-- 手工设置tips在文本框下面，不要修改为行内标签 -->
      <div v-else-if="item.tips.align === 'bottom'" class="form-tip" :style="item.tips.style">{{ item.tips.text }}</div>
    </template>
  </FormItem>
</template>
<script>
import { pickerOptions } from './shortcuts'

export default {
  name: 'SeachFormItem',
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      pickerOptions
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .form-tip {
  font-size: 14px;
  color: #747474;
}
</style>
