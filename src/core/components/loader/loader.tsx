export default function Loader() {
  return (
    <div className="w-[100%] h-[70vh] flex justify-center items-center">
      <div
        className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-yellow-400 border-e-transparent align-[-0.125em] text-warning motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status"
      ></div>
    </div>
  );
}
