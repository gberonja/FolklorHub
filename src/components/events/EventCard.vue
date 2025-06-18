<template>
    <div class="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow">
      <div class="flex flex-col md:flex-row">
        <div class="md:w-24 flex-shrink-0 mb-4 md:mb-0">
          <div class="text-center bg-gray-100 rounded-lg p-2">
            <div class="text-sm text-gray-600">{{ formatMonth }}</div>
            <div class="text-2xl font-bold">{{ formatDay }}</div>
            <div class="text-sm text-gray-600">{{ formatYear }}</div>
          </div>
        </div>
  
        <div class="md:ml-6 flex-grow">
          <div class="flex flex-col md:flex-row md:items-center justify-between">
            <h3 class="text-xl font-semibold">{{ event.title }}</h3>
            <span
              class="inline-block px-2 py-1 text-xs rounded-full text-white mt-2 md:mt-0"
              :class="{
                'bg-red-600': event.type === 'smotra',
                'bg-blue-600': event.type === 'festival',
                'bg-green-600': event.type === 'radionica',
              }"
            >
              {{ typeLabel }}
            </span>
          </div>
  
          <div class="mt-2 flex items-center text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>{{ event.location }}</span>
          </div>
  
          <p class="mt-3 text-gray-700">{{ event.description }}</p>
  
          <div class="mt-4">
            <button @click="$emit('view-details', event)" class="text-blue-600 hover:underline">
              Više detalja →
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    event: {
      type: Object,
      required: true
    }
  })
  
  defineEmits(['view-details'])
  

  const formatDay = computed(() => {
    return new Date(props.event.date).getDate()
  })
  
  const formatMonth = computed(() => {
    const months = [
      'Sij', 'Velj', 'Ožu', 'Tra', 'Svi', 'Lip',
      'Srp', 'Kol', 'Ruj', 'Lis', 'Stu', 'Pro'
    ]
    return months[new Date(props.event.date).getMonth()]
  })
  
  const formatYear = computed(() => {
    return new Date(props.event.date).getFullYear()
  })
  

  const typeLabel = computed(() => {
    switch (props.event.type) {
      case 'smotra':
        return 'Smotra'
      case 'festival':
        return 'Festival'
      case 'radionica':
        return 'Radionica'
      default:
        return props.event.type
    }
  })
  </script>