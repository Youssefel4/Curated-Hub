import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UploadResult {
    url: string;
    error: Error | null;
}

export const useImageUpload = () => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const uploadImage = async (
        file: File,
        folder: "posts" | "avatars"
    ): Promise<UploadResult> => {
        setUploading(true);
        setProgress(0);

        try {
            // Validate file type
            const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
            if (!validTypes.includes(file.type)) {
                throw new Error("نوع الملف غير مدعوم. يرجى استخدام JPG, PNG, GIF أو WebP");
            }

            // Validate file size (max 5MB)
            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                throw new Error("حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت");
            }

            // Generate unique filename
            const fileExt = file.name.split(".").pop();
            const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

            setProgress(30);

            // Upload to Supabase Storage
            const { data, error } = await supabase.storage
                .from("images")
                .upload(fileName, file, {
                    cacheControl: "3600",
                    upsert: false,
                });

            if (error) {
                throw error;
            }

            setProgress(80);

            // Get public URL
            const { data: urlData } = supabase.storage
                .from("images")
                .getPublicUrl(fileName);

            setProgress(100);

            return { url: urlData.publicUrl, error: null };
        } catch (error) {
            return { url: "", error: error as Error };
        } finally {
            setUploading(false);
        }
    };

    const deleteImage = async (url: string): Promise<{ error: Error | null }> => {
        try {
            // Extract path from URL
            const urlObj = new URL(url);
            const pathParts = urlObj.pathname.split("/storage/v1/object/public/images/");
            if (pathParts.length < 2) {
                throw new Error("Invalid image URL");
            }

            const filePath = pathParts[1];

            const { error } = await supabase.storage.from("images").remove([filePath]);

            if (error) throw error;

            return { error: null };
        } catch (error) {
            return { error: error as Error };
        }
    };

    return { uploadImage, deleteImage, uploading, progress };
};
