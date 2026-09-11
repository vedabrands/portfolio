export default function AmbientGlow() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* Blob 1: Primary Warm Amber/Gold light leaking in from top-left */}
      <div
        className="absolute -top-32 -left-32 w-[500px] sm:w-[650px] lg:w-[800px] h-[500px] sm:h-[650px] lg:h-[800px] rounded-full opacity-[0.12] blur-[100px] sm:blur-[130px] animate-drift-1"
        style={{
          background:
            "radial-gradient(circle, rgba(217, 164, 65, 0.85) 0%, rgba(217, 164, 65, 0.2) 50%, transparent 70%)",
        }}
      />

      {/* Blob 2: Secondary Cool Contrast (Deep Indigo/Blue) drifting on right */}
      <div
        className="absolute top-1/3 -right-36 w-[450px] sm:w-[600px] lg:w-[750px] h-[450px] sm:h-[600px] lg:h-[750px] rounded-full opacity-[0.09] blur-[110px] sm:blur-[140px] animate-drift-2"
        style={{
          background:
            "radial-gradient(circle, rgba(99, 102, 241, 0.7) 0%, rgba(59, 130, 246, 0.2) 50%, transparent 70%)",
        }}
      />

      {/* Blob 3: Tertiary Soft Warm Light drifting near bottom */}
      <div
        className="absolute -bottom-24 left-1/4 w-[400px] sm:w-[550px] lg:w-[700px] h-[400px] sm:h-[550px] lg:h-[700px] rounded-full opacity-[0.07] blur-[100px] sm:blur-[130px] animate-drift-3"
        style={{
          background:
            "radial-gradient(circle, rgba(245, 158, 11, 0.7) 0%, rgba(217, 119, 6, 0.15) 50%, transparent 70%)",
        }}
      />
    </div>
  );
}
