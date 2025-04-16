import Link from 'next/link';
import { ContextDebugger } from '@/components/ui/ContextDebugger';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-3xl w-full space-y-10 text-center">
        <h1 className="text-4xl md:text-6xl font-bold">
          Welcome to <span className="text-primary">PetFood</span>
        </h1>
        
        <p className="text-lg md:text-xl">
          Find the perfect food recommendations for your dog based on their breed, age, 
          and specific needs.
        </p>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-lg shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-semibold mb-6">
            Tell us about your dog
          </h2>
          
          <div className="text-center">
            <Link 
              href="/create-profile" 
              className="btn-primary inline-block px-8 py-3 rounded-lg bg-primary hover:bg-primaryGreenDark text-white font-medium transition-colors"
            >
              Create Dog Profile
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
          <div className="bg-white/5 p-4 rounded-lg">
            <h3 className="text-xl font-medium mb-2">Personalized</h3>
            <p>Recommendations tailored to your dog's unique needs</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-lg">
            <h3 className="text-xl font-medium mb-2">Expert-Backed</h3>
            <p>Nutritional advice based on veterinary science</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-lg">
            <h3 className="text-xl font-medium mb-2">Simple</h3>
            <p>Easy-to-follow recommendations in minutes</p>
          </div>
        </div>
        
        {/* Context Debugger - REMOVE IN PRODUCTION */}
        <ContextDebugger />
      </div>
    </main>
  );
} 