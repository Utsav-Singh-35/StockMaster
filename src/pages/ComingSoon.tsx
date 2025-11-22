import DashboardLayout from '../components/DashboardLayout';
import { Construction } from 'lucide-react';

interface ComingSoonProps {
  title: string;
}

export default function ComingSoon({ title }: ComingSoonProps) {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Construction size={64} className="mx-auto text-[#FF8C00] mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
          <p className="text-gray-400">This feature is coming soon!</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
