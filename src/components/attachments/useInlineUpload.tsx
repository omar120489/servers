import { useRef } from 'react';
import { uploadAttachment } from '../../services/attachments';

export function useInlineUpload(
  entity: 'contacts' | 'companies' | 'deals' | 'activities',
  onDone?: () => void
) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const open = () => inputRef.current?.click();

  const Input = ({ entityId }: { entityId: number }) => (
    <input
      ref={inputRef}
      hidden
      type="file"
      onChange={async (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        try {
          await uploadAttachment(entity, entityId, f);
          onDone && onDone();
        } catch {
        }
        e.currentTarget.value = '';
      }}
    />
  );

  return { open, Input };
}



