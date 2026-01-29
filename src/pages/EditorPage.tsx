import { useParams } from 'react-router-dom';
import EditorLayout from '@/components/editor/EditorLayout';
import { ThemeProvider } from '@/contexts';

export default function EditorPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <ThemeProvider>
      <div className="h-screen overflow-hidden">
        <EditorLayout micrositeId={id || 'new'} />
      </div>
    </ThemeProvider>
  );
}
