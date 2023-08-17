import React from 'react';
import { AddFilesDrawer } from '../AddFilesDrawer';
import { Drawer } from '../../../../../elements/Drawer';
import { FilePreview } from './FilePreview';

import './index.scss';

export const manageFilesDrawerSlug = 'manage-files-drawer';
const addFilesDrawerSlug = 'manage-files-add-more-drawer';
const baseClass = 'manage-files-drawer';
type Props = {
  initialFiles: FileList;
}
export const ManageFilesDrawer: React.FC<Props> = ({ initialFiles }) => {
  const [files, setFiles] = React.useState<FileList>(initialFiles);

  const onDrop = React.useCallback((droppedFiles: FileList) => {
    setFiles(droppedFiles);
  }, []);

  return (
    <Drawer
      slug={manageFilesDrawerSlug}
      className={baseClass}
      header={false}
      closeAreaSize="small"
    >
      <div className={`${baseClass}__file-list`}>
        {Array.from(files).map((file, fileIndex) => (
          <FilePreview
            key={`${file.name}-${fileIndex}`}
            file={file}
          />
        ))}
      </div>

      <div className={`${baseClass}__edit-area`}>
        <div className={`${baseClass}__main`}>
          <p>breadcrumbs</p>
        </div>

        <div className={`${baseClass}__sidebar-wrapper`}>
          <div className={`${baseClass}__sidebar`}>
            <h1>Actions</h1>
          </div>
        </div>
      </div>

      <AddFilesDrawer
        onDrop={onDrop}
        slug={addFilesDrawerSlug}
      />
    </Drawer>
  );
};
