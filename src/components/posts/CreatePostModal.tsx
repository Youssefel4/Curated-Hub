import { useState } from "react";
import { X, Image, Send, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import InterestBadge from "@/components/interests/InterestBadge";
import { useAuth } from "@/contexts/AuthContext";
import { useImageUpload } from "@/hooks/useImageUpload";
import { toast } from "sonner";

interface Interest {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string, interestId: string, imageUrl?: string) => void;
  interests?: Interest[];
  defaultInterestId?: string;
}

const CreatePostModal = ({ isOpen, onClose, onSubmit, interests = [], defaultInterestId }: CreatePostModalProps) => {
  const [content, setContent] = useState("");
  const [selectedInterest, setSelectedInterest] = useState<string>(defaultInterestId || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const { user } = useAuth();
  const { uploadImage, uploading } = useImageUpload();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("نوع الملف غير مدعوم. يرجى استخدام JPG, PNG, GIF أو WebP");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت");
      return;
    }

    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    setUploadedImageUrl("");
  };

  const handleSubmit = async () => {
    if (!content.trim() || !selectedInterest) {
      toast.error("يرجى كتابة محتوى واختيار اهتمام");
      return;
    }

    let finalImageUrl = uploadedImageUrl;

    // Upload image if selected and not yet uploaded
    if (imageFile && !uploadedImageUrl) {
      const result = await uploadImage(imageFile, "posts");
      if (result.error) {
        toast.error(result.error.message);
        return;
      }
      finalImageUrl = result.url;
    }

    onSubmit(content, selectedInterest, finalImageUrl);

    // Reset form
    setContent("");
    setSelectedInterest(defaultInterestId || "");
    setImageFile(null);
    setImagePreview("");
    setUploadedImageUrl("");
    onClose();
  };

  const handleClose = () => {
    setContent("");
    setSelectedInterest(defaultInterestId || "");
    setImageFile(null);
    setImagePreview("");
    setUploadedImageUrl("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-card rounded-2xl shadow-hover animate-slide-up max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card z-10">
          <h2 className="text-xl font-bold text-foreground">منشور جديد</h2>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Author */}
          {user && (
            <div className="flex items-center gap-3">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
                alt="صورتك"
                className="w-12 h-12 rounded-full border-2 border-border"
              />
              <div>
                <h3 className="font-bold text-foreground">{user.email?.split("@")[0]}</h3>
                <p className="text-sm text-muted-foreground">يكتب منشوراً...</p>
              </div>
            </div>
          )}

          {/* Textarea */}
          <textarea
            placeholder="شارك أفكارك مع المجتمع..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-32 p-4 rounded-xl bg-secondary/30 border border-border/50 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          />

          {/* Image Preview */}
          {imagePreview && (
            <div className="relative rounded-xl overflow-hidden border border-border">
              <img
                src={imagePreview}
                alt="معاينة الصورة"
                className="w-full h-auto max-h-64 object-cover"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-2 bg-destructive/90 hover:bg-destructive rounded-full transition-colors"
              >
                <Trash2 className="w-4 h-4 text-destructive-foreground" />
              </button>
            </div>
          )}

          {/* Interest Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              اختر الاهتمام المناسب
            </label>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => (
                <InterestBadge
                  key={interest.id}
                  interest={interest}
                  isSelected={selectedInterest === interest.id}
                  onClick={() => setSelectedInterest(interest.id)}
                  size="sm"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-5 border-t border-border sticky bottom-0 bg-card">
          <div>
            <input
              type="file"
              id="post-image-upload"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleImageSelect}
              className="hidden"
            />
            <label htmlFor="post-image-upload">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                asChild
                disabled={uploading}
              >
                <span className="cursor-pointer">
                  <Image className="w-4 h-4" />
                  إضافة صورة
                </span>
              </Button>
            </label>
          </div>
          <Button
            variant="accent-gradient"
            onClick={handleSubmit}
            disabled={!content.trim() || !selectedInterest || uploading}
            className="gap-2"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                جاري الرفع...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                نشر
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;

