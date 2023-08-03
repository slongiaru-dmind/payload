import * as React from 'react';
import { useModal } from '@faceless-ui/modal';
import { Drawer } from '../../../../elements/Drawer';
import Pill from '../../../../elements/Pill';

import './index.scss';

const baseClass = 'bulk-uploads';
const modalSlug = 'bulk-uploads';

export const BulkUploads: React.FC = () => {
  const { openModal } = useModal();

  return (
    <div className={baseClass}>
      <Pill onClick={() => openModal(modalSlug)}>
        Bulk Upload
      </Pill>

      <Drawer
        slug={modalSlug}
        title="Add Files"
      >
        <h1>Bulk Upload</h1>
      </Drawer>
    </div>
  );
};
