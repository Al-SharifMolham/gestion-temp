export default function Loader() {
    return (
        <div className="flex items-center justify-center min-h-[200px]">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-[3px] border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                <span className="text-xs text-gray-400 font-medium">Loading...</span>
            </div>
        </div>
    );
}
