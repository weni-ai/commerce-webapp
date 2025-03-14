<template>
  <Drawer v-model:isOpen="isOpen">
    <template #default>
      <section
        v-if="solution?.documentation"
        class="help-box"
        data-test="help-box"
      >
        <UnnnicIcon
          icon="info"
          size="ant"
          filled
          scheme="feedback-blue"
        />

        <I18nT
          keypath="solutions.integrate.help.container"
          tag="section"
          scope="global"
        >
          <b>{{ $t('solutions.integrate.help.0') }}</b>

          <a
            :href="solution.documentation"
            target="_blank"
          >
            {{ $t('solutions.integrate.help.1') }}
          </a>
        </I18nT>
      </section>

      <section class="form-elements">
        <template v-if="solution?.globals">
          <UnnnicFormElement
            v-for="(field, index) in Object.keys(solution.globals)"
            :key="index"
            :label="fieldLabel(field)"
          >
            <UnnnicInput
              v-if="fieldType(field) === 'text'"
              size="sm"
              :data-test="field"
              :modelValue="currentValueField(field).value"
              @update:model-value="
                ($event: string) => updateField(field, $event)
              "
            />
          </UnnnicFormElement>
        </template>

        <template v-if="solution?.sectors">
          <UnnnicFormElement
            v-for="(sector, index) in Object.keys(solution.sectors)"
            :key="index"
            :label="`Tags do ${sector}`"
          >
            <InputTags
              :data-test="sector"
              :modelValue="currentValueField(`tags:sector-${sector}`).value"
              @update:model-value="updateField(`tags:sector-${sector}`, $event)"
            />
          </UnnnicFormElement>
        </template>
      </section>
    </template>

    <template #footer>
      <UnnnicButton
        type="tertiary"
        data-test="cancel-button"
        @click="close"
      >
        {{ $t('common.cancel') }}
      </UnnnicButton>

      <UnnnicButton
        data-test="save-button"
        :loading="isSaving"
        @click="save"
      >
        {{ $t('common.finish_and_save') }}
      </UnnnicButton>
    </template>
  </Drawer>
</template>

<script setup lang="ts">
import Drawer from '@/components/Drawer.vue';
import InputTags from '@/components/InputTags.vue';
import { nextTick, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAlertStore } from '@/stores/Alert';
import { useSolutionsManagerStore } from '@/stores/SolutionsManager';
import { useRouter } from 'vue-router';
import { clone } from 'lodash';

const isOpen = defineModel<boolean>('isOpen', { required: true });

const props = defineProps<{
  solution?: Solution;
}>();

const { t } = useI18n();

const router = useRouter();
const alertStore = useAlertStore();
const solutionsManagerStore = useSolutionsManagerStore();

const isSaving = ref(false);

const formData = reactive<{
  [key: string]: {
    type: string;
    value: string | boolean | string[];
    input?: string;
  };
}>({});

function close() {
  isOpen.value = false;
}

async function save() {
  if (!props.solution) {
    return;
  }

  const sectors = Object.keys(props.solution.sectors)
    .map((sectorName) => ({
      key: sectorName,
      props: {
        value: currentValueField(`tags:sector-${sectorName}`)?.value,
      },
    }))
    .reduce((previous, { key, props }) => ({ ...previous, [key]: props }), {});

  const globals = Object.keys(props.solution.globals)
    .map((globalName) => ({
      key: globalName,
      props: {
        value: currentValueField(globalName)?.value,
      },
    }))
    .reduce((previous, { key, props }) => ({ ...previous, [key]: props }), {});

  try {
    isSaving.value = true;

    await solutionsManagerStore.integrateOrUpdate({
      ...props.solution,
      sectors,
      globals,
    });

    close();

    alertStore.add({
      type: 'success',
      text: t('solutions.integrate.status.created'),
    });

    router.push({ name: 'integrated-solutions' });
  } finally {
    isSaving.value = false;
  }
}

const types = ['tags'];

watch(
  isOpen,
  (isOpen) => {
    if (isOpen && props.solution) {
      Object.keys(props.solution.sectors).forEach((sectorName) => {
        updateField(
          `tags:sector-${sectorName}`,
          clone(props.solution.sectors[sectorName].value),
        );
      });

      Object.keys(props.solution.globals).forEach((globalName) => {
        updateField(globalName, props.solution.globals[globalName].value);
      });
    } else if (isOpen) {
      nextTick(close);
    }
  },
  { immediate: true },
);

function currentValueField(field: string) {
  const type = fieldType(field);
  const label = fieldLabel(field);

  if (type === 'text') {
    return formData[label];
  } else if (type === 'tags') {
    return formData[label];
  }
}

function updateField(field: string, value: string | boolean | string[]) {
  const type = fieldType(field);
  const label = fieldLabel(field);

  let input;

  if (formData[label]) {
    input = formData[label];
  } else {
    input = {
      type,
    };

    formData[label] = input;
  }

  if (type === 'text') {
    input.value = value;
  } else if (type === 'tags') {
    if (!input.value) {
      input.value = [];
    }

    input.value = value;
  }
}

function fieldType(name: string) {
  return types.find((type) => name.startsWith(type + ':')) || 'text';
}

function fieldLabel(name: string) {
  const type = types.find((type) => name.startsWith(type + ':'));

  if (type) {
    return name.slice((type + ':').length);
  } else {
    return name;
  }
}
</script>

<style lang="scss" scoped>
.form-elements {
  display: flex;
  flex-direction: column;
  row-gap: $unnnic-spacing-sm;
}

.help-box {
  display: flex;
  column-gap: $unnnic-spacing-xs;
  padding: $unnnic-spacing-sm - $unnnic-border-width-thinner;
  border: $unnnic-border-width-thinner solid $unnnic-color-neutral-soft;
  background-color: $unnnic-color-neutral-lightest;
  border-radius: $unnnic-border-radius-sm;
  margin-bottom: $unnnic-spacing-md;

  color: $unnnic-color-neutral-dark;
  font-family: $unnnic-font-family-secondary;
  font-weight: $unnnic-font-weight-regular;
  font-size: $unnnic-font-size-body-gt;
  line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;

  b {
    font-weight: $unnnic-font-weight-bold;
  }

  a {
    color: inherit;
    text-decoration: underline;
    text-underline-offset: $unnnic-spacing-nano;
  }
}
</style>
