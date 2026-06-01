'use client';

import { useState, useRef } from 'react';
import { Upload, Sparkles, ArrowRight } from 'lucide-react';
import pdf from 'pdf-parse';

export default function Home() {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [resumeText, setResumeText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
  e.preventDefault();
  setIsDragging(false);

  const files = e.dataTransfer.files;

  if (files.length > 0) {
    setFileName(files[0].name);
    setSelectedFile(files[0]);
    setShowResults(false);
  }
};

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;

  if (files && files.length > 0) {
    setFileName(files[0].name);
    setSelectedFile(files[0]);
    setShowResults(false);

    extractTextFromPDF(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const extractTextFromPDF = async (file: File) => {
    console.log("PDF received:", file.name);
  };

  return (
    <main className="relative min-h-screen bg-background overflow-hidden">
      {/* Ambient gradient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-accent/30 via-transparent to-transparent rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-primary/20 via-transparent to-transparent rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl opacity-20"></div>
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.2_0_0)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.2_0_0)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.02] pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl mx-auto text-center space-y-8">
          {/* Top badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">AI-Powered Career Intelligence</span>
          </div>

          {/* Main heading */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-pretty">
              <span className="block text-foreground">Your Career, Redefined</span>
              <span className="block bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent leading-tight">by AI</span>
            </h1>
            <p className="text-lg sm:text-xl text-foreground/70 text-pretty max-w-xl mx-auto leading-relaxed">
              Upload your resume and unlock AI-powered insights designed to transform your career path. Get personalized guidance to stand out to top employers.
            </p>
          </div>

          {/* Upload section */}
          <div className="pt-4 space-y-6">
            <div
              onClick={handleClick}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`group relative p-8 sm:p-10 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer ${
                isDragging
                  ? 'border-primary/60 bg-primary/10'
                  : 'border-primary/20 bg-primary/5 hover:border-primary/40 hover:bg-primary/8'
              }`}
            >
              {/* Animated gradient border effect on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-1"></div>

              <div className="relative space-y-3">
                <div className="flex justify-center">
                  <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Upload className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <p className="text-foreground font-semibold">
                    {fileName ? `📄 ${fileName}` : 'Drag your resume here'}
                  </p>
                  <p className="text-sm text-foreground/60 mt-1">
                    {fileName ? 'Ready to analyze' : 'or click to browse'}
                  </p>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx"
                className="hidden"
                aria-label="Upload resume"
              />
            </div>

            {/* CTA Button */}
            <button   disabled={!fileName}
            onClick={() => {
            setIsAnalyzing(true)

            const formData = new FormData();

            if (selectedFile) {
              formData.append("resume", selectedFile);

              fetch("/api/parse-resume", {
                method: "POST",
                body: formData,
              })
                .then((response) => response.json())
                .then((data) => {
                  console.log(data);

                  setIsAnalyzing(false);
                  setShowResults(true);
                });
            }
          }} className="w-full sm:w-auto px-8 py-4 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group">
              <span>Analyze My Resume</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>

            {isAnalyzing && (
            <div className="mt-6 text-center text-blue-400">
              Analyzing Resume...
            </div>
            )}

            <p className="text-gray-400 mb-4">
            Resume: {fileName}
            </p>

            {showResults && (
            <div className="mt-8 p-6 rounded-xl bg-zinc-900 border border-zinc-800">
              <h2 className="text-2xl font-bold mb-4">
                Resume Score: 78/100
              </h2>

              <p>✓ Strong Projects</p>
              <p>✓ Good Technical Skills</p>

              <p className="mt-4">
                Missing Skills: System Design, Cloud Deployment
              </p>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">
                  Score Breakdown
                </h3>

                <div className="space-y-2 text-gray-300">
                  <p>Projects: 9/10</p>
                  <p>Skills: 8/10</p>
                  <p>Education: 8/10</p>
                  <p>Achievements: 6/10</p>
                  <p>Formatting: 8/10</p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">
                  Recommended Next Steps
                </h3>

                <div className="space-y-2 text-gray-300">
                  <p>→ Learn System Design fundamentals</p>
                  <p>→ Build one cloud-based project</p>
                  <p>→ Add quantified achievements</p>
                  <p>→ Improve resume summary section</p>
                </div>
              </div>
            </div>
          )}

            {/* Support text */}
            <p className="text-xs sm:text-sm text-foreground/50">
              Supported formats: PDF, DOC, DOCX • Free to analyze • 100% private
            </p>
          </div>

          {/* Bottom accent line */}
          <div className="pt-4">
            <div className="h-px w-20 mx-auto bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Floating elements for extra visual interest */}
      <div className="absolute top-20 right-10 w-2 h-2 rounded-full bg-primary/40 blur-sm animate-pulse"></div>
      <div className="absolute bottom-32 left-10 w-2 h-2 rounded-full bg-accent/40 blur-sm animate-pulse delay-1000"></div>
      <div className="absolute top-1/3 right-1/4 w-1 h-1 rounded-full bg-primary/20 blur-sm"></div>


      <section className="max-w-6xl mx-auto px-6 py-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-blue-500 transition-all duration-300">
          <h3 className="text-xl font-semibold mb-3 text-white">
            Resume Analysis
          </h3>
          <p className="text-zinc-400">
            Get AI-powered feedback on your resume structure, clarity, and impact.
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-blue-500 transition-all duration-300">
          <h3 className="text-xl font-semibold mb-3 text-white">
            Recruiter Insights
          </h3>
          <p className="text-zinc-400">
            Understand what recruiters actually look for in candidates and resumes.
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-blue-500 transition-all duration-300">
          <h3 className="text-xl font-semibold mb-3 text-white">
            Skill Gap Detection
          </h3>
          <p className="text-zinc-400">
            Identify missing skills and improve your industry readiness step-by-step.
          </p>
        </div>

        </div>
      </section>



    </main>
  );
}

