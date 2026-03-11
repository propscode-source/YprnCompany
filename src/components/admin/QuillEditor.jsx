import { useRef, useEffect, useCallback } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

/**
 * QuillEditor — Reusable Quill v2 rich text editor wrapper untuk React.
 * Menampilkan editor WYSIWYG dengan dark theme styling.
 *
 * @param {string}   value       - HTML content saat ini
 * @param {function} onChange    - Callback saat konten berubah (menerima HTML string)
 * @param {string}   placeholder - Placeholder text
 */
const QuillEditor = ({ value, onChange, placeholder = "Tulis sesuatu..." }) => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const isInternalChange = useRef(false);

  // Stabilkan onChange agar tidak trigger re-init saat parent re-render
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Inisialisasi Quill editor sekali saat mount
  useEffect(() => {
    if (!editorRef.current || quillRef.current) return;

    const quill = new Quill(editorRef.current, {
      theme: "snow",
      placeholder,
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          ["link", "blockquote"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["clean"],
        ],
      },
    });

    // Set initial value jika ada
    if (value) {
      quill.root.innerHTML = value;
    }

    // Listen perubahan konten editor
    quill.on("text-change", () => {
      isInternalChange.current = true;
      const html = quill.root.innerHTML;
      // Quill menghasilkan <p><br></p> saat kosong, normalisasi ke string kosong
      const cleanHtml = html === "<p><br></p>" ? "" : html;
      onChangeRef.current?.(cleanHtml);
    });

    quillRef.current = quill;

    // Cleanup saat unmount
    return () => {
      quillRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync value dari parent ke editor (hanya jika bukan dari internal change)
  const syncValue = useCallback((newValue) => {
    if (!quillRef.current) return;

    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }

    const currentHtml = quillRef.current.root.innerHTML;
    const normalizedCurrent =
      currentHtml === "<p><br></p>" ? "" : currentHtml;

    if (newValue !== normalizedCurrent) {
      quillRef.current.root.innerHTML = newValue || "";
    }
  }, []);

  useEffect(() => {
    syncValue(value);
  }, [value, syncValue]);

  return (
    <div className="quill-dark-wrapper">
      <div ref={editorRef} />
    </div>
  );
};

export default QuillEditor;
