export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full w-full mt-10">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
    </div>
  );
}
