import React, { useState, useEffect } from 'react';
import './CreateIntegrationModal.scss';
import { validateIntegrationForm, ValidationErrors, hasErrors, toValidationData } from './validation/validationIntegration';
import { CreateIntegrationRequest } from '../../../../types/integrations';
import { useToast } from '../../../../widgets/toast/ToastProvider';
import { createIntegration } from '../../../../api/Integrations/apiCreateIntegration';

interface CreateIntegrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateIntegrationRequest) => void;
    projectId: string;
}

const CreateIntegrationModal: React.FC<CreateIntegrationModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    projectId
}) => {
    const { showToast } = useToast();

    const [formData, setFormData] = useState<CreateIntegrationRequest>({
        name: '',
        subdomain: '',
        access_token: '',
        client_id: '',
        client_secret: '',
        new_lead_pipeline_id: 0,
        existing_lead_pipeline_id: 0,
        responsible_user_id: 0,
        telegram_field_id: 0,
        // Все поля с дефолтными значениями
        is_active: true, // Важно: активируем сразу
        auto_sync_enabled: true,
        sync_hour: 3,
        telegram_field_name: 'telegram',
        create_telegram_field: false,
    });

    const [errors, setErrors] = useState<ValidationErrors>({});
    const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({
        access_token: false,
        client_secret: false
    });

    // Сброс формы при открытии
    useEffect(() => {
        if (isOpen) {
            setFormData({
                name: '',
                subdomain: '',
                access_token: '',
                client_id: '',
                client_secret: '',
                new_lead_pipeline_id: 0,
                existing_lead_pipeline_id: 0,
                responsible_user_id: 0,
                telegram_field_id: 0,
                // Все дефолтные значения при сбросе
                is_active: true,
                auto_sync_enabled: true,
                sync_hour: 3,
                telegram_field_name: 'telegram',
                create_telegram_field: false,
            });
            setErrors({});
            setTouchedFields(new Set());
            setShowSecrets({ access_token: false, client_secret: false });
        }
    }, [isOpen]);

    const validateField = (name: string, value: string | number | boolean | undefined): string | null => {
        if (value === undefined) {
            return null;
        }

        const updatedData = { ...formData, [name]: value };
        const validationData = toValidationData(updatedData);
        const fieldErrors = validateIntegrationForm(validationData);
        return fieldErrors[name as keyof ValidationErrors] || null;
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value, type, checked } = e.target;

        let processedValue: string | number | boolean = value;

        if (type === 'number') {
            processedValue = value === '' ? 0 : parseInt(value, 10);
        } else if (type === 'checkbox') {
            processedValue = checked;
        }

        setFormData(prev => ({
            ...prev,
            [name]: processedValue,
        }));

        if (!touchedFields.has(name)) {
            setTouchedFields(prev => new Set(prev).add(name));
        }

        const fieldError = validateField(name, processedValue);
        setErrors(prev => ({
            ...prev,
            [name]: fieldError,
        }));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name } = e.target;

        if (!touchedFields.has(name)) {
            setTouchedFields(prev => new Set(prev).add(name));
        }

        const fieldError = validateField(name, formData[name as keyof CreateIntegrationRequest]);
        setErrors(prev => ({
            ...prev,
            [name]: fieldError,
        }));
    };

    const toggleSecretVisibility = (field: string) => {
        setShowSecrets(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const validateForm = (): boolean => {
        const allFields: (keyof CreateIntegrationRequest)[] = [
            'name', 'subdomain', 'access_token', 'client_id', 'client_secret',
            'new_lead_pipeline_id', 'existing_lead_pipeline_id', 'responsible_user_id',
            'telegram_field_id'
        ];
        setTouchedFields(new Set(allFields as string[]));

        const validationData = toValidationData(formData);
        const newErrors = validateIntegrationForm(validationData);
        setErrors(newErrors);

        return !hasErrors(newErrors);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            showToast('Пожалуйста, заполните все обязательные поля корректно', 'error', 4000);
            return;
        }

        setIsSubmitting(true);

        try {
            // Отправляем все данные со всеми дефолтными значениями
            const response = await createIntegration(formData, projectId);
            console.log('Интеграция успешно создана и активирована:', response);

            showToast('Интеграция успешно создана и активирована!', 'success', 4000);
            onSubmit(formData);
            handleClose();
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message, 'error', 5000);
            } else {
                showToast('Ошибка при создании интеграции. Пожалуйста, попробуйте снова.', 'error', 4000);
            }
            console.error('Ошибка при создании интеграции:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setFormData({
                name: '',
                subdomain: '',
                access_token: '',
                client_id: '',
                client_secret: '',
                new_lead_pipeline_id: 0,
                existing_lead_pipeline_id: 0,
                responsible_user_id: 0,
                telegram_field_id: 0,
                is_active: true,
                auto_sync_enabled: true,
                sync_hour: 3,
                telegram_field_name: 'telegram',
                create_telegram_field: false,
            });
            setErrors({});
            setTouchedFields(new Set());
            setShowSecrets({ access_token: false, client_secret: false });
            onClose();
        }
    };

    const shouldShowError = (fieldName: string): boolean => {
        return touchedFields.has(fieldName) && !!errors[fieldName as keyof ValidationErrors];
    };

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal__overlay" onClick={handleClose} />

            <div className="modal__content modal__content--wide">
                <div className="modal__header">
                    <h2 className="modal__title">Создать интеграцию с AmoCRM</h2>
                    <button
                        className="modal__close"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        aria-label="Закрыть"
                    >
                        ×
                    </button>
                </div>

                <form className="modal__form" onSubmit={handleSubmit} noValidate>
                    <div className="modal__fields">
                        {/* Название интеграции */}
                        <div className="modal__field">
                            <label className="modal__label" htmlFor="name">
                                Название интеграции *
                            </label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={`modal__input ${shouldShowError('name') ? 'modal__input--error' : ''}`}
                                placeholder="Введите название интеграции"
                                disabled={isSubmitting}
                                maxLength={100}
                            />
                            <div className="modal__error-container">
                                {shouldShowError('name') && (
                                    <span className="modal__error">
                                        {errors.name}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Subdomain */}
                        <div className="modal__field">
                            <label className="modal__label" htmlFor="subdomain">
                                Subdomain AmoCRM *
                            </label>
                            <input
                                id="subdomain"
                                type="text"
                                name="subdomain"
                                value={formData.subdomain}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={`modal__input ${shouldShowError('subdomain') ? 'modal__input--error' : ''}`}
                                placeholder="your-subdomain"
                                disabled={isSubmitting}
                            />
                            <span className="modal__hint">
                                Например: mycompany (из mycompany.amocrm.ru)
                            </span>
                            <div className="modal__error-container">
                                {shouldShowError('subdomain') && (
                                    <span className="modal__error">
                                        {errors.subdomain}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Access Token */}
                        <div className="modal__field">
                            <label className="modal__label" htmlFor="access_token">
                                Access Token *
                            </label>
                            <div className="modal__input-wrapper">
                                <input
                                    id="access_token"
                                    type={showSecrets.access_token ? "text" : "password"}
                                    name="access_token"
                                    value={formData.access_token}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    className={`modal__input ${shouldShowError('access_token') ? 'modal__input--error' : ''}`}
                                    placeholder="Введите access token"
                                    disabled={isSubmitting}
                                />
                                <button
                                    type="button"
                                    className="modal__toggle-secret"
                                    onClick={() => toggleSecretVisibility('access_token')}
                                >
                                    {showSecrets.access_token ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                            <div className="modal__error-container">
                                {shouldShowError('access_token') && (
                                    <span className="modal__error">
                                        {errors.access_token}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Client ID */}
                        <div className="modal__field">
                            <label className="modal__label" htmlFor="client_id">
                                Client ID *
                            </label>
                            <input
                                id="client_id"
                                type="text"
                                name="client_id"
                                value={formData.client_id}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={`modal__input ${shouldShowError('client_id') ? 'modal__input--error' : ''}`}
                                placeholder="Введите client ID"
                                disabled={isSubmitting}
                            />
                            <div className="modal__error-container">
                                {shouldShowError('client_id') && (
                                    <span className="modal__error">
                                        {errors.client_id}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Client Secret */}
                        <div className="modal__field">
                            <label className="modal__label" htmlFor="client_secret">
                                Client Secret *
                            </label>
                            <div className="modal__input-wrapper">
                                <input
                                    id="client_secret"
                                    type={showSecrets.client_secret ? "text" : "password"}
                                    name="client_secret"
                                    value={formData.client_secret}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    className={`modal__input ${shouldShowError('client_secret') ? 'modal__input--error' : ''}`}
                                    placeholder="Введите client secret"
                                    disabled={isSubmitting}
                                />
                                <button
                                    type="button"
                                    className="modal__toggle-secret"
                                    onClick={() => toggleSecretVisibility('client_secret')}
                                >
                                    {showSecrets.client_secret ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                            <div className="modal__error-container">
                                {shouldShowError('client_secret') && (
                                    <span className="modal__error">
                                        {errors.client_secret}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="modal__row">
                            {/* New Lead Pipeline ID */}
                            <div className="modal__field modal__field--half">
                                <label className="modal__label" htmlFor="new_lead_pipeline_id">
                                    ID воронки (новые) *
                                </label>
                                <input
                                    id="new_lead_pipeline_id"
                                    type="number"
                                    name="new_lead_pipeline_id"
                                    value={formData.new_lead_pipeline_id}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    className={`modal__input ${shouldShowError('new_lead_pipeline_id') ? 'modal__input--error' : ''}`}
                                    placeholder="Напр. 123"
                                    disabled={isSubmitting}
                                    min="1"
                                />
                                <div className="modal__error-container">
                                    {shouldShowError('new_lead_pipeline_id') && (
                                        <span className="modal__error">
                                            {errors.new_lead_pipeline_id}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Existing Lead Pipeline ID */}
                            <div className="modal__field modal__field--half">
                                <label className="modal__label" htmlFor="existing_lead_pipeline_id">
                                    ID воронки (существующие) *
                                </label>
                                <input
                                    id="existing_lead_pipeline_id"
                                    type="number"
                                    name="existing_lead_pipeline_id"
                                    value={formData.existing_lead_pipeline_id}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    className={`modal__input ${shouldShowError('existing_lead_pipeline_id') ? 'modal__input--error' : ''}`}
                                    placeholder="Напр. 456"
                                    disabled={isSubmitting}
                                    min="1"
                                />
                                <div className="modal__error-container">
                                    {shouldShowError('existing_lead_pipeline_id') && (
                                        <span className="modal__error">
                                            {errors.existing_lead_pipeline_id}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="modal__row">
                            {/* Responsible User ID */}
                            <div className="modal__field modal__field--half">
                                <label className="modal__label" htmlFor="responsible_user_id">
                                    ID ответственного *
                                </label>
                                <input
                                    id="responsible_user_id"
                                    type="number"
                                    name="responsible_user_id"
                                    value={formData.responsible_user_id}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    className={`modal__input ${shouldShowError('responsible_user_id') ? 'modal__input--error' : ''}`}
                                    placeholder="Напр. 789"
                                    disabled={isSubmitting}
                                    min="1"
                                />
                                <div className="modal__error-container">
                                    {shouldShowError('responsible_user_id') && (
                                        <span className="modal__error">
                                            {errors.responsible_user_id}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Telegram Field ID */}
                            <div className="modal__field modal__field--half">
                                <label className="modal__label" htmlFor="telegram_field_id">
                                    ID поля Telegram *
                                </label>
                                <input
                                    id="telegram_field_id"
                                    type="number"
                                    name="telegram_field_id"
                                    value={formData.telegram_field_id}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    className={`modal__input ${shouldShowError('telegram_field_id') ? 'modal__input--error' : ''}`}
                                    placeholder="Напр. 101112"
                                    disabled={isSubmitting}
                                    min="1"
                                />
                                <div className="modal__error-container">
                                    {shouldShowError('telegram_field_id') && (
                                        <span className="modal__error">
                                            {errors.telegram_field_id}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Больше нет чекбоксов - все поля скрыты и имеют дефолтные значения */}
                    </div>

                    <div className="modal__actions">
                        <button
                            type="button"
                            className="modal__button modal__button--secondary"
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className="modal__button modal__button--primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Создание...' : 'Создать интеграцию'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateIntegrationModal;