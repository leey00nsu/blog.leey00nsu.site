import { Input } from '@nextui-org/react';
import React from 'react';
import { useShallow } from 'zustand/react/shallow';

import useEditorStore, { Frontmatter } from '@/src/store/editorStore';

const TagsInput = () => {
  const { tags, setTags } = useEditorStore(
    useShallow((state) => ({
      tags: state.tags,
      setTags: state.setTags,
    })),
  );

  const tagsValidation = Frontmatter.pick({ tags: true }).safeParse({ tags });

  const changeTagsHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTags(e.target.value);
  };

  return (
    <Input
      isRequired
      type="text"
      label="태그"
      value={tags}
      onChange={changeTagsHandler}
      color="primary"
      isInvalid={!tagsValidation.success}
      errorMessage={
        !tagsValidation.success && tagsValidation.error.issues[0].message
      }
    />
  );
};

export default TagsInput;
