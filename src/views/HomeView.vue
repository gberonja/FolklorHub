<template>
  <div>
    <!-- Hero sekcija -->
    <section class="bg-red-600 text-white py-16">
      <div class="container mx-auto px-4">
        <div class="text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">Dobrodošli u FolklorHub</h1>
          <p class="text-xl max-w-3xl mx-auto mb-8">Digitalni arhiv hrvatske folklorne baštine</p>
          <div class="flex flex-col sm:flex-row justify-center gap-4">
            <router-link to="/katalog" class="btn bg-white text-red-600 hover:bg-gray-100">
              Istraži katalog
            </router-link>
            <router-link to="/dogadjanja" class="btn bg-red-600 border border-white hover:bg-red-700">
              Pogledaj događanja
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- O platformi -->
    <section class="py-12 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">O FolklorHub platformi</h2>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            FolklorHub je digitalna platforma namijenjena očuvanju i promociji hrvatske folklorne
            baštine. Platforma omogućuje korisnicima pregledavanje folklornih plesova, pjesama i
            događanja, posebno prilagođena potrebama folkloraša i entuzijasta hrvatske tradicijske
            kulture.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <feature-card title="Digitalni katalog" icon-color="text-red-600"
            icon-path="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
            Istražite našu bogatu zbirku folklornih plesova i pjesama iz svih regija Hrvatske.
          </feature-card>

          <feature-card title="Kalendar događanja" icon-color="text-blue-600"
            icon-path="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z">
            Budite u toku s nadolazećim smotrama, festivalima i drugim folklornim događanjima.
          </feature-card>

          <feature-card title="Forum za diskusiju" icon-color="text-green-600"
            icon-path="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z">
            Povežite se s drugim folklorašima, postavljajte pitanja i dijelite svoja iskustva.
          </feature-card>
        </div>
      </div>
    </section>

    <!-- Najnoviji sadržaj -->
    <section class="py-12 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">Najnoviji sadržaj</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Sadržaj se učitava dinamički -->
          <div v-if="loading" class="md:col-span-3 py-12 flex justify-center">
            <div class="animate-spin h-10 w-10 border-4 border-red-600 rounded-full border-t-transparent"></div>
          </div>

          <template v-else>
            <!-- Izdvojeni ples -->
            <featured-item v-if="featuredDance" :title="featuredDance.name" :subtitle="featuredDance.regionName"
              :description="truncateDescription(featuredDance.description)" :link-text="'Saznaj više →'"
              :link-url="`/katalog/${featuredDance.type}/${featuredDance.id}`" :link-color="'text-red-600'" />
            <featured-item v-else title="Linđo" subtitle="Dubrovačka regija"
              description="Linđo je tradicionalni ples dubrovačkog područja koji se pleše uz pratnju lijerice..."
              link-text="Saznaj više →" link-url="/katalog/ples/lindjo" link-color="text-red-600" />

            <!-- Izdvojeni događaj -->
            <featured-item v-if="featuredEvent" :title="featuredEvent.title"
              :subtitle="`${featuredEvent.location}, ${formatEventDate(featuredEvent.date)}`"
              :description="truncateDescription(featuredEvent.description)" :link-text="'Saznaj više →'"
              :link-url="'/dogadjanja'" :link-color="'text-blue-600'" />
            <featured-item v-else title="Međunarodna smotra folklora" subtitle="Zagreb, 15.-20. srpnja"
              description="Najveća i najvažnija smotra folklornog stvaralaštva u Hrvatskoj..." link-text="Saznaj više →"
              link-url="/dogadjanja" link-color="text-blue-600" />

            <!-- Izdvojena tema foruma -->
            <featured-item v-if="featuredTopic" :title="featuredTopic.title" :subtitle="'Forum diskusija'"
              :description="truncateDescription(featuredTopic.description)" :link-text="'Pridruži se diskusiji →'"
              :link-url="`/forum/tema/${featuredTopic.id}`" :link-color="'text-green-600'" />
            <featured-item v-else title="Radionice folklornih plesova" subtitle="Forum diskusija"
              description="Rasprava o nadolazećim radionicama folklornih plesova diljem Hrvatske..."
              link-text="Pridruži se diskusiji →" link-url="/forum" link-color="text-green-600" />
          </template>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { format, parseISO } from 'date-fns'
import { hr } from 'date-fns/locale'
import FeatureCard from '@/components/home/FeatureCard.vue'
import FeaturedItem from '@/components/home/FeaturedItem.vue'
import { useCatalogStore } from '@/stores/catalog'
import { useEventsStore } from '@/stores/events'
import { useForumStore } from '@/stores/forum'


const catalogStore = useCatalogStore()
const eventsStore = useEventsStore()
const forumStore = useForumStore()


const loading = ref(true)


const featuredDance = computed(() => {

  const dances = catalogStore.items.filter(item => item.type === 'ples')
  return dances.length > 0 ? dances[Math.floor(Math.random() * dances.length)] : null
})

const featuredEvent = computed(() => {

  const now = new Date()
  const upcomingEvents = eventsStore.events
    .filter(event => new Date(event.date) > now)
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  return upcomingEvents.length > 0 ? upcomingEvents[0] : null
})

const featuredTopic = computed(() => {
  return forumStore.topics.length > 0 ? forumStore.topics[0] : null
})


const truncateDescription = (text) => {
  if (!text) return ''
  return text.length > 120 ? text.substring(0, 120) + '...' : text
}

const formatEventDate = (dateString) => {
  if (!dateString) return ''

  try {
    const date = parseISO(dateString)
    return format(date, 'dd.MM.yyyy.', { locale: hr })
  } catch (err) {
    console.error('Date formatting error:', err)
    return dateString
  }
}

onMounted(async () => {
  try {
    await Promise.all([
      catalogStore.fetchItems(),
      eventsStore.fetchEvents(),
      forumStore.fetchTopics()
    ])
  } catch (error) {
    console.error('Error loading homepage data:', error)
  } finally {
    loading.value = false
  }
})
</script>