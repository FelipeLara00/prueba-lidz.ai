<script setup lang="ts">
import type { CreateClientDebtRequestDTO, CreateClientRequestDTO } from '~/dtos';
import { formatRut } from '~/utils';

const form = defineModel<CreateClientRequestDTO>('form', { required: true });

defineProps<{
  saving: boolean;
}>();

const emit = defineEmits<{
  submit: [];
}>();

const step = ref(1);
const hasDebts = ref<boolean | null>(null);
const firstMessage = ref('');
const stepError = ref('');

function splitName(fullName: string): { firstName: string; lastName: string } {
  const normalized = fullName.trim();

  if (!normalized) {
    return { firstName: '', lastName: '' };
  }

  const parts = normalized.split(/\s+/);
  return {
    firstName: parts[0] ?? '',
    lastName: parts.slice(1).join(' '),
  };
}

function composeName(firstName: string, lastName: string): string {
  return [firstName.trim(), lastName.trim()].filter(Boolean).join(' ');
}

const firstName = computed({
  get: () => splitName(form.value.name).firstName,
  set: (value: string) => {
    const lastNameValue = splitName(form.value.name).lastName;
    form.value.name = composeName(value, lastNameValue);
  },
});

const lastName = computed({
  get: () => splitName(form.value.name).lastName,
  set: (value: string) => {
    const firstNameValue = splitName(form.value.name).firstName;
    form.value.name = composeName(firstNameValue, value);
  },
});

const debts = computed<CreateClientDebtRequestDTO[]>(() => form.value.debts ?? []);

function onRutBlur() {
  form.value.rut = formatRut(form.value.rut);
}

function addDebt() {
  if (!form.value.debts) {
    form.value.debts = [];
  }

  form.value.debts.push({
    institution: '',
    amount: 0,
    dueDate: '',
  });
}

function removeDebt(index: number) {
  if (!form.value.debts) {
    return;
  }

  form.value.debts.splice(index, 1);
}

function goNext() {
  stepError.value = '';

  if (step.value === 1) {
    if (!form.value.name.trim() || !form.value.rut.trim()) {
      stepError.value = 'Completa nombre y RUT para continuar.';
      return;
    }
    step.value = 2;
    return;
  }

  if (step.value === 2) {
    if (hasDebts.value === null) {
      stepError.value = 'Indica si el cliente tiene deudas.';
      return;
    }

    if (!hasDebts.value) {
      form.value.debts = [];
    }

    step.value = 3;
  }
}

function goBack() {
  stepError.value = '';
  step.value = Math.max(1, step.value - 1);
}

function onSubmitFlow() {
  stepError.value = '';

  if (!firstMessage.value.trim()) {
    stepError.value = 'Escribe el primer mensaje para iniciar la conversación.';
    return;
  }

  form.value.messages = [
    {
      text: firstMessage.value.trim(),
      role: 'client',
      sentAt: new Date().toISOString(),
    },
  ];

  emit('submit');
}

onMounted(() => {
  step.value = 1;
  hasDebts.value = (form.value.debts?.length ?? 0) > 0 ? true : null;
  firstMessage.value = '';
  stepError.value = '';
});
</script>

<template>
  <UCard
    :ui="{
      root: 'w-full max-w-2xl mx-auto rounded-3xl border-0 ring-0 shadow-none',
      body: 'p-4 md:p-5 space-y-4',
    }"
  >
    <UForm
      :state="form"
      class="space-y-5"
      @submit.prevent
    >
      <div
        v-if="step === 1"
        class="rounded-3xl bg-transparent p-1 space-y-4"
      >
        <UFormField
          class="w-full"
          label="Nombre"
        >
          <UInput
            v-model="firstName"
            class="w-full"
            size="lg"
            placeholder="Juan"
          />
        </UFormField>

        <UFormField
          class="w-full"
          label="Apellido"
        >
          <UInput
            v-model="lastName"
            class="w-full"
            size="lg"
            placeholder="Perez"
          />
        </UFormField>

        <UFormField
          class="w-full"
          label="RUT"
        >
          <UInput
            v-model="form.rut"
            class="w-full"
            size="lg"
            placeholder="12345678-9"
            @blur="onRutBlur"
          />
        </UFormField>

        <UFormField
          class="w-full"
          label="Sueldo"
        >
          <UInputNumber
            v-model="form.salary"
            class="w-full"
            size="lg"
            :min="0"
          />
        </UFormField>

        <UFormField
          class="w-full"
          label="Ahorros"
        >
          <UInputNumber
            v-model="form.savings"
            class="w-full"
            size="lg"
            :min="0"
          />
        </UFormField>
      </div>

      <div
        v-if="step === 2"
        class="space-y-4"
      >
        <div
          class="rounded-3xl bg-white dark:bg-neutral-900 p-4 md:p-5 space-y-4 ring-1 ring-slate-100 dark:ring-neutral-800"
        >
          <p class="text-sm font-medium">¿Tiene deudas registrables?</p>
          <div class="flex items-center gap-3">
            <UButton
              type="button"
              :variant="hasDebts === true ? 'solid' : 'soft'"
              color="neutral"
              @click="hasDebts = true"
            >
              Sí
            </UButton>
            <UButton
              type="button"
              :variant="hasDebts === false ? 'solid' : 'soft'"
              color="neutral"
              @click="hasDebts = false"
            >
              No
            </UButton>
          </div>
        </div>

        <div
          v-if="hasDebts"
          class="rounded-3xl bg-white dark:bg-neutral-900 p-4 md:p-6 space-y-4"
        >
          <div class="flex items-center justify-between gap-2">
            <h4 class="font-semibold text-base">Deudas</h4>
            <UButton
              type="button"
              color="neutral"
              variant="soft"
              icon="i-lucide-plus"
              @click="addDebt"
            >
              Agregar deuda
            </UButton>
          </div>

          <div
            v-if="!debts.length"
            class="rounded-2xl bg-slate-50 dark:bg-neutral-800 p-5 text-sm text-muted"
          >
            Aún no agregas deudas.
          </div>

          <div class="space-y-4">
            <div
              v-for="(debt, index) in debts"
              :key="`debt-${index}`"
              class="rounded-2xl bg-slate-50 dark:bg-neutral-800 p-4 md:p-5 space-y-4"
            >
              <div class="flex items-center justify-between gap-3">
                <p class="text-sm font-medium text-slate-600 dark:text-slate-300">
                  Deuda {{ index + 1 }}
                </p>
                <UButton
                  type="button"
                  color="error"
                  variant="soft"
                  icon="i-lucide-trash-2"
                  @click="removeDebt(index)"
                >
                  Quitar
                </UButton>
              </div>

              <UFormField
                class="w-full"
                :label="`Institución`"
              >
                <UInput
                  v-model="debt.institution"
                  class="w-full"
                  size="lg"
                  placeholder="Banco Estado"
                />
              </UFormField>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UFormField label="Monto">
                  <UInputNumber
                    v-model="debt.amount"
                    class="w-full"
                    size="lg"
                    :min="0"
                  />
                </UFormField>

                <UFormField label="Vencimiento">
                  <UInput
                    v-model="debt.dueDate"
                    class="w-full"
                    size="lg"
                    type="date"
                  />
                </UFormField>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="step === 3"
        class="rounded-3xl bg-white dark:bg-neutral-900 p-5 md:p-7 space-y-4"
      >
        <p class="text-base font-semibold">Primer mensaje del cliente</p>
        <UTextarea
          v-model="firstMessage"
          class="w-full"
          size="xl"
          :rows="9"
          placeholder="Ej: Quiero evaluar si me conviene comprar o arrendar en esta comuna..."
        />
      </div>
    </UForm>

    <UAlert
      v-if="stepError"
      color="error"
      variant="subtle"
      :title="stepError"
    />

    <div class="w-full flex items-center justify-end gap-2">
      <UButton
        v-if="step > 1"
        color="neutral"
        variant="soft"
        icon="i-lucide-arrow-left"
        @click="goBack"
      >
        Atrás
      </UButton>

      <UButton
        v-if="step < 3"
        color="primary"
        icon="i-lucide-arrow-right"
        trailing-icon="i-lucide-arrow-right"
        @click="goNext"
      >
        Siguiente
      </UButton>

      <UButton
        v-else
        :loading="saving"
        icon="i-lucide-check"
        @click="onSubmitFlow"
      >
        Crear e ir al chat
      </UButton>
    </div>
  </UCard>
</template>
