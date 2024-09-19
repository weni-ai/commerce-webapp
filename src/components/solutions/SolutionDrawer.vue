<template>
  <Teleport to="#drawers">
    <Transition name="fade">
      <section
        v-if="isOpen"
        class="drawer__background"
        @click.self="close"
      ></section>
    </Transition>

    <Transition name="drawer">
      <section
        v-if="isOpen"
        class="drawer"
      >
        <header class="drawer__header">
          <Header
            :title="title"
            icon="business_messages"
            iconScheme="aux-orange-500"
            fontFamily="secondary"
            fontSize="title-md"
          />

          <UnnnicButton
            class="drawer__header__close-button"
            type="tertiary"
            iconCenter="arrow_forward"
            size="small"
            @click="close"
          />
        </header>

        <section class="drawer__body">
          <Scrollable>
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

            <section class="drawer__body__form-elements">
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
          </Scrollable>
        </section>

        <footer class="drawer__footer">
          <UnnnicButton
            type="tertiary"
            @click="close"
          >
            {{ $t('common.cancel') }}
          </UnnnicButton>

          <UnnnicButton @click="save">
            {{ $t('common.finish_and_save') }}
          </UnnnicButton>
        </footer>
      </section>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue';
import SelectSmart from '@/components/SelectSmart.vue';
import Scrollable from '@/components/Scrollable.vue';
import { onUnmounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAlertStore } from '@/stores/Alert';
import { useRouter } from 'vue-router';

const { t } = useI18n();

const router = useRouter();
const alertStore = useAlertStore();

const props = defineProps<{
  isOpen: boolean;
  title: string;
}>();

const emit = defineEmits<{
  'update:isOpen': [isOpen: boolean];
}>();

const val = ref('');
const val2 = ref(false);

function close() {
  emit('update:isOpen', false);
}

function save() {
  close();

  alertStore.add({
    type: 'success',
    text: t('solutions.integrate.status.created'),
  });

  router.push({ name: 'integrated-solutions' });
}

watch(
  () => props.isOpen,
  (isOpen) => {
    document.body.classList?.[isOpen ? 'add' : 'remove']('drawer-view');
  },
  { immediate: true },
);

onUnmounted(() => {
  document.body.classList.remove('drawer-view');
});
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.5s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(100%);
}

.drawer {
  display: flex;
  flex-direction: column;

  width: 90%;
  max-width: 41.375 * $unnnic-font-size;

  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: $unnnic-color-neutral-white;

  &__background {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    background-color: rgba(
      $unnnic-color-neutral-black,
      $unnnic-opacity-level-overlay
    );
  }

  &__header {
    display: flex;
    align-items: center;
    column-gap: $unnnic-spacing-sm;
    padding: $unnnic-spacing-md;
    padding-bottom: $unnnic-spacing-md - $unnnic-border-width-thinner;
    border-bottom: $unnnic-border-width-thinner solid $unnnic-color-neutral-soft;

    &__close-button {
      margin-left: auto;
    }
  }

  &__body {
    flex: 1;
    padding: $unnnic-spacing-md;

    &__form-elements {
      display: flex;
      flex-direction: column;
      row-gap: $unnnic-spacing-sm;
    }
  }

  &__footer {
    display: grid;
    column-gap: $unnnic-spacing-ant;
    grid-template-columns: 1fr 1fr;

    margin-top: auto;
    padding: 0 $unnnic-spacing-md $unnnic-spacing-md;
  }
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
