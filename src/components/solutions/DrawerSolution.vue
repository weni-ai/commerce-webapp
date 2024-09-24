<template>
  <Drawer ref="drawer">
    <template #default>
      <section class="help-box">
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
            href="http://google.com"
            target="_blank"
          >
            {{ $t('solutions.integrate.help.1') }}
          </a>
        </I18nT>
      </section>

      <section class="form-elements">
        <UnnnicFormElement
          v-for="i in 20"
          :key="i"
          label="API Token"
        >
          <UnnnicInput size="sm" />
        </UnnnicFormElement>

        <UnnnicFormElement label="Tags setor nome 1">
          <SelectSmart
            v-model="val"
            size="sm"
            placeholder="Placeholder"
            :options="['Options 1', 'Option 2', 'Option 3']"
          />
        </UnnnicFormElement>

        <UnnnicSwitch
          v-model="val2"
          textRight="Bloqueio por horário"
        />
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
import { ref, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAlertStore } from '@/stores/Alert';
import { useSolutionsStore } from '@/stores/Solutions';
import { useRouter } from 'vue-router';

const props = defineProps<{
  id: string;
  category: 'activeNotifications' | 'passiveService';
}>();

const { t } = useI18n();

const router = useRouter();
const alertStore = useAlertStore();
const solutionsStore = useSolutionsStore();

const drawerRef = useTemplateRef('drawer');

const val = ref('');
const val2 = ref(false);

function close() {
  drawerRef.value?.close();
}

function save() {
  close();

  solutionsStore.integrate({
    id: props.id,
  });

  alertStore.add({
    type: 'success',
    text: t('solutions.integrate.status.created'),
  });

  router.push({ name: 'integrated-solutions' });
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
