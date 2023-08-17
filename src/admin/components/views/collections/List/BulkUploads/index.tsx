import * as React from 'react';
import { useModal } from '@faceless-ui/modal';
import Pill from '../../../../elements/Pill';
import { AddFilesDrawer } from './AddFilesDrawer';
import { ManageFilesDrawer, manageFilesDrawerSlug } from './ManageFilesDrawer';

import './index.scss';

const baseClass = 'bulk-uploads';

const bulkAddFilesSlug = 'bulk-add-files';
export const BulkUploads: React.FC = () => {
  const { openModal } = useModal();
  const [files, setFiles] = React.useState<FileList | null>(null);

  const onDrop = React.useCallback((droppedFiles: FileList) => {
    // TODO: determine how to store all forms/files in state
    setFiles(droppedFiles);
    openModal(manageFilesDrawerSlug);
  }, [openModal]);

  return (
    <div className={baseClass}>
      <Pill onClick={() => openModal(bulkAddFilesSlug)}>
        Bulk Upload
      </Pill>

      {files && <ManageFilesDrawer initialFiles={files} />}

      <AddFilesDrawer
        onDrop={onDrop}
        slug={bulkAddFilesSlug}
      />
    </div>
  );
};
