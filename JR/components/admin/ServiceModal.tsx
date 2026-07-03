"use client";
import { useState } from "react";
// Nếu file actions.ts nằm ở app/admin/actions.ts
import { addService, updateService } from "@/app/admin/services/actions";
//import { createClient } from "@/lib/supabase/client"; //dung client-side
export default function ServiceModal({
  typeId,
  service,
}: {
  typeId: number;
  service?: any;
}) {
  const [isOpen, setIsOpen] = useState(false);
  //const [file, setFile] = useState<File | null>(null);

  //ham xu ly upload anh va luu vao db
  //   const handleSubmit = async (formData: FormData) => {
  //     let imageUrl = service?.image_url;

  //     // Nếu có chọn file mới, upload lên Supabase Storage
  //     if (file) {
  //       const supabase = createClient();
  //       const fileName = `${Date.now()}_${file.name}`;
  //       /// Upload ảnh lên bucket 'service-images'
  //       await supabase.storage.from("service-images").upload(fileName, file);
  //       //lay public URL
  //       const { data } = supabase.storage
  //         .from("service-images")
  //         .getPublicUrl(fileName);
  //       imageUrl = data.publicUrl;
  //     }

  //     //dua link anh vao formData de Server Action nhan duoc
  //     formData.set("image_url", imageUrl || "");

  //     if (service) {
  //       await updateService(service.id, formData);
  //     } else {
  //       await addService(formData);
  //     }
  //     setIsOpen(false);
  //   };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={
          service ? "text-blue-600" : "bg-green-600 text-white p-2 rounded"
        }
      >
        {service ? "Sửa" : "+ THÊM DỊCH VỤ"}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <form
            action={async (formData) => {
              service
                ? await updateService(service.id, formData)
                : await addService(formData);
              setIsOpen(false);
            }}
            className="bg-white p-6 rounded shadow-lg w-96 space-y-3"
          >
            <input
              name="name"
              defaultValue={service?.name}
              placeholder="Tên dịch vụ"
              className="border p-2 w-full"
              required
            />
            <input
              name="price"
              defaultValue={service?.price}
              placeholder="Giá"
              type="number"
              className="border p-2 w-full"
              required
            />
            <textarea
              name="description"
              defaultValue={service?.description}
              placeholder="Mô tả"
              className="border p-2 w-full"
            />
            <input
              name="duration"
              defaultValue={service?.duration}
              placeholder="Thời gian"
              className="border p-2 w-full"
            />

            <input type="hidden" name="category_id" value={typeId} />

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="bg-gray-300 p-2"
              >
                Hủy
              </button>
              <button type="submit" className="bg-blue-600 text-white p-2">
                Lưu
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
