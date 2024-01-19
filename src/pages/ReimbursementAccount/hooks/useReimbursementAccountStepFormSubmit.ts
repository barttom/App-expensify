import {useCallback} from 'react';
import type {SubStepProps} from '@hooks/useSubStep/types';
import * as FormActions from '@userActions/FormActions';
import type {OnyxFormKeyWithoutDraft} from '@userActions/FormActions';
import type {FormValues} from '@src/types/onyx/Form';

type UseReimbursementAccountStepFormSubmitParams = Pick<SubStepProps, 'isEditing' | 'onNext'> & {
    formId: OnyxFormKeyWithoutDraft;
    fieldIds: Array<keyof FormValues>;
};

export default function useReimbursementAccountStepFormSubmit({isEditing, onNext, formId, fieldIds}: UseReimbursementAccountStepFormSubmitParams) {
    return useCallback(
        (values: FormValues) => {
            if (isEditing) {
                const stepValues = fieldIds.reduce(
                    (acc, key) => ({
                        ...acc,
                        [key]: values[key],
                    }),
                    {},
                );

                FormActions.setDraftValues(formId, stepValues);
            }

            onNext();
        },
        [isEditing, onNext, formId, fieldIds],
    );
}
