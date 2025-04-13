<template>
  <div class="py-8">
    <div class="container mx-auto px-4">
      <!-- Breadcrumb navigacija -->
      <div class="mb-6">
        <nav class="flex" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-2">
            <li>
              <router-link to="/" class="text-gray-500 hover:text-gray-700">Početna</router-link>
            </li>
            <li>
              <span class="text-gray-500 mx-2">/</span>
              <router-link to="/forum" class="text-gray-500 hover:text-gray-700">Forum</router-link>
            </li>
            <li v-if="topic">
              <span class="text-gray-500 mx-2">/</span>
              <span class="text-gray-900">{{ topic.title }}</span>
            </li>
          </ol>
        </nav>
      </div>

      <!-- Tema i komentari -->
      <div v-if="loading" class="flex justify-center py-12">
        <svg
          class="animate-spin h-8 w-8 text-red-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>

      <div v-else-if="topic">
        <!-- Topic header -->
        <div class="bg-white rounded-lg shadow-lg mb-6 overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <div class="flex justify-between items-start">
              <h1 class="text-2xl font-bold text-gray-900">{{ topic.title }}</h1>
              <div>
                <button class="btn btn-secondary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-1 inline"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"
                    />
                  </svg>
                  Podijeli
                </button>
              </div>
            </div>

            <div class="flex flex-wrap items-center text-sm text-gray-500 mt-3">
              <div class="flex items-center mr-4">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>{{ topic.author }}</span>
              </div>
              <div class="flex items-center mr-4">
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>Kreirano: {{ formatDate(topic.createdAt) }}</span>
              </div>
              <div class="flex items-center">
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
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
                <span>{{ topic.commentsCount }} odgovora</span>
              </div>
            </div>
          </div>

          <!-- Topic content -->
          <div class="p-6">
            <div class="flex items-start">
              <div class="flex-shrink-0 mr-4">
                <div
                  class="h-10 w-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold"
                >
                  {{ getInitials(topic.author) }}
                </div>
              </div>
              <div class="flex-grow">
                <p class="text-gray-800 whitespace-pre-line">{{ topic.description }}</p>

                <div class="mt-4 flex flex-wrap gap-2">
                  <span
                    v-for="tag in topic.tags"
                    :key="tag"
                    class="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Comments section -->
        <div class="mb-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Odgovori ({{ comments.length }})</h2>

          <!-- Comment list -->
          <div v-if="comments.length > 0" class="space-y-4">
            <div
              v-for="comment in comments"
              :key="comment.id"
              class="bg-white rounded-lg shadow p-6"
            >
              <div class="flex items-start">
                <div class="flex-shrink-0 mr-4">
                  <div
                    class="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold"
                  >
                    {{ getInitials(comment.author) }}
                  </div>
                </div>
                <div class="flex-grow">
                  <div class="flex justify-between">
                    <div>
                      <span class="font-medium text-gray-900">{{ comment.author }}</span>
                      <span class="text-sm text-gray-500 ml-2">{{
                        formatDate(comment.createdAt)
                      }}</span>
                    </div>
                    <button class="text-gray-400 hover:text-gray-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                        />
                      </svg>
                    </button>
                  </div>

                  <p class="mt-2 text-gray-800 whitespace-pre-line">{{ comment.content }}</p>

                  <div class="mt-3 flex space-x-2">
                    <button class="text-gray-500 hover:text-gray-700 text-sm flex items-center">
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
                          d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                        />
                      </svg>
                      Sviđa mi se ({{ comment.likes }})
                    </button>
                    <button class="text-gray-500 hover:text-gray-700 text-sm flex items-center">
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
                          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                      </svg>
                      Odgovori
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- No comments yet -->
          <div v-else class="bg-white p-8 rounded-lg shadow text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-16 w-16 text-gray-400 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <h3 class="text-xl font-semibold mb-2">Još nema odgovora</h3>
            <p class="text-gray-600 mb-4">Budite prvi koji će odgovoriti na ovu temu!</p>
          </div>
        </div>

        <!-- New comment form -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Dodaj odgovor</h2>

          <form @submit.prevent="addComment">
            <div class="mb-4">
              <textarea
                v-model="newComment"
                rows="4"
                class="form-input"
                placeholder="Napišite svoj odgovor..."
                required
              ></textarea>
            </div>

            <div class="flex justify-end">
              <button type="submit" class="btn btn-primary">Objavi odgovor</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Topic not found -->
      <div v-else class="bg-white p-8 rounded-lg shadow text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-16 w-16 text-red-600 mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 class="text-2xl font-bold mb-2">Tema nije pronađena</h2>
        <p class="text-gray-600 mb-4">Nažalost, tražena tema nije pronađena ili je uklonjena.</p>
        <router-link to="/forum" class="btn btn-primary"> Povratak na forum </router-link>
      </div>
    </div>
  </div>
