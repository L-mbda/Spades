export default function Spades() {
  return (
    <div className="text-white bg-gradient-to-br from-blue-600 via-blue-850 to-blue-950 h-screen w-screen flex flex-col gap-4 items-center justify-center">
      <h1 className="text-6xl font-black font-[Mulish]">Spares</h1>
      <p className="text-xl font-['DM Sans'] w-[30%] text-center">
        A card tracker for the spades game.
      </p>
      <button className="bg-emerald-700 hover:bg-emerald-800 transition-colors text-white font-bold font-[Mulish] py-2 px-4 rounded-full text-lg">
        Start Game
      </button>
    </div>
  );
}
