const HeroSearch = () => {
  return (
    <section className="bg-[#0b0c10] text-white px-8 py-16">
      <div className="max-w-7xl mx-auto rounded-3xl border border-zinc-800 bg-[#111216] p-10">
        <p className="text-xs tracking-[0.3em] text-zinc-500">
          BOOK YOUR STAY
        </p>

        <h1 className="text-5xl font-serif mt-4">
          Find your next{" "}
          <span className="text-[#d4af37]">
            luxury stay
          </span>
        </h1>

        <p className="text-zinc-400 text-lg mt-4 mb-8">
          Search hotels, rooms, and best stays.
        </p>

        <div className="bg-[#0b0c10] border border-zinc-800 p-2 rounded-2xl grid md:grid-cols-4 gap-2">
          <input
            placeholder="Where are you going?"
            className="bg-[#111216] border border-zinc-800 p-4 rounded-xl text-white outline-none focus:border-[#d4af37]"
          />

          <input
            type="date"
            className="bg-[#111216] border border-zinc-800 p-4 rounded-xl text-white outline-none focus:border-[#d4af37]"
          />

          <input
            type="date"
            className="bg-[#111216] border border-zinc-800 p-4 rounded-xl text-white outline-none focus:border-[#d4af37]"
          />

          <button className="bg-[#d4af37] text-black rounded-xl font-bold hover:bg-yellow-400 transition">
            Search
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSearch;