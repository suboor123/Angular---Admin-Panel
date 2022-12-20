
export type ModalSize = 'sm' | 'md' | 'lg';

export type ModalButtonText = 'Save Changes' | 'Create'

export interface ModalConfig {
    heading: string;
    show: boolean;
    onClose: () => void;
    loader?: boolean;
    size?: ModalSize;
    buttonText?: ModalButtonText
}
