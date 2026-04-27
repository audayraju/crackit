import StealthWidget from "../../components/StealthWidget";

export const metadata = {
  title: "CrackAI Stealth Mode",
};

export default function StealthPage() {
  return (
    <div className="min-h-screen bg-transparent">
      {/* Transparent background - can be used as overlay */}
      <StealthWidget />
      
      {/* Instructions - hidden in real use, drag widget to corner */}
      <div className="fixed bottom-4 left-4 text-white/30 text-xs max-w-xs">
        <p>💡 Drag the widget anywhere. Minimize to hide.</p>
        <p className="mt-1">Press voice button to capture interview audio.</p>
      </div>
    </div>
  );
}
