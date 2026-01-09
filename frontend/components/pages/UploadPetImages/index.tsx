'use client';

import { Button } from '@/components/ui/button';
import { uploadPetImages } from '@/services/pets';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface UploadPetImagesSectionProps {
  petId: string;
}

export function UploadPetImagesSection({ petId }: UploadPetImagesSectionProps) {
  const router = useRouter();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const validFiles = Array.from(files).filter(file => {
      const isImage = file.type.startsWith('image/');
      const isValidType = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type);
      return isImage && isValidType;
    });

    if (validFiles.length === 0) {
      alert('Por favor, selecione apenas arquivos de imagem (PNG, JPG, JPEG, WEBP)');
      return;
    }

    setSelectedFiles(prev => [...prev, ...validFiles]);

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert('Selecione pelo menos uma imagem');
      return;
    }

    setUploading(true);

    try {
      await uploadPetImages({
        petId,
        images: selectedFiles
      });

      toast.success("Imagens Enviadas!!");
      router.push('/dashboard');
    } catch (error) {
      console.error('Erro ao enviar imagens:', error);
      toast.error('Erro ao enviar imagens. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="text-[#0D3B66] hover:text-[#0D3B66]/80"
          >
            ← Voltar
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-[#0D3B66] mb-2">Adicionar Imagens</h1>
          <p className="text-slate-600 mb-8">Faça upload das fotos do pet</p>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${isDragging
              ? 'border-[#E44449] bg-red-50'
              : 'border-slate-300 bg-slate-50 hover:border-slate-400'
              }`}
          >
            <div className="space-y-4">
              <div className="text-6xl">📁</div>
              <div>
                <p className="text-lg font-medium text-[#0D3B66]">
                  Arraste as imagens aqui
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  ou clique para selecionar
                </p>
              </div>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                multiple
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input">
                <Button
                  type="button"
                  className="bg-transparent hover:bg-amber-300 text-blue-700 cursor-pointer mb-4"
                  asChild
                >
                  <span>Selecionar Arquivos</span>
                </Button>
              </label>
              <p className="text-xs text-slate-500">
                Formatos aceitos: PNG, JPG, JPEG, WEBP
              </p>
            </div>
          </div>

          {previews.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-[#0D3B66] mb-4">
                Imagens Selecionadas ({previews.length})
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {previews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg border-2 border-slate-200"
                    />
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute top-2 right-2 bg-[#E44449] text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#E44449]/90"
                    >
                      ×
                    </button>
                    <p className="text-xs text-slate-600 mt-1 truncate">
                      {selectedFiles[index].name}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 mt-8">
                <Button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="flex-1 bg-[#0D3B66] hover:bg-[#0D3B66]/90 text-white disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    'Enviar Imagens'
                  )}
                </Button>
                <Button
                  onClick={() => {
                    setSelectedFiles([]);
                    setPreviews([]);
                  }}
                  variant="outline"
                  className="border-slate-300 text-slate-700 hover:bg-slate-100"
                >
                  Limpar Tudo
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}