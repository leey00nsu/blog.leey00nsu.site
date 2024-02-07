'use client';

import { Button } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useShallow } from 'zustand/react/shallow';

import { savePostLocal, savePostRemote } from '@/src/actions/studio/savePost';

import getFrontmatter from '@/src/libs/getFrontmatter';

import useModal from '@/src/hooks/modal/useModal';

import useEditorStore, { Frontmatter } from '@/src/store/editorStore';
import useFileStore from '@/src/store/fileStore';

import LogoutButton from '../auth/LogoutButton';

const SaveOption = () => {
  const { addModal } = useModal();
  const { source, slug, title, tags, description, date } = useEditorStore(
    useShallow((state) => ({
      source: state.source,
      slug: state.slug,
      title: state.title,
      tags: state.tags,
      description: state.description,
      date: state.date,
    })),
  );
  const files = useFileStore((state) => state.files);
  const [isSavable, setIsSavable] = useState(false);

  const toastResponse = (response: { success: boolean; message: string }) => {
    if (response.success) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  };

  const saveHandler = async (type: string) => {
    const frontmatter = getFrontmatter({
      slug,
      title,
      tags,
      description,
      date,
    });
    const content = `${frontmatter}\n${source}`;

    const formData = new FormData();
    formData.append('slug', slug);
    formData.append('content', content);

    files.forEach((file) => {
      formData.append('files', file);
    });

    if (type === 'local') {
      addModal({
        type: 'confirm',
        title: '파일로 저장',
        content: <p>파일로 저장할까요?</p>,
        callback: async () => {
          const response = await savePostLocal(formData);
          toastResponse(response);
        },
      });
    }
    if (type === 'remote') {
      addModal({
        type: 'confirm',
        title: '업로드',
        content: <p>업로드할까요?</p>,
        callback: async () => {
          const response = await savePostRemote(formData);
          toastResponse(response);
        },
      });
    }
  };

  useEffect(() => {
    const validation = Frontmatter.safeParse({
      slug,
      title,
      tags,
      description,
      date,
      files,
    });

    setIsSavable(validation.success);
  }, [slug, title, tags, description, date, files]);

  return (
    <div className="flex flex-row justify-end gap-2 p-4">
      {/* <Button
        color="primary"
        variant="flat"
        onClick={() => saveHandler('local')}
      >
        파일로 저장
      </Button> */}
      <LogoutButton />
      <Button
        color={isSavable ? 'primary' : 'default'}
        variant="flat"
        onClick={() => saveHandler('remote')}
        disabled={!isSavable}
      >
        업로드
      </Button>
    </div>
  );
};

export default SaveOption;