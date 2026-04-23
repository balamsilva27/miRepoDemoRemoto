import './style.css';
import { PokemonCard } from './PokemonCard.js';

document.querySelector('#app').innerHTML = `
  <div class="relative min-h-screen overflow-x-clip bg-[linear-gradient(180deg,#691913_0%,#9f2f24_24%,#f4ead1_24.1%,#fbf5e4_100%)] text-stone-950">
    <section class="relative px-6 pb-18 pt-8 text-amber-50 md:px-10 lg:px-14">
      <div class="mx-auto w-full max-w-6xl">
        <header class="animate-rise-in max-w-3xl py-12 md:min-h-[72vh] md:py-20">
          <p class="mb-3 font-sans text-xs font-extrabold uppercase tracking-[0.34em] text-amber-100/90">
            PokeAPI Live Roster
          </p>
          <h1 class="max-w-4xl font-serif text-[3.5rem] font-black uppercase leading-[0.86] tracking-[-0.08em] text-balance md:text-[5.5rem] lg:text-[7rem]">
            Pokemon Card
          </h1>
          <p class="mt-5 max-w-2xl font-sans text-base leading-7 text-amber-50/80 md:text-lg">
            Una pokedex visual con Tailwind, detalles animados y datos reales consumidos
            desde PokeAPI.
          </p>
          <div class="mt-8 flex flex-wrap gap-3 font-sans text-sm font-semibold text-stone-900">
            <span class="rounded-full bg-amber-200 px-4 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.14)]">
              Arte oficial
            </span>
            <span class="rounded-full bg-white/90 px-4 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.14)]">
              Tipos y stats base
            </span>
            <span class="rounded-full bg-red-200 px-4 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.14)]">
              Tailwind CSS
            </span>
          </div>
        </header>
      </div>
    </section>

    <main class="relative z-10 -mt-16 px-6 pb-18 md:px-10 lg:px-14">
      <div class="mx-auto grid w-full max-w-6xl gap-7">
        <section id="pokemon-container" aria-live="polite">
          <p class="rounded-4xl border border-white/40 bg-white/60 px-6 py-10 text-center font-sans text-base font-bold text-stone-700 shadow-[0_18px_50px_rgba(58,26,12,0.08)] backdrop-blur-md">
            Cargando pokemones...
          </p>
        </section>
      </div>
    </main>
  </div>
`;

PokemonCard(document.querySelector('#pokemon-container'));
