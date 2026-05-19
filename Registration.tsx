import { useState } from 'react';
import { motion } from 'motion/react';
import { Sprout, ChevronRight, Check } from 'lucide-react';

interface RegistrationProps {
  onComplete: (data: any) => void;
}

export default function Registration({ onComplete }: RegistrationProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    language: 'Kannada',
    primaryCrop: 'Paddy',
    location: ''
  });

  const languages = ['English', 'Kannada'];
  const crops = ['Paddy', 'Sugarcane', 'Ragi', 'Maize', 'Cotton', 'Tobacco'];

  const nextStep = () => setStep(s => s + 1);

  return (
    <div className="min-h-screen bg-[#F5F5F0] flex flex-col items-center justify-center p-6">
      <motion.div 
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="max-w-md w-full bg-white rounded-[32px] p-8 shadow-xl border border-[#DEDECB]"
      >
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-1">
            {[1, 2, 3].map(i => (
              <div 
                key={i} 
                className={`h-1 w-8 rounded-full transition-all ${i <= step ? 'bg-[#5A5A40]' : 'bg-[#DEDECB]'}`} 
              />
            ))}
          </div>
          <span className="text-xs font-bold text-[#8E9299] uppercase tracking-wider">Step {step} of 3</span>
        </div>

        {step === 1 && (
          <div>
            <h2 className="font-serif text-2xl font-bold mb-2">Welcome, Farmer</h2>
            <p className="text-[#8E9299] mb-8">Let's set up your profile to give you accurate sowing advice.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5A5A40] mb-2">Your Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-[#F5F5F0] border-none rounded-2xl p-4 focus:ring-2 focus:ring-[#5A5A40] transition-all outline-none"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5A5A40] mb-2">Your Location</label>
                <input 
                  type="text" 
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                  className="w-full bg-[#F5F5F0] border-none rounded-2xl p-4 focus:ring-2 focus:ring-[#5A5A40] transition-all outline-none"
                  placeholder="e.g. Mandya, Karnataka"
                />
              </div>
            </div>
            
            <button 
              disabled={!formData.name || !formData.location}
              onClick={nextStep}
              className="w-full mt-8 bg-[#5A5A40] text-white py-4 rounded-2xl flex items-center justify-center gap-2 font-medium disabled:opacity-50 transition-all hover:bg-[#4A4A35]"
            >
              Next <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="font-serif text-2xl font-bold mb-2">Choose Language</h2>
            <p className="text-[#8E9299] mb-8">Select your preferred language for the app interface.</p>
            
            <div className="grid grid-cols-1 gap-4">
              {languages.map(lang => (
                <button
                  key={lang}
                  onClick={() => setFormData({...formData, language: lang})}
                  className={`p-6 rounded-[24px] border-2 transition-all flex justify-between items-center ${
                    formData.language === lang ? 'border-[#5A5A40] bg-[#F5F5F0]' : 'border-[#DEDECB] bg-white'
                  }`}
                >
                  <span className="font-bold text-lg">{lang}</span>
                  {formData.language === lang && <Check className="w-6 h-6 text-[#5A5A40]" />}
                </button>
              ))}
            </div>
            
            <button 
              onClick={nextStep}
              className="w-full mt-8 bg-[#5A5A40] text-white py-4 rounded-2xl flex items-center justify-center gap-2 font-medium transition-all hover:bg-[#4A4A35]"
            >
              Next <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="font-serif text-2xl font-bold mb-2">Select Primary Crop</h2>
            <p className="text-[#8E9299] mb-8">What are you planning to grow this season?</p>
            
            <div className="grid grid-cols-2 gap-3 mb-8">
              {crops.map(crop => (
                <button
                  key={crop}
                  onClick={() => setFormData({...formData, primaryCrop: crop})}
                  className={`p-4 rounded-2xl border-2 transition-all text-sm font-bold ${
                    formData.primaryCrop === crop ? 'border-[#5A5A40] bg-[#F5F5F0] text-[#5A5A40]' : 'border-[#DEDECB] bg-white text-[#8E9299]'
                  }`}
                >
                  {crop}
                </button>
              ))}
            </div>
            
            <button 
              onClick={() => onComplete(formData)}
              className="w-full bg-[#5A5A40] text-white py-4 rounded-2xl flex items-center justify-center gap-2 font-medium transition-all hover:bg-[#4A4A35] shadow-lg"
            >
              Finish Setup <Check className="w-5 h-5" />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
