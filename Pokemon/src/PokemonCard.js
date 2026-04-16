const LIMIT = 12;
const API_URL = 'https://pokeapi.co/api/v2/pokemon';

const TYPE_THEME_MAP = {
  grass: {
    badge: 'bg-emerald-300 text-emerald-950',
    cardFrame:
      'border-emerald-700/35 bg-[linear-gradient(180deg,rgba(17,94,89,0.18),rgba(255,255,255,0.92)_22%,rgba(236,253,245,0.98)_100%)]',
    cardGlow: 'bg-emerald-300/28',
    cardLine: 'from-emerald-400 via-lime-300 to-emerald-200',
    imagePlate: 'bg-[linear-gradient(180deg,#f3fff6_0%,#dcfce7_100%)]',
    featureShell:
      'border-emerald-700/30 bg-[linear-gradient(135deg,rgba(236,253,245,0.98),rgba(209,250,229,0.92))]',
    featureHalo: 'bg-emerald-300/26',
    featureLine: 'from-emerald-500 via-lime-400 to-emerald-200',
  },
  fire: {
    badge: 'bg-orange-300 text-orange-950',
    cardFrame:
      'border-orange-700/35 bg-[linear-gradient(180deg,rgba(194,65,12,0.18),rgba(255,255,255,0.92)_22%,rgba(255,247,237,0.98)_100%)]',
    cardGlow: 'bg-orange-300/26',
    cardLine: 'from-orange-500 via-amber-300 to-yellow-200',
    imagePlate: 'bg-[linear-gradient(180deg,#fff8f1_0%,#ffedd5_100%)]',
    featureShell:
      'border-orange-700/30 bg-[linear-gradient(135deg,rgba(255,247,237,0.98),rgba(254,215,170,0.9))]',
    featureHalo: 'bg-orange-300/24',
    featureLine: 'from-orange-500 via-amber-300 to-yellow-200',
  },
  water: {
    badge: 'bg-sky-300 text-sky-950',
    cardFrame:
      'border-sky-700/35 bg-[linear-gradient(180deg,rgba(14,116,144,0.18),rgba(255,255,255,0.92)_22%,rgba(240,249,255,0.98)_100%)]',
    cardGlow: 'bg-sky-300/28',
    cardLine: 'from-sky-500 via-cyan-300 to-blue-200',
    imagePlate: 'bg-[linear-gradient(180deg,#f4fbff_0%,#e0f2fe_100%)]',
    featureShell:
      'border-sky-700/30 bg-[linear-gradient(135deg,rgba(240,249,255,0.98),rgba(186,230,253,0.92))]',
    featureHalo: 'bg-sky-300/25',
    featureLine: 'from-sky-500 via-cyan-300 to-blue-200',
  },
  electric: {
    badge: 'bg-yellow-300 text-yellow-950',
    cardFrame:
      'border-yellow-700/35 bg-[linear-gradient(180deg,rgba(202,138,4,0.18),rgba(255,255,255,0.92)_22%,rgba(254,252,232,0.98)_100%)]',
    cardGlow: 'bg-yellow-300/28',
    cardLine: 'from-yellow-500 via-amber-300 to-lime-200',
    imagePlate: 'bg-[linear-gradient(180deg,#fffef2_0%,#fef9c3_100%)]',
    featureShell:
      'border-yellow-700/30 bg-[linear-gradient(135deg,rgba(254,252,232,0.98),rgba(253,230,138,0.92))]',
    featureHalo: 'bg-yellow-300/24',
    featureLine: 'from-yellow-500 via-amber-300 to-lime-200',
  },
  bug: {
    badge: 'bg-lime-300 text-lime-950',
    cardFrame:
      'border-lime-700/35 bg-[linear-gradient(180deg,rgba(77,124,15,0.18),rgba(255,255,255,0.92)_22%,rgba(247,254,231,0.98)_100%)]',
    cardGlow: 'bg-lime-300/28',
    cardLine: 'from-lime-500 via-green-300 to-lime-200',
    imagePlate: 'bg-[linear-gradient(180deg,#fbfff4_0%,#ecfccb_100%)]',
    featureShell:
      'border-lime-700/30 bg-[linear-gradient(135deg,rgba(247,254,231,0.98),rgba(217,249,157,0.92))]',
    featureHalo: 'bg-lime-300/24',
    featureLine: 'from-lime-500 via-green-300 to-lime-200',
  },
  poison: {
    badge: 'bg-fuchsia-300 text-fuchsia-950',
    cardFrame:
      'border-fuchsia-700/35 bg-[linear-gradient(180deg,rgba(162,28,175,0.18),rgba(255,255,255,0.92)_22%,rgba(253,244,255,0.98)_100%)]',
    cardGlow: 'bg-fuchsia-300/28',
    cardLine: 'from-fuchsia-500 via-purple-300 to-pink-200',
    imagePlate: 'bg-[linear-gradient(180deg,#fff6ff_0%,#fae8ff_100%)]',
    featureShell:
      'border-fuchsia-700/30 bg-[linear-gradient(135deg,rgba(253,244,255,0.98),rgba(240,171,252,0.92))]',
    featureHalo: 'bg-fuchsia-300/24',
    featureLine: 'from-fuchsia-500 via-purple-300 to-pink-200',
  },
  normal: {
    badge: 'bg-zinc-300 text-zinc-950',
    cardFrame:
      'border-stone-700/30 bg-[linear-gradient(180deg,rgba(87,83,78,0.16),rgba(255,255,255,0.92)_22%,rgba(250,250,249,0.98)_100%)]',
    cardGlow: 'bg-stone-300/28',
    cardLine: 'from-stone-500 via-zinc-300 to-stone-200',
    imagePlate: 'bg-[linear-gradient(180deg,#ffffff_0%,#f5f5f4_100%)]',
    featureShell:
      'border-stone-700/25 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(231,229,228,0.9))]',
    featureHalo: 'bg-stone-300/22',
    featureLine: 'from-stone-500 via-zinc-300 to-stone-200',
  },
  ground: {
    badge: 'bg-amber-300 text-amber-950',
    cardFrame:
      'border-amber-700/35 bg-[linear-gradient(180deg,rgba(180,83,9,0.18),rgba(255,255,255,0.92)_22%,rgba(255,251,235,0.98)_100%)]',
    cardGlow: 'bg-amber-300/26',
    cardLine: 'from-amber-500 via-orange-300 to-yellow-200',
    imagePlate: 'bg-[linear-gradient(180deg,#fff9f1_0%,#fef3c7_100%)]',
    featureShell:
      'border-amber-700/30 bg-[linear-gradient(135deg,rgba(255,251,235,0.98),rgba(253,230,138,0.9))]',
    featureHalo: 'bg-amber-300/24',
    featureLine: 'from-amber-500 via-orange-300 to-yellow-200',
  },
  fairy: {
    badge: 'bg-pink-300 text-pink-950',
    cardFrame:
      'border-pink-700/35 bg-[linear-gradient(180deg,rgba(190,24,93,0.18),rgba(255,255,255,0.92)_22%,rgba(253,242,248,0.98)_100%)]',
    cardGlow: 'bg-pink-300/28',
    cardLine: 'from-pink-500 via-rose-300 to-fuchsia-200',
    imagePlate: 'bg-[linear-gradient(180deg,#fff7fb_0%,#fce7f3_100%)]',
    featureShell:
      'border-pink-700/30 bg-[linear-gradient(135deg,rgba(253,242,248,0.98),rgba(249,168,212,0.9))]',
    featureHalo: 'bg-pink-300/24',
    featureLine: 'from-pink-500 via-rose-300 to-fuchsia-200',
  },
  fighting: {
    badge: 'bg-rose-300 text-rose-950',
    cardFrame:
      'border-rose-700/35 bg-[linear-gradient(180deg,rgba(190,18,60,0.18),rgba(255,255,255,0.92)_22%,rgba(255,241,242,0.98)_100%)]',
    cardGlow: 'bg-rose-300/26',
    cardLine: 'from-rose-500 via-red-300 to-orange-200',
    imagePlate: 'bg-[linear-gradient(180deg,#fff6f6_0%,#ffe4e6_100%)]',
    featureShell:
      'border-rose-700/30 bg-[linear-gradient(135deg,rgba(255,241,242,0.98),rgba(253,164,175,0.9))]',
    featureHalo: 'bg-rose-300/24',
    featureLine: 'from-rose-500 via-red-300 to-orange-200',
  },
  psychic: {
    badge: 'bg-pink-300 text-pink-950',
    cardFrame:
      'border-pink-700/35 bg-[linear-gradient(180deg,rgba(219,39,119,0.18),rgba(255,255,255,0.92)_22%,rgba(253,242,248,0.98)_100%)]',
    cardGlow: 'bg-pink-300/28',
    cardLine: 'from-pink-500 via-fuchsia-300 to-purple-200',
    imagePlate: 'bg-[linear-gradient(180deg,#fff5fb_0%,#fce7f3_100%)]',
    featureShell:
      'border-pink-700/30 bg-[linear-gradient(135deg,rgba(253,242,248,0.98),rgba(249,168,212,0.9))]',
    featureHalo: 'bg-pink-300/24',
    featureLine: 'from-pink-500 via-fuchsia-300 to-purple-200',
  },
  rock: {
    badge: 'bg-violet-300 text-violet-950',
    cardFrame:
      'border-violet-700/35 bg-[linear-gradient(180deg,rgba(109,40,217,0.18),rgba(255,255,255,0.92)_22%,rgba(245,243,255,0.98)_100%)]',
    cardGlow: 'bg-violet-300/28',
    cardLine: 'from-violet-500 via-indigo-300 to-stone-200',
    imagePlate: 'bg-[linear-gradient(180deg,#faf7ff_0%,#ede9fe_100%)]',
    featureShell:
      'border-violet-700/30 bg-[linear-gradient(135deg,rgba(245,243,255,0.98),rgba(196,181,253,0.92))]',
    featureHalo: 'bg-violet-300/24',
    featureLine: 'from-violet-500 via-indigo-300 to-stone-200',
  },
  ghost: {
    badge: 'bg-indigo-300 text-indigo-950',
    cardFrame:
      'border-indigo-700/35 bg-[linear-gradient(180deg,rgba(67,56,202,0.18),rgba(255,255,255,0.92)_22%,rgba(238,242,255,0.98)_100%)]',
    cardGlow: 'bg-indigo-300/26',
    cardLine: 'from-indigo-500 via-violet-300 to-indigo-200',
    imagePlate: 'bg-[linear-gradient(180deg,#f6f8ff_0%,#e0e7ff_100%)]',
    featureShell:
      'border-indigo-700/30 bg-[linear-gradient(135deg,rgba(238,242,255,0.98),rgba(165,180,252,0.9))]',
    featureHalo: 'bg-indigo-300/24',
    featureLine: 'from-indigo-500 via-violet-300 to-indigo-200',
  },
  ice: {
    badge: 'bg-cyan-200 text-cyan-950',
    cardFrame:
      'border-cyan-700/35 bg-[linear-gradient(180deg,rgba(8,145,178,0.18),rgba(255,255,255,0.92)_22%,rgba(236,254,255,0.98)_100%)]',
    cardGlow: 'bg-cyan-200/28',
    cardLine: 'from-cyan-500 via-sky-300 to-cyan-100',
    imagePlate: 'bg-[linear-gradient(180deg,#f4feff_0%,#cffafe_100%)]',
    featureShell:
      'border-cyan-700/30 bg-[linear-gradient(135deg,rgba(236,254,255,0.98),rgba(165,243,252,0.9))]',
    featureHalo: 'bg-cyan-200/24',
    featureLine: 'from-cyan-500 via-sky-300 to-cyan-100',
  },
  dragon: {
    badge: 'bg-indigo-500 text-white',
    cardFrame:
      'border-indigo-800/40 bg-[linear-gradient(180deg,rgba(67,56,202,0.22),rgba(255,255,255,0.92)_22%,rgba(238,242,255,0.98)_100%)]',
    cardGlow: 'bg-indigo-400/26',
    cardLine: 'from-indigo-600 via-violet-400 to-blue-200',
    imagePlate: 'bg-[linear-gradient(180deg,#f5f6ff_0%,#e0e7ff_100%)]',
    featureShell:
      'border-indigo-800/35 bg-[linear-gradient(135deg,rgba(238,242,255,0.98),rgba(165,180,252,0.9))]',
    featureHalo: 'bg-indigo-400/24',
    featureLine: 'from-indigo-600 via-violet-400 to-blue-200',
  },
  default: {
    badge: 'bg-stone-300 text-stone-950',
    cardFrame:
      'border-stone-700/30 bg-[linear-gradient(180deg,rgba(87,83,78,0.16),rgba(255,255,255,0.92)_22%,rgba(250,250,249,0.98)_100%)]',
    cardGlow: 'bg-stone-300/24',
    cardLine: 'from-stone-500 via-zinc-300 to-stone-200',
    imagePlate: 'bg-[linear-gradient(180deg,#ffffff_0%,#f5f5f4_100%)]',
    featureShell:
      'border-stone-700/25 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(231,229,228,0.9))]',
    featureHalo: 'bg-stone-300/22',
    featureLine: 'from-stone-500 via-zinc-300 to-stone-200',
  },
};

function getPrimaryType(pokemon) {
  return pokemon.types?.[0]?.type?.name ?? 'default';
}

function getTheme(typeName) {
  return TYPE_THEME_MAP[typeName] ?? TYPE_THEME_MAP.default;
}

function formatName(name) {
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function getPokemonImage(pokemon) {
  return (
    pokemon.sprites?.other?.['official-artwork']?.front_default ||
    pokemon.sprites?.front_default ||
    ''
  );
}

function renderPokemonImage(pokemon, className) {
  const image = getPokemonImage(pokemon);

  if (!image) {
    return `
      <div class="${className} flex items-center justify-center rounded-full border border-dashed border-stone-300 bg-white/70 font-sans text-xs font-extrabold uppercase tracking-[0.24em] text-stone-500">
        No Image
      </div>
    `;
  }

  return `
    <img
      class="${className}"
      src="${image}"
      alt="${formatName(pokemon.name)}"
      loading="lazy"
    />
  `;
}

function renderTypeBadge(typeName) {
  const theme = getTheme(typeName);

  return `
    <span class="rounded-full px-3 py-1 text-[0.7rem] font-extrabold uppercase tracking-[0.16em] ${theme.badge}">
      ${typeName}
    </span>
  `;
}

function createStatMarkup(label, value) {
  return `
    <div class="rounded-2xl border border-stone-200/80 bg-white/78 px-3 py-3 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
      <p class="font-sans text-[0.62rem] font-extrabold uppercase tracking-[0.24em] text-stone-500">
        ${label}
      </p>
      <p class="mt-1 font-sans text-lg font-black text-stone-800">
        ${value}
      </p>
    </div>
  `;
}

function createPokemonMarkup(pokemon, index) {
  const theme = getTheme(getPrimaryType(pokemon));
  const animationDelay = 90 * (index + 1);

  return `
    <article
      class="group relative isolate overflow-hidden rounded-[2rem] border p-[1px] shadow-[0_24px_44px_rgba(58,26,12,0.12)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_28px_56px_rgba(58,26,12,0.18)] animate-card-rise ${theme.cardFrame}"
      style="animation-delay:${animationDelay}ms"
    >
      <div class="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
        <div class="absolute -left-10 top-0 h-full w-24 -skew-x-12 bg-white/35 blur-xl transition duration-700 group-hover:translate-x-[18rem]"></div>
      </div>
      <div class="relative h-full rounded-[calc(2rem-1px)] bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.94))] p-5">
        <div class="absolute inset-x-5 top-0 h-1 rounded-full bg-gradient-to-r ${theme.cardLine}"></div>
        <div class="relative flex items-center justify-between">
          <span class="font-sans text-[0.68rem] font-extrabold uppercase tracking-[0.26em] text-stone-500">
            Dex #${String(pokemon.id).padStart(3, '0')}
          </span>
          <span class="rounded-full border border-white/80 bg-white/80 px-2.5 py-1 font-sans text-[0.58rem] font-extrabold uppercase tracking-[0.2em] text-stone-500 shadow-[0_8px_16px_rgba(58,26,12,0.08)]">
            Basic
          </span>
        </div>

        <div class="relative mt-4 rounded-[1.65rem] border border-white/80 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] ${theme.imagePlate}">
          <div class="absolute inset-x-8 top-6 h-24 rounded-full ${theme.cardGlow} blur-3xl"></div>
          <div class="absolute inset-0 rounded-[1.65rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0))]"></div>
          ${renderPokemonImage(
            pokemon,
            'relative z-10 mx-auto h-40 w-40 object-contain drop-shadow-[0_20px_22px_rgba(17,24,39,0.18)] transition duration-300 group-hover:scale-[1.04]'
          )}
        </div>

        <div class="mt-5 flex items-start justify-between gap-3">
          <div>
            <h3 class="font-serif text-[2rem] font-black capitalize leading-[0.9] tracking-[-0.05em] text-stone-950">
              ${formatName(pokemon.name)}
            </h3>
            <p class="mt-1 font-sans text-[0.72rem] font-bold uppercase tracking-[0.24em] text-stone-500">
              Trading Entry
            </p>
          </div>
          <div class="rounded-full border border-stone-200 bg-white/80 px-3 py-1 text-right shadow-[0_8px_18px_rgba(58,26,12,0.08)]">
            <p class="font-sans text-[0.55rem] font-extrabold uppercase tracking-[0.22em] text-stone-400">
              XP
            </p>
            <p class="font-sans text-sm font-black text-stone-800">
              ${pokemon.base_experience ?? '--'}
            </p>
          </div>
        </div>

        <div class="mt-4 flex flex-wrap gap-2">
          ${pokemon.types.map(({ type }) => renderTypeBadge(type.name)).join('')}
        </div>

        <div class="mt-5 grid grid-cols-3 gap-3 border-t border-stone-200/80 pt-4">
          ${createStatMarkup('Height', `${pokemon.height / 10} m`)}
          ${createStatMarkup('Weight', `${pokemon.weight / 10} kg`)}
          ${createStatMarkup('HP', pokemon.stats?.[0]?.base_stat ?? '--')}
        </div>
      </div>
    </article>
  `;
}

function renderLoadingState(container) {
  container.innerHTML = `
    <div class="grid gap-5">
      <div class="h-24 animate-pulse rounded-[2rem] border border-white/45 bg-white/60 shadow-[0_18px_40px_rgba(58,26,12,0.10)] backdrop-blur-xl"></div>
      <div class="h-[28rem] animate-pulse rounded-[2.25rem] border border-white/45 bg-white/60 shadow-[0_28px_80px_rgba(58,26,12,0.14)] backdrop-blur-xl"></div>
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        ${Array.from({ length: 6 })
          .map(
            () => `
              <div class="h-[29rem] animate-pulse rounded-[2rem] border border-white/45 bg-white/60 shadow-[0_18px_40px_rgba(58,26,12,0.10)] backdrop-blur-xl"></div>
            `
          )
          .join('')}
      </div>
    </div>
  `;
}

async function fetchPokemonPage(offset) {
  const response = await fetch(`${API_URL}?limit=${LIMIT}&offset=${offset}`);

  if (!response.ok) {
    throw new Error(`Error HTTP ${response.status}`);
  }

  const data = await response.json();
  const pokemonDetails = await Promise.all(
    data.results.map(async ({ url }) => {
      const detailResponse = await fetch(url);

      if (!detailResponse.ok) {
        throw new Error(`Error HTTP ${detailResponse.status}`);
      }

      return detailResponse.json();
    })
  );

  return {
    count: data.count,
    next: data.next,
    previous: data.previous,
    pokemonDetails,
  };
}

export async function PokemonCard(container) {
  let offset = 0;
  let isLoading = false;

  async function loadPage(shouldScroll = false) {
    if (isLoading) {
      return;
    }

    isLoading = true;
    renderLoadingState(container);

    try {
      const { count, next, previous, pokemonDetails } = await fetchPokemonPage(offset);

      if (!pokemonDetails.length) {
        throw new Error('No pokemon found for current page');
      }

      const [featuredPokemon, ...pokemonList] = pokemonDetails;
      const currentPage = Math.floor(offset / LIMIT) + 1;
      const totalPages = Math.ceil(count / LIMIT);
      const startIndex = offset + 1;
      const endIndex = offset + pokemonDetails.length;
      const featuredTheme = getTheme(getPrimaryType(featuredPokemon));

      container.innerHTML = `
        <section class="grid gap-5">
          <div class="flex flex-col gap-4 rounded-[2rem] border border-white/45 bg-white/70 px-5 py-4 shadow-[0_18px_40px_rgba(58,26,12,0.10)] backdrop-blur-xl md:flex-row md:items-center md:justify-between">
            <div>
              <p class="font-sans text-[0.68rem] font-extrabold uppercase tracking-[0.26em] text-stone-500">
                Navigation
              </p>
              <div class="mt-2 flex flex-wrap items-center gap-3">
                <span class="rounded-full bg-stone-950 px-4 py-2 font-sans text-xs font-extrabold uppercase tracking-[0.2em] text-amber-50">
                  Page ${currentPage} of ${totalPages}
                </span>
                <span class="font-sans text-sm font-semibold text-stone-600">
                  Showing ${startIndex} - ${endIndex} of ${count}
                </span>
              </div>
            </div>
            <div class="flex flex-wrap gap-3">
              <button
                id="back-button"
                class="rounded-full border border-stone-300 bg-white px-5 py-3 font-sans text-sm font-extrabold uppercase tracking-[0.22em] text-stone-800 shadow-[0_10px_24px_rgba(58,26,12,0.08)] transition duration-300 hover:-translate-y-1 hover:border-stone-500 hover:bg-stone-100 disabled:cursor-not-allowed disabled:border-stone-200 disabled:bg-stone-200 disabled:text-stone-400"
                ${previous ? '' : 'disabled'}
              >
                Back
              </button>
              <button
                id="next-button"
                class="rounded-full bg-stone-950 px-6 py-3 font-sans text-sm font-extrabold uppercase tracking-[0.22em] text-amber-50 shadow-[0_16px_35px_rgba(35,24,21,0.22)] transition duration-300 hover:-translate-y-1 hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-stone-400"
                ${next ? '' : 'disabled'}
              >
                Next
              </button>
            </div>
          </div>

          <article class="group relative isolate overflow-hidden rounded-[2.4rem] border p-[1px] shadow-[0_28px_80px_rgba(58,26,12,0.18)] ${featuredTheme.featureShell}">
            <div class="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
              <div class="absolute -left-12 top-0 h-full w-28 -skew-x-12 bg-white/30 blur-xl transition duration-700 group-hover:translate-x-[36rem]"></div>
            </div>
            <div class="relative rounded-[calc(2.4rem-1px)] bg-[linear-gradient(180deg,rgba(255,255,255,0.7),rgba(255,255,255,0.88))] p-6 md:grid md:grid-cols-[minmax(0,1.02fr)_minmax(280px,0.98fr)] md:items-center md:gap-8 md:p-10">
              <div class="absolute inset-x-6 top-0 h-1.5 rounded-full bg-gradient-to-r ${featuredTheme.featureLine}"></div>
              <div class="relative">
                <p class="font-sans text-xs font-extrabold uppercase tracking-[0.34em] text-stone-600">
                  Featured Card
                </p>
                <h3 class="mt-2 font-serif text-5xl font-black capitalize leading-[0.84] tracking-[-0.06em] text-stone-950 md:text-7xl">
                  ${formatName(featuredPokemon.name)}
                </h3>
                <p class="mt-4 max-w-xl font-sans text-base leading-7 text-stone-600">
                  Official artwork, type profile and core stats in a collector-style layout.
                </p>
                <div class="mt-5 flex flex-wrap gap-2">
                  ${featuredPokemon.types.map(({ type }) => renderTypeBadge(type.name)).join('')}
                </div>
                <div class="mt-6 grid gap-3 sm:grid-cols-3">
                  ${createStatMarkup('Dex', `#${String(featuredPokemon.id).padStart(3, '0')}`)}
                  ${createStatMarkup('Height', `${featuredPokemon.height / 10} m`)}
                  ${createStatMarkup('Weight', `${featuredPokemon.weight / 10} kg`)}
                </div>
              </div>
              <div class="relative mt-8 min-h-72 md:mt-0">
                <div class="absolute inset-x-[12%] top-[18%] h-40 rounded-full ${featuredTheme.featureHalo} blur-3xl"></div>
                <div class="relative rounded-[2rem] border border-white/80 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] ${featuredTheme.imagePlate}">
                  ${renderPokemonImage(
                    featuredPokemon,
                    'relative z-10 mx-auto h-72 w-full max-w-sm object-contain animate-float-art drop-shadow-[0_32px_40px_rgba(84,36,18,0.22)]'
                  )}
                </div>
              </div>
            </div>
          </article>

          <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            ${pokemonList.map((pokemon, index) => createPokemonMarkup(pokemon, index)).join('')}
          </section>
        </section>
      `;

      if (shouldScroll) {
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      const backButton = container.querySelector('#back-button');
      const nextButton = container.querySelector('#next-button');

      if (backButton && previous) {
        backButton.addEventListener('click', () => {
          offset = Math.max(0, offset - LIMIT);
          loadPage(true);
        });
      }

      if (nextButton && next) {
        nextButton.addEventListener('click', () => {
          offset += LIMIT;
          loadPage(true);
        });
      }
    } catch (error) {
      console.error('Error fetching pokemon data:', error);
      container.innerHTML = `
        <div class="grid gap-4">
          <p class="rounded-[2rem] border border-red-200 bg-red-50/90 px-6 py-10 text-center font-sans text-base font-bold text-red-800 shadow-[0_18px_50px_rgba(58,26,12,0.08)]">
            No se pudieron cargar los pokemones desde PokeAPI.
          </p>
          <div class="flex justify-center">
            <button
              id="retry-button"
              class="rounded-full bg-stone-950 px-6 py-3 font-sans text-sm font-extrabold uppercase tracking-[0.22em] text-amber-50 shadow-[0_16px_35px_rgba(35,24,21,0.22)] transition duration-300 hover:-translate-y-1 hover:bg-red-800"
            >
              Retry
            </button>
          </div>
        </div>
      `;

      const retryButton = container.querySelector('#retry-button');
      if (retryButton) {
        retryButton.addEventListener('click', () => {
          loadPage();
        });
      }
    } finally {
      isLoading = false;
    }
  }

  await loadPage();
}
