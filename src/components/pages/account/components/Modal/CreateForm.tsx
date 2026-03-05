import React, { useState, useEffect } from 'react';
import './Modal.scss';
import { useToast } from '../../../../widgets/toast/ToastProvider';
import { CreateProjectRequest } from '../../../../types/project';
import { createProject } from '../../../../api/Projects/apiCreateProjects';
import { validateProjectForm, ValidationErrors, hasErrors } from './validation/validationForm';


interface CreateRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateProjectRequest) => void;
    organizations: Organization[];
}

interface Organization {
    id: string;
    name: string;
    role: string;
    is_active: boolean;
}

const TIMEZONES = [
    { value: 'Europe/Moscow', label: 'Москва (MSK)' },
    { value: 'Europe/Kaliningrad', label: 'Калининград (UTC+2)' },
    { value: 'Europe/Samara', label: 'Самара (UTC+4)' },
    { value: 'Asia/Yekaterinburg', label: 'Екатеринбург (UTC+5)' },
    { value: 'Asia/Omsk', label: 'Омск (UTC+6)' },
    { value: 'Asia/Krasnoyarsk', label: 'Красноярск (UTC+7)' },
    { value: 'Asia/Irkutsk', label: 'Иркутск (UTC+8)' },
    { value: 'Asia/Yakutsk', label: 'Якутск (UTC+9)' },
    { value: 'Asia/Vladivostok', label: 'Владивосток (UTC+10)' },
    { value: 'Asia/Magadan', label: 'Магадан (UTC+11)' },
    { value: 'Asia/Kamchatka', label: 'Камчатка (UTC+12)' },
] as const;

const LANGUAGES = [
    { value: 'ru', label: 'Русский' },
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'it', label: 'Italiano' },
] as const;

const PLATFORM_TYPES = [
    { value: 'amocrm', label: 'amocrm' }
] as const;

const CreateForm: React.FC<CreateRequestModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    organizations
}) => {
    const { showToast } = useToast();

    const [formData, setFormData] = useState<CreateProjectRequest>({
        name: '',
        timezone: 'Europe/Moscow',
        language: 'ru',
        organization_id: organizations[0]?.id || '',
        platform_type: 'amocrm',
    });

    const [errors, setErrors] = useState<ValidationErrors>({});
    const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (organizations.length > 0 && !formData.organization_id) {
            setFormData(prev => ({
                ...prev,
                organization_id: organizations[0].id
            }));
        }
    }, [organizations]);

    const validateField = (name: string, value: string): string | null => {
        const fieldErrors = validateProjectForm({ ...formData, [name]: value });
        return fieldErrors[name as keyof ValidationErrors] || null;
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));

        // Помечаем поле как "тронутое" при первом изменении
        if (!touchedFields.has(name)) {
            setTouchedFields(prev => new Set(prev).add(name));
        }

        // Валидируем только конкретное поле
        const fieldError = validateField(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: fieldError,
        }));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name } = e.target;

        // Помечаем поле как "тронутое" при потере фокуса
        if (!touchedFields.has(name)) {
            setTouchedFields(prev => new Set(prev).add(name));
        }

        // Валидируем поле при потере фокуса
        const fieldError = validateField(name, formData[name as keyof CreateProjectRequest]);
        setErrors(prev => ({
            ...prev,
            [name]: fieldError,
        }));
    };

    const validateForm = (): boolean => {
        // Помечаем все поля как "тронутые"
        const allFields = ['name', 'organization_id', 'platform_type', 'timezone', 'language'];
        setTouchedFields(new Set(allFields));

        // Валидируем всю форму
        const newErrors = validateProjectForm(formData);
        setErrors(newErrors);

        return !hasErrors(newErrors);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            // Показываем тост с ошибкой валидации
            showToast('Пожалуйста, заполните все обязательные поля', 'error', 4000);
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await createProject(formData);
            console.log('Проект успешно создан:', response);

            showToast('Проект успешно создан!', 'success', 4000);
            onSubmit(formData);
            handleClose();
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message, 'error', 5000);
            } else {
                showToast('Ошибка при создании проекта. Пожалуйста, попробуйте снова.', 'error', 4000);
            }
            console.error('Ошибка при создании проекта:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setFormData({
                name: '',
                timezone: 'UTC',
                language: 'ru',
                organization_id: organizations[0]?.id || '',
                platform_type: 'amocrm',
            });
            setErrors({});
            setTouchedFields(new Set());
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
                    <h2 className="modal__title">Создать новый проект</h2>
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
                        {/* Название проекта */}
                        <div className="modal__field">
                            <label className="modal__label" htmlFor="name">
                                Название проекта *
                            </label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={`modal__input ${shouldShowError('name') ? 'modal__input--error' : ''}`}
                                placeholder="Введите название проекта"
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

                        {/* Выбор организации */}
                        <div className="modal__field">
                            <label className="modal__label" htmlFor="organization_id">
                                Организация *
                            </label>
                            <select
                                id="organization_id"
                                name="organization_id"
                                value={formData.organization_id}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={`modal__select ${shouldShowError('organization_id') ? 'modal__select--error' : ''}`}
                                disabled={isSubmitting || organizations.length === 0}
                            >
                                {organizations.length === 0 ? (
                                    <option value="">Нет доступных организаций</option>
                                ) : (
                                    organizations.map(org => (
                                        <option key={org.id} value={org.id}>
                                            {org.name} {!org.is_active ? '(неактивна)' : ''}
                                        </option>
                                    ))
                                )}
                            </select>
                            <div className="modal__error-container">
                                {shouldShowError('organization_id') && (
                                    <span className="modal__error">
                                        {errors.organization_id}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Тип платформы */}
                        <div className="modal__field">
                            <label className="modal__label" htmlFor="platform_type">
                                Тип платформы *
                            </label>
                            <select
                                id="platform_type"
                                name="platform_type"
                                value={formData.platform_type}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={`modal__select ${shouldShowError('platform_type') ? 'modal__select--error' : ''}`}
                                disabled={isSubmitting}
                            >
                                {PLATFORM_TYPES.map(platform => (
                                    <option key={platform.value} value={platform.value}>
                                        {platform.label}
                                    </option>
                                ))}
                            </select>
                            <div className="modal__error-container">
                                {shouldShowError('platform_type') && (
                                    <span className="modal__error">
                                        {errors.platform_type}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Часовой пояс */}
                        <div className="modal__field">
                            <label className="modal__label" htmlFor="timezone">
                                Часовой пояс *
                            </label>
                            <select
                                id="timezone"
                                name="timezone"
                                value={formData.timezone}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className="modal__select"
                                disabled={isSubmitting}
                            >
                                {TIMEZONES.map(tz => (
                                    <option key={tz.value} value={tz.value}>
                                        {tz.label}
                                    </option>
                                ))}
                            </select>
                            <div className="modal__error-container">
                                {/* Пустой контейнер для сохранения высоты */}
                            </div>
                        </div>

                        {/* Язык */}
                        <div className="modal__field">
                            <label className="modal__label" htmlFor="language">
                                Язык проекта *
                            </label>
                            <select
                                id="language"
                                name="language"
                                value={formData.language}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className="modal__select"
                                disabled={isSubmitting}
                            >
                                {LANGUAGES.map(lang => (
                                    <option key={lang.value} value={lang.value}>
                                        {lang.label}
                                    </option>
                                ))}
                            </select>
                            <div className="modal__error-container">
                                {/* Пустой контейнер для сохранения высоты */}
                            </div>
                        </div>
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
                            {isSubmitting ? 'Создание...' : 'Создать проект'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateForm;