import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDocumentInfo } from '../../../../utilities/DocumentInfo';
import useField from '../../../../forms/useField';
import Button from '../../../../elements/Button';
import FileDetails from '../../../../elements/FileDetails';
import Error from '../../../../forms/Error';
import { Props } from './types';
import reduceFieldsToValues from '../../../../forms/Form/reduceFieldsToValues';
import Label from '../../../../forms/Label';
import { Dropzone } from '../../../../elements/Dropzone';

import './index.scss';

const baseClass = 'file-field';

const validate = (value) => {
  if (!value && value !== undefined) {
    return 'A file is required.';
  }

  return true;
};

const Upload: React.FC<Props> = (props) => {
  const {
    collection,
    internalState,
  } = props;

  const [replacingFile, setReplacingFile] = useState(false);
  const { t } = useTranslation(['upload', 'general']);
  const [doc, setDoc] = useState(reduceFieldsToValues(internalState || {}, true));
  const { docPermissions } = useDocumentInfo();

  const {
    value,
    setValue,
    showError,
    errorMessage,
  } = useField<{ name: string }>({
    path: 'file',
    validate,
  });

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedFileName = e.target.value;
    if (value) {
      const fileValue = value as File;
      // Creating a new File object with updated properties
      const newFile = new File([fileValue], updatedFileName, { type: fileValue.type });
      setValue(newFile); // Updating the state with the new File object
    }
  };

  const handleDropzoneDrop = React.useCallback((files: FileList) => {
    const fileObject = files?.[0];
    if (fileObject) setValue(fileObject);
  }, [setValue]);

  const handleFileRemoval = useCallback(() => {
    setReplacingFile(true);
    setValue(null);
  }, [setValue]);

  useEffect(() => {
    setDoc(reduceFieldsToValues(internalState || {}, true));
    setReplacingFile(false);
  }, [internalState]);

  const classes = [
    baseClass,
    'field-type',
  ].filter(Boolean).join(' ');

  const canRemoveUpload = docPermissions?.update?.permission && 'delete' in docPermissions && docPermissions?.delete?.permission;

  return (
    <div className={classes}>
      <Error
        showError={showError}
        message={errorMessage}
      />

      {(doc.filename && !replacingFile) && (
        <FileDetails
          doc={doc}
          collection={collection}
          handleRemove={canRemoveUpload ? handleFileRemoval : undefined}
        />
      )}

      {(!doc.filename || replacingFile) && (
        <div className={`${baseClass}__upload`}>
          {value && (
            <div className={`${baseClass}__file-selected`}>
              <Label
                label={t('fileName')}
                required
              />

              <div className={`${baseClass}__file-upload`}>
                <input
                  type="text"
                  className={`${baseClass}__filename`}
                  value={value.name}
                  onChange={handleFileNameChange}
                />

                <Button
                  icon="x"
                  buttonStyle="none"
                  tooltip={t('general:cancel')}
                  onClick={() => {
                    setValue(null);
                  }}
                />
              </div>
            </div>
          )}

          {!value && (
            <React.Fragment>
              <Dropzone
                onChange={handleDropzoneDrop}
                className={`${baseClass}__dropzone`}
                mimeTypes={collection?.upload?.mimeTypes}
              />
            </React.Fragment>
          )}
        </div>
      )}
    </div>
  );
};

export default Upload;
