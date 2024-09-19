<template>
  <UnnnicSelectSmart
    :modelValue="modelValueParsed"
    :options="optionsParsed"
    v-bind="$attrs"
    @update:model-value="updateModelValue"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';

type OptionForUnnnicSelectSmart = {
  value: string;
  label: string;
  description?: string;
};

type Option = OptionForUnnnicSelectSmart | string;

const props = defineProps<{
  modelValue: string;
  placeholder?: string;
  options: Option[];
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const optionsParsed = computed(() => {
  const options = [];

  if (props.placeholder) {
    options.push({
      value: '',
      label: props.placeholder,
    });
  }

  options.push(
    ...props.options.map((option) =>
      typeof option === 'string' ? { value: option, label: option } : option,
    ),
  );

  return options;
});

const modelValueParsed = computed(() => {
  const find = optionsParsed.value.find(
    ({ value }) => value === props.modelValue,
  );

  return find ? [find] : [];
});

function updateModelValue(value: OptionForUnnnicSelectSmart[]) {
  emit('update:modelValue', value[0].value);
}
</script>