</template>
  
  <script>
export default {
  name: 'ForumTopicView',
  data() {
    return {
      topic: null,
      comments: [],
      loading: true,
      newComment: '',

      // Dummy podaci za testiranje
      topicsData: [
        {
          id: '1',
          title: 'Pomoć oko koraka za Linđo',
          description:
            'Pozdrav svima!\n\nNedavno sam se pridružio/la folklornom ansamblu i učim plesati Linđo. Imam problem s nekim koracima i bilo bi mi drago da mi netko može pomoći s tim. Posebno mi je teško uskladiti korake s ritmom i pravilno izvoditi okrete.\n\nIma li netko savjet ili možda kakav video tutorial koji bi mogao preporučiti?\n\nHvala unaprijed!',
          author: 'Ana Horvat',
          createdAt: '2025-05-10T14:30:00',
          lastReplyAt: '2025-05-11T09:15:00',
          commentsCount: 3,
          tags: ['ples', 'linđo', 'koraci', 'pomoć'],
        },
        {
          id: '2',
          title: 'Gdje nabaviti narodne nošnje?',
          description:
            'Tražim kvalitetne narodne nošnje za naš folklorni ansambl. Znate li gdje se mogu kupiti ili naručiti kvalitetne narodne nošnje, posebno za slavonsku regiju?\n\nNajviše nas zanimaju ženske nošnje s tradicionalnim vezom i muškim nošnjama s odgovarajućim šeširima i čizmama.\n\nTakođer, ako netko zna majstore koji izrađuju po narudžbi, to bi bilo idealno.\n\nUnaprijed hvala na preporukama!',
          author: 'Marko Kovačić',
          createdAt: '2025-05-05T10:45:00',
          lastReplyAt: '2025-05-09T16:20:00',
          commentsCount: 8,
          tags: ['nošnje', 'nabava', 'slavonija'],
        },
        {
          id: '3',
          title: 'Detalji o smotri u Slavonskom Brodu',
          description:
            'Zanima me ima li netko više informacija o nadolazećoj smotri folklora u Slavonskom Brodu? Kada počinje prijava, i koji je program?\n\nPlaniramo sudjelovati s našim ansamblom, pa bih volio/la znati više detalja oko organizacije i smještaja.\n\nPostoji li službena web stranica događaja?',
          author: 'Ivan Petrović',
          createdAt: '2025-05-01T09:00:00',
          lastReplyAt: '2025-05-03T11:30:00',
          commentsCount: 3,
          tags: ['smotra', 'slavonski brod', 'događaj'],
        },
      ],

      commentsData: {
        1: [
          {
            id: '1-1',
            author: 'Marija Jurić',
            content:
              'Pozdrav Ana! I ja sam nedavno učila Linđo i znam da može biti izazovno na početku. Meni je pomoglo vježbanje pred ogledalom i usporavanje tempa dok ne savladam korake.\n\nPreporučam da pogledaš video radionice KUD-a Linđo iz Dubrovnika na njihovom YouTube kanalu, imaju odlične tutorijale za početnike.',
            createdAt: '2025-05-10T15:45:00',
            likes: 3,
          },
          {
            id: '1-2',
            author: 'Petar Novak',
            content:
              'Ana, ključ je u slušanju glazbe i razumijevanju ritma. Probaj prvo samo slušati glazbu bez plesanja, a tek onda polako dodavati korake.\n\nAko si iz Zagreba, imamo radionice svakog četvrtka u KUD-u "Mladost" gdje možeš dobiti dodatnu pomoć. Javi se ako te zanima!',
            createdAt: '2025-05-10T18:30:00',
            likes: 1,
          },
          {
            id: '1-3',
            author: 'Ivana Horvat',
            content:
              'Kao dugogodišnja plesačica Linđa, preporučila bih ti da se fokusiraš na držanje tijela i stav. Često je to važnije od samih koraka.\n\nLinđo ima svojih specifičnosti ovisno o kraju, pa bi bilo dobro znati koju varijantu učiš?',
            createdAt: '2025-05-11T09:15:00',
            likes: 2,
          },
        ],
        2: [
          {
            id: '2-1',
            author: 'Tomislav Kralj',
            content:
              'Preporučujem obrtničku radionicu "Narodno blago" u Osijeku. Rade kvalitetne nošnje po narudžbi i imaju veliko iskustvo s izradom slavonskih nošnji.',
            createdAt: '2025-05-05T11:20:00',
            likes: 5,
          },
          {
            id: '2-2',
            author: 'Mirjana Perić',
            content:
              'Nedavno smo za naš ansambl naručili nošnje iz Etnografskog muzeja u Zagrebu, imaju svoju radionicu gdje rade replike originalnih nošnji. Nisu jeftine, ali su izuzetno kvalitetne i autentične.',
            createdAt: '2025-05-06T14:50:00',
            likes: 2,
          },
        ],
        3: [
          {
            id: '3-1',
            author: 'Josip Matić',
            content:
              'Smotra će se održati od 15. do 17. srpnja. Prijave počinju 1. lipnja i traju do 20. lipnja. Službena web stranica je www.folklor-smotra-sb.hr gdje možeš naći sve dodatne informacije.',
            createdAt: '2025-05-01T10:15:00',
            likes: 3,
          },
          {
            id: '3-2',
            author: 'Ana Perić',
            content:
              'Mi smo sudjelovali prošle godine i bilo je odlično organizirano. Za smještaj preporučujem Hotel Central, ima dobar odnos cijene i kvalitete, a blizu je mjesta održavanja.',
            createdAt: '2025-05-02T16:30:00',
            likes: 1,
          },
          {
            id: '3-3',
            author: 'Ivan Horvat',
            content:
              'Upravo su objavili preliminarni program na službenom Facebook profilu događaja. Prema programu, nastupat će 25 ansambala iz cijele Hrvatske i nekoliko iz susjednih zemalja.',
            createdAt: '2025-05-03T11:30:00',
            likes: 0,
          },
        ],
      },
    }
  },
  mounted() {
    this.fetchTopicDetails()
  },
  methods: {
    fetchTopicDetails() {
      // Simulacija (kasnije ću implementirati)
      setTimeout(() => {
        const topicId = this.$route.params.id

        const topic = this.topicsData.find((t) => t.id === topicId)

        if (topic) {
          this.topic = topic
          this.comments = this.commentsData[topicId] || []
        }

        this.loading = false
      }, 800)
    },

    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('hr-HR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    },

    getInitials(name) {
      if (!name) return ''

      const names = name.split(' ')
      if (names.length >= 2) {
        return (names[0][0] + names[1][0]).toUpperCase()
      }
      return names[0][0].toUpperCase()
    },

    addComment() {
      if (!this.newComment.trim()) return

      const newCommentData = {
        id: `${this.topic.id}-${this.comments.length + 1}`,
        author: 'Trenutni korisnik', // kasnije dinamic
        content: this.newComment,
        createdAt: new Date().toISOString(),
        likes: 0,
      }

      this.comments.push(newCommentData)

      this.topic.commentsCount += 1
      this.topic.lastReplyAt = newCommentData.createdAt

      this.newComment = ''
    },
  },
  watch: {
    // kontrola rute
    '$route.params.id': function () {
      this.loading = true
      this.fetchTopicDetails()
    },
  },
}
</script>