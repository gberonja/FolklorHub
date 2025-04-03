<template>
  <div class="py-8">
    <div class="container mx-auto px-4">
      <div v-if="item">
        <!-- Breadcrumb navigacija -->
        <div class="mb-6">
          <nav class="flex" aria-label="Breadcrumb">
            <ol class="flex items-center space-x-2">
              <li>
                <router-link to="/" class="text-gray-500 hover:text-gray-700">Početna</router-link>
              </li>
              <li>
                <span class="text-gray-500 mx-2">/</span>
                <router-link to="/katalog" class="text-gray-500 hover:text-gray-700"
                  >Katalog</router-link
                >
              </li>
              <li>
                <span class="text-gray-500 mx-2">/</span>
                <span class="text-gray-900">{{ item.name }}</span>
              </li>
            </ol>
          </nav>
        </div>

        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <!-- Gornji dio s naslovima -->
          <div class="p-6 border-b border-gray-200">
            <div class="flex flex-col md:flex-row justify-between items-start">
              <div>
                <div class="inline-block bg-red-600 text-white text-xs px-2 py-1 rounded mb-2">
                  {{ item.type === 'ples' ? 'Ples' : 'Pjesma' }}
                </div>
                <h1 class="text-3xl font-bold text-gray-900">{{ item.name }}</h1>
                <p class="text-gray-600 mt-1">{{ item.regionName }}</p>
              </div>
              <div class="mt-4 md:mt-0">
                <button class="btn btn-secondary mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-1 inline"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  Favoriti
                </button>
                <button class="btn btn-secondary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-1 inline"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                  Podijeli
                </button>
              </div>
            </div>
          </div>

          <!-- Glavni sadržaj -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            <!-- Lijeva strana - slika -->
            <div class="md:col-span-1">
              <div class="bg-gray-200 rounded-lg h-64 mb-4 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-16 w-16 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>

              <!-- Informacije -->
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-800 mb-2">Informacije</h3>
                <ul class="space-y-2 text-sm">
                  <li class="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 mr-1.5 text-gray-500"
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
                    <span
                      >Regija: <strong>{{ item.regionName }}</strong></span
                    >
                  </li>
                  <li class="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 mr-1.5 text-gray-500"
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
                    <span>Razdoblje: <strong>Tradicionalno</strong></span>
                  </li>
                  <li v-if="item.type === 'ples'" class="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 mr-1.5 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span>Broj plesača: <strong>Varijabilno</strong></span>
                  </li>
                  <li v-if="item.type === 'pjesma'" class="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 mr-1.5 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                      />
                    </svg>
                    <span
                      >Način izvedbe:
                      <strong>{{
                        item.id === 'ojkavica' ? 'Dvoglasno' : 'Solo ili grupno'
                      }}</strong></span
                    >
                  </li>
                </ul>
              </div>
            </div>

            <!-- Desna strana - opis -->
            <div class="md:col-span-2">
              <h2 class="text-xl font-semibold mb-4">
                O {{ item.type === 'ples' ? 'plesu' : 'pjesmi' }}
              </h2>
              <p class="mb-4 text-gray-700">
                {{ item.description }}
              </p>

              <p class="mb-6 text-gray-700">
                {{
                  item.type === 'ples'
                    ? 'Ovaj ples je karakterističan za tradicijski izričaj svoje regije i često se izvodi na lokalnim festivalima i kulturnim manifestacijama. Ima bogatu povijest koja seže duboko u prošlost hrvatske kulturne baštine.'
                    : 'Ova pjesma je karakteristična za tradicijski izričaj svoje regije i često se izvodi na lokalnim festivalima i kulturnim manifestacijama. Ima bogatu povijest koja seže duboko u prošlost hrvatske kulturne baštine.'
                }}
              </p>

              <!-- Video -->
              <div v-if="item.type === 'ples'">
                <h3 class="text-lg font-semibold mb-3">Video demonstracija</h3>
                <div class="bg-gray-200 rounded-lg h-72 mb-6 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-16 w-16 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>

              <!-- Audio -->
              <div v-if="item.type === 'pjesma'">
                <h3 class="text-lg font-semibold mb-3">Audio zapis</h3>
                <div class="bg-gray-200 rounded-lg p-4 mb-6 flex items-center">
                  <button class="bg-red-600 text-white rounded-full p-2 mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                    </svg>
                  </button>
                  <div class="flex-grow">
                    <div class="h-2 bg-gray-300 rounded-full">
                      <div class="h-2 bg-red-600 rounded-full w-1/3"></div>
                    </div>
                    <div class="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0:45</span>
                      <span>2:15</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Dodatne informacije -->
              <h3 class="text-lg font-semibold mb-3">Dodatne informacije</h3>
              <p class="text-gray-700 mb-6">
                {{
                  item.type === 'ples'
                    ? 'Želite li naučiti ovaj ples? Provjerite raspored radionica u našem kalendaru događanja ili se pridružite diskusiji na forumu gdje možete pronaći više informacija i savjete iskusnih plesača.'
                    : 'Želite li naučiti ovu pjesmu? Provjerite raspored radionica u našem kalendaru događanja ili se pridružite diskusiji na forumu gdje možete pronaći više informacija i savjete iskusnih izvođača.'
                }}
              </p>

              <!-- Povezani sadržaj -->
              <h3 class="text-lg font-semibold mb-3">Povezani sadržaj</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h4 class="font-semibold text-gray-800 mb-1">Povezani događaji</h4>
                  <ul class="text-sm space-y-1">
                    <li class="text-red-600 hover:underline cursor-pointer">
                      Festival narodnih plesova u Splitu
                    </li>
                    <li class="text-red-600 hover:underline cursor-pointer">
                      Smotra folklora u Zagrebu
                    </li>
                  </ul>
                </div>

                <div class="bg-gray-50 p-4 rounded-lg">
                  <h4 class="font-semibold text-gray-800 mb-1">Teme na forumu</h4>
                  <ul class="text-sm space-y-1">
                    <li class="text-red-600 hover:underline cursor-pointer">
                      Savjeti za učenje {{ item.name }}
                    </li>
                    <li class="text-red-600 hover:underline cursor-pointer">
                      Varijacije {{ item.name }} u različitim regijama
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading stanje -->
      <div v-else-if="loading" class="flex justify-center py-12">
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

      <!-- Error stanje -->
      <div v-else class="bg-white rounded-lg shadow p-6 text-center">
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
        <h2 class="text-2xl font-bold mb-2">Stavka nije pronađena</h2>
        <p class="text-gray-600 mb-4">
          Nažalost, traženi ples ili pjesma nije pronađen/a u našoj bazi podataka.
        </p>
        <router-link to="/katalog" class="btn btn-primary"> Povratak na katalog </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'KatalogDetailView',
  data() {
    return {
      item: null,
      loading: true,
      error: null,
      // Dummy podaci - kasnije ćemo ovo dohvaćati iz Firebasea
      itemsData: [
        {
          id: 'lindjo',
          name: 'Linđo',
          type: 'ples',
          region: 'dalmacija',
          regionName: 'Dubrovačko-neretvanska',
          description:
            'Linđo je tradicionalni narodni ples dubrovačkog područja, izvodi se uz zvuke lijerice. Plesače predvodi kolovođa koji glasno izvikuje naredbe. Ovaj ples je postao jedan od simbola dubrovačkog kraja i često se izvodi na raznim kulturnim manifestacijama. Karakteriziraju ga brzi i energični pokreti, te snažno udaranje nogama o pod (tzv. "kucanje").',
        },
        {
          id: 'kolo',
          name: 'Slavonsko kolo',
          type: 'ples',
          region: 'slavonija',
          regionName: 'Slavonija',
          description:
            'Slavonsko kolo je tradicionalni narodni ples Slavonije. Ples se izvodi u zatvorenom kolu, uz pjesmu ili tamburašku glazbu. Plesači se drže za ruke koje su spuštene, a kolo se kreće u smjeru suprotnom od kazaljke na satu. Slavonsko kolo je često u pratnji tamburice i karakteristično je po svom veselom i energičnom izrazu.',
        },
        {
          id: 'drmes',
          name: 'Drmeš',
          type: 'ples',
          region: 'srednisnja-hrvatska',
          regionName: 'Središnja Hrvatska',
          description:
            'Drmeš je narodni ples karakterističan za područje sjeverne i središnje Hrvatske. Dobio je ime po svojoj karakterističnoj strukturi u kojoj plesači "drmaju" tijelom gore-dolje. Taj karakteristični pokret "drmanja" daje plesu energičnost i živost. Drmeš se izvodi u parovima ili manjim skupinama, najčešće uz pratnju tamburaša.',
        },
        {
          id: 'balun',
          name: 'Balun',
          type: 'ples',
          region: 'istra-primorje',
          regionName: 'Istra',
          description:
            'Balun je tradicionalni istarski narodni ples. Karakterizira ga plesanje u parovima, koji se okreću u krug uz pratnju miha (istarske gajde) ili roženica. Ples se izvodi tako da plesači drže ruke visoko i okreću se, dok plesačice prate njihove pokrete manjih amplituda. Balun je najpoznatiji i najrašireniji istarski narodni ples.',
        },
        {
          id: 'ojkavica',
          name: 'Ojkavica',
          type: 'pjesma',
          region: 'lika-banovina',
          regionName: 'Lika',
          description:
            'Ojkavica je tradicijsko dvoglasno grleno pjevanje karakteristično za dinarsko područje. UNESCO ju je uvrstio na popis nematerijalne kulturne baštine. Karakterizira ju snažno potresanje glasa posebnom tehnikom pjevanja "iz grla". Ojkanje se obično izvodi tako da vodeći pjevač započinje pjesmu, a ostali se pridružuju.',
        },
        {
          id: 'becarac',
          name: 'Bećarac',
          type: 'pjesma',
          region: 'slavonija',
          regionName: 'Slavonija',
          description:
            'Bećarac je napjev koji se izvodi u Slavoniji, Baranji i Srijemu. Karakteriziraju ga deseterački dvostihovi vedrog i šaljivog sadržaja. UNESCO ga je uvrstio na popis nematerijalne kulturne baštine. Bećarac pjevaju obično muškarci uz pratnju tamburaša, a tekst često sadrži elemente humora, ljubavne tematike ili društvene kritike.',
        },
      ],
    }
  },
  mounted() {
    this.fetchItemDetails()
  },
  methods: {
    fetchItemDetails() {
      // Simulacija, kasnije će se korisiitit Firebase
      setTimeout(() => {
        const { type, id } = this.$route.params

        // Dummy podaci za početak
        const item = this.itemsData.find((item) => item.id === id && item.type === type)

        if (item) {
          this.item = item
        } else {
          this.error = 'Stavka nije pronađena'
        }

        this.loading = false
      }, 800) // Simulacija
    },
  },
  watch: {

    '$route.params': {
      handler() {
        this.loading = true
        this.fetchItemDetails()
      },
      deep: true,
    },
  },
}
</script>