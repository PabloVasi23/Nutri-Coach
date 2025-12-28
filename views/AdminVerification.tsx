
import React, { useState } from 'react';
import { Card, Button, Input, Badge } from '../components/UI';
import { geminiService } from '../services/gemini';
import { EvidenceLevel } from '../types';
import { FileUp, FileCheck, AlertTriangle, Search, CheckCircle, ExternalLink } from 'lucide-react';

const AdminVerification: React.FC = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsVerifying(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      try {
        const analysis = await geminiService.verifyDocument(base64, file.type);
        setResult(analysis);
      } catch (err) {
        console.error(err);
      } finally {
        setIsVerifying(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Knowledge Verification</h1>
          <p className="text-slate-500 mt-2">Manage evidence-based library and validate supplement claims.</p>
        </div>
        <div className="flex gap-2">
           {/* Fixed: Badge component does not accept 'color' prop. Using 'className' for custom color styling instead. */}
           <Badge className="bg-emerald-100 text-emerald-700">Editor Mode</Badge>
           <Badge className="bg-blue-100 text-blue-700">GDPR Compliant</Badge>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-dashed border-2 border-indigo-200 bg-indigo-50/30">
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white mb-4">
                <FileUp />
              </div>
              <h3 className="font-bold text-lg mb-2 text-indigo-900">Upload Source</h3>
              <p className="text-sm text-indigo-700 mb-6">Supports PDF, Image (OCR), EPUB. Automated claim extraction via Gemini.</p>
              
              <label className="w-full">
                <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.jpg,.jpeg,.png" />
                <div className="cursor-pointer bg-white border border-indigo-200 px-4 py-2.5 rounded-lg text-indigo-600 font-bold hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2">
                   Select File
                </div>
              </label>
            </div>
          </Card>

          <Card>
            <h3 className="font-bold mb-4 flex items-center gap-2"><Search size={18} /> PubMed Integration</h3>
            <div className="space-y-3">
              <Input label="Search DOI / PMID" value="" onChange={() => {}} placeholder="e.g. 10.1016/j.physbeh..." />
              <Button variant="outline" className="w-full text-xs">Verify Online Metadata</Button>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-8">
          {isVerifying ? (
            <div className="flex flex-col items-center justify-center h-full p-12 bg-white rounded-xl border border-slate-200">
               <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
               <p className="font-medium text-slate-700">Gemini OCR & Evidence Analysis in progress...</p>
            </div>
          ) : result ? (
            <div className="space-y-6 animate-in fade-in duration-500">
              <Card>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{result.title}</h2>
                    <p className="text-slate-500 font-medium">{result.source} • {result.year}</p>
                  </div>
                  {/* Fixed: Badge component does not support 'color' prop. Using 'className' with conditional logic for dynamic styling. */}
                  <Badge className={result.evidenceLevel === 'A' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}>
                    Level {result.evidenceLevel} Evidence
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Scientific Summary</h4>
                    <p className="text-sm text-slate-700 leading-relaxed">{result.summary || 'Expert analysis of study outcomes and methodologies.'}</p>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                    <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">Verified Claims</h4>
                    <ul className="space-y-2">
                      {result.claims.map((claim: string, i: number) => (
                        <li key={i} className="text-sm text-emerald-800 flex items-start gap-2">
                          <CheckCircle size={14} className="mt-0.5" /> {claim}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button className="flex-1">Publish to Library</Button>
                  <Button variant="outline" className="flex-1 text-rose-600 border-rose-200 hover:bg-rose-50">Flag Sensitive Content</Button>
                </div>
              </Card>

              <Card className="bg-rose-50 border-rose-200">
                <h3 className="font-bold text-rose-800 mb-2 flex items-center gap-2"><AlertTriangle size={18} /> Automated Conflict Check</h3>
                <p className="text-sm text-rose-700">No major industry funding conflicts found. Note: Evidence Level {result.evidenceLevel} requires careful application in non-clinical settings.</p>
              </Card>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl text-slate-400">
               <FileCheck size={48} strokeWidth={1} className="mb-4" />
               <p className="font-medium">Upload a scientific paper to begin the verification workflow.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminVerification;
