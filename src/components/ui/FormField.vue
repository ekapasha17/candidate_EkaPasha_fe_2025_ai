<template>
    <div class="space-y-2">
      <label 
        v-if="label"
        :for="id"
        class="block text-sm font-medium text-gray-700"
      >
        {{ label }}
        <span v-if="required" class="text-red-500 ml-1">*</span>
      </label>
      
      <!-- Text Input -->
      <input
        v-if="type === 'text' || type === 'email'"
        :id="id"
        :type="type"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        class="input-field"
      />
      
      <!-- Textarea -->
      <textarea
        v-else-if="type === 'textarea'"
        :id="id"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :rows="rows || 3"
        class="input-field resize-none"
      ></textarea>
      
      <!-- Select Dropdown -->
      <select
        v-else-if="type === 'select'"
        :id="id"
        :value="modelValue"
        @change="$emit('update:modelValue', $event.target.value)"
        :required="required"
        :disabled="disabled"
        class="input-field"
      >
        <option value="">{{ placeholder || 'Select an option' }}</option>
        <option 
          v-for="option in options" 
          :key="option.id || option.value" 
          :value="option.id || option.value"
        >
          {{ option.name || option.label || option.text }}
        </option>
      </select>
      
      <!-- Datetime Input -->
      <input
        v-else-if="type === 'datetime-local'"
        :id="id"
        type="datetime-local"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :required="required"
        :disabled="disabled"
        class="input-field"
      />
      
      <!-- File Input -->
      <input
        v-else-if="type === 'file'"
        :id="id"
        type="file"
        @change="handleFileChange"
        :accept="accept"
        :required="required"
        :disabled="disabled"
        class="input-field"
      />
      
      <!-- Help Text -->
      <p v-if="helpText" class="text-sm text-gray-500">
        {{ helpText }}
      </p>
      
      <!-- Error Message -->
      <p v-if="error" class="text-sm text-red-600">
        {{ error }}
      </p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'FormField',
    emits: ['update:modelValue', 'file-selected'],
    props: {
      id: String,
      label: String,
      type: {
        type: String,
        default: 'text'
      },
      modelValue: [String, Number, File],
      placeholder: String,
      required: Boolean,
      disabled: Boolean,
      helpText: String,
      error: String,
      options: Array,
      rows: Number,
      accept: String
    },
    methods: {
      handleFileChange(event) {
        const file = event.target.files[0]
        this.$emit('file-selected', file)
        this.$emit('update:modelValue', file)
      }
    }
  }
  </script>