import * as React from 'react';
import { useModal } from '@faceless-ui/modal';
import { Drawer } from '../../../../elements/Drawer';
import Pill from '../../../../elements/Pill';

import './index.scss';
import { Dropzone } from '../../../../elements/Dropzone';

const baseClass = 'bulk-uploads';
const modalSlug = 'bulk-uploads';

export const BulkUploads: React.FC = () => {
  const { openModal } = useModal();

  const onDrop = React.useCallback((e: FileList) => {
    console.log(e);
  }, []);

  return (
    <div className={baseClass}>
      <Pill onClick={() => openModal(modalSlug)}>
        Bulk Upload
      </Pill>

      <Drawer
        slug={modalSlug}
        title="Add Files"
      >
        <Dropzone onChange={onDrop} />
      </Drawer>
    </div>
  );
};
