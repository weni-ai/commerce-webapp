<template>
  <Drawer ref="drawer">
    <template #default>
      <section
        v-if="solution.documentation"
        class="help-box"
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
        <template
          v-for="(field, index) in solution.globals"
          :key="index"
        >
          <UnnnicSwitch
            v-if="fieldType(field) === 'switch'"
            :textRight="fieldLabel(field)"
            :modelValue="currentValueField(field).value"
            @update:model-value="updateField(field, $event)"
          />

          <UnnnicFormElement
            v-else
            :label="fieldLabel(field)"
          >
            <UnnnicInput
              v-if="fieldType(field) === 'text'"
              size="sm"
              :modelValue="currentValueField(field).value"
              @update:model-value="updateField(field, $event)"
            />
          </UnnnicFormElement>
        </template>

        <UnnnicFormElement
          v-for="(sector, index) in solution.sectors"
          :key="index"
          :label="`Tags do ${sector}`"
        >
          <UnnnicInput
            size="sm"
            iconRight="add"
            iconRightClickable
            :modelValue="currentValueField(`tags:sector-${sector}`).input"
            @update:model-value="updateField(`tags:sector-${sector}`, $event)"
            @icon-right-click="iconRightClick(`tags:sector-${sector}`)"
            @keydown.enter.self="iconRightClick(`tags:sector-${sector}`)"
          />

          <section class="tags">
            <section
              v-for="(tag, tagIndex) in currentValueField(
                `tags:sector-${sector}`,
              ).value"
              :key="tagIndex"
              class="tags__tag"
            >
              {{ tag }}
            </section>
          </section>
        </UnnnicFormElement>

        <UnnnicFormElement
          v-if="solution.flows.length"
          label="Fluxo inicial:"
        >
          <SelectSmart
            :modelValue="currentValueField('select:flow').value"
            size="sm"
            placeholder=" "
            :options="
              solution.flows.map(({ uuid, name }) => ({
                value: uuid,
                label: name,
              }))
            "
            @update:model-value="updateField('select:flow', $event)"
          />
        </UnnnicFormElement>
      </section>
    </template>

    <template #footer>
      <UnnnicButton
        type="tertiary"
        @click="close"
      >
        {{ $t('common.cancel') }}
      </UnnnicButton>

      <UnnnicButton @click="save">
        {{ $t('common.finish_and_save') }}
      </UnnnicButton>
    </template>
  </Drawer>
</template>

<script setup lang="ts">
import Drawer from '@/components/Drawer.vue';
import SelectSmart from '@/components/SelectSmart.vue';
import { reactive, ref, useAttrs, useTemplateRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAlertStore } from '@/stores/Alert';
import { useSolutionsStore } from '@/stores/Solutions';
import { useRouter } from 'vue-router';

const props = defineProps<{
  id: string;
  category: 'activeNotifications' | 'passiveService';
  solution: any;
  values: any;
}>();

const { t } = useI18n();

const attrs = useAttrs();

const router = useRouter();
const alertStore = useAlertStore();
const solutionsStore = useSolutionsStore();

const drawerRef = useTemplateRef('drawer');

const formData = reactive<{
  [key: string]: {
    type: string;
    value: string | boolean | string[];
    input?: string;
  };
}>({});

function close() {
  drawerRef.value?.close();
}

function save() {
  close();

  if (Object.keys(props.values).length) {
    return;
  }

  solutionsStore.integrate({
    id: props.id,
  });

  alertStore.add({
    type: 'success',
    text: t('solutions.integrate.status.created'),
  });

  router.push({ name: 'integrated-solutions' });
}

const types = ['switch', 'tags', 'select'];

watch(
  () => attrs.isOpen,
  (isOpen) => {
    if (isOpen) {
      resetForm();
    }
  },
);

function resetForm() {
  Object.keys(formData).forEach((key) => {
    delete formData[key];
  });

  Object.entries(props.values).forEach(([key, value]) => {
    const type = fieldType(key);
    const label = fieldLabel(key);

    if (type === 'text') {
      formData[label] = { type: 'text', value };
    } else if (type === 'switch') {
      formData[label] = { type: 'switch', value };
    } else if (type === 'tags') {
      formData[label] = { type: 'tags', value, input: '' };
    } else if (type === 'select') {
      formData[label] = { type: 'select', value };
    }
  });
}

function iconRightClick(field: string) {
  const tagField = currentValueField(field);

  const tag = tagField.input.trim();

  if (tagField.value.includes(tag)) {
    return;
  }

  if (tag) {
    tagField.value.push(tagField.input.trim());
  }

  tagField.input = '';
}

function currentValueField(field: string) {
  const type = fieldType(field);
  const label = fieldLabel(field);

  if (type === 'text') {
    return formData[label] || { type: 'text', value: '' };
  } else if (type === 'switch') {
    return formData[label] || { type: 'switch', value: false };
  } else if (type === 'tags') {
    return formData[label] || { type: 'tags', value: [], input: '' };
  } else if (type === 'select') {
    return formData[label] || { type: 'select', value: '' };
  }
}

function updateField(field: string, value: string | boolean) {
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
  } else if (type === 'switch') {
    input.value = value;
  } else if (type === 'tags') {
    if (!input.value) {
      input.value = [];
    }

    input.input = value;
  } else if (type === 'select') {
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
.tags {
  margin-top: $unnnic-spacing-xs;
  display: flex;
  flex-wrap: wrap;
  gap: $unnnic-spacing-xs;

  &__tag {
    user-select: none;
    padding: $unnnic-spacing-nano $unnnic-spacing-ant;
    border-radius: $unnnic-border-radius-pill;
    background-color: $unnnic-color-neutral-light;

    color: $unnnic-color-neutral-cloudy;
    font-family: $unnnic-font-family-secondary;
    font-weight: $unnnic-font-weight-regular;
    font-size: $unnnic-font-size-body-md;
    line-height: $unnnic-font-size-body-md + $unnnic-line-height-md;
  }
}

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
