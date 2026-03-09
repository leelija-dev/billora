export default function SectionTitle({ title }) {
  return (
    <h2 className="text-[42px] font-bold text-[#1a237e] mb-4 relative inline-block animate-[fadeInDown_0.8s_ease-out]
    after:content-[''] after:absolute after:bottom-[-12px] after:left-1/2 after:-translate-x-1/2
    after:w-[100px] after:h-1 after:bg-gradient-to-r after:from-[#3b82f6] after:via-[#8b5cf6] after:to-[#10b981]
    after:rounded-[2px] max-md:text-3xl max-sm:text-2xl">
      {title}
    </h2>
  );
}