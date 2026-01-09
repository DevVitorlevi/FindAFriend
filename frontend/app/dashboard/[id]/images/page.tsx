import { UploadPetImagesSection } from "@/components/pages/UploadPetImages";

export default async function UploadPetImages({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <UploadPetImagesSection petId={id} />;
}