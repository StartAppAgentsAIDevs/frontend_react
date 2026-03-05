import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AccountPage.scss';
import Header from '../../widgets/header/header';
import Footer from '../../widgets/footer/footer';
import AccountSidebar from './components/Sidebar/AccountSidebar';
import CreateForm from './components/Modal/CreateForm';
import { useAuth } from '../../api/Authorization/authContext';
import {
    getUserFullName,
    formatRegistrationDate,
    formatPhoneNumber
} from '../../api/getUser/apiUserData';
import { useToast } from '../../widgets/toast/ToastProvider';
import EditProfileModal from './components/Modal/EditProfileModal';
import { UserProfile } from '../../types/userData';
import { Organization } from '../../types/organization';
import { ProjectFormData } from '../../types/project';

function AccountPage() {
    const navigate = useNavigate();
    const { user, isLoading, isAuthenticated, fetchUserProfile } = useAuth();
    const { showToast } = useToast();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [userStats, setUserStats] = useState({
        totalRequests: 0,
        completedProjects: 0,
    });

    const [organizations, setOrganizations] = useState<Organization[]>([]);

    useEffect(() => {
        if (user?.organizations) {
            setOrganizations(user.organizations);
        }
    }, [user]);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate('/auth', {
                state: {
                    message: 'Для доступа к личному кабинету необходимо авторизоваться'
                }
            });
        }
    }, [isLoading, isAuthenticated, navigate]);

    useEffect(() => {
        // Здесь можно добавить запрос к API для получения статистики

        // Временные данные для примера
        setUserStats({
            totalRequests: 5,
            completedProjects: 3,
        });
    }, [user?.id]);

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    const handleCreateRequest = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleEditProfile = () => {
        setIsEditModalOpen(true);
    };

    const handleEditModalClose = () => {
        setIsEditModalOpen(false);
    };

    const handleProfileSave = async (updatedUser: UserProfile) => {
        try {
            await fetchUserProfile();
        } catch (error) {
            console.error('Ошибка при обновлении профиля:', error);
        }
    };

    const handleRequestSubmit = (requestData: ProjectFormData) => {
        console.log('Создан новый запрос:', requestData);

        showToast('Запрос успешно создан!', 'success', 4000);

        setUserStats(prev => ({
            ...prev,
            totalRequests: prev.totalRequests + 1,
        }));

        setIsModalOpen(false);
    };

    const handleChangePassword = () => {
        navigate('/change-password');
    };

    const displayValue = (value: string | null | undefined, defaultValue: string = 'Не указано'): string => {
        if (!value || value.trim() === '') {
            return defaultValue;
        }
        return value;
    };

    if (!user) {
        return null;
    }

    return (
        <div className="acc-wrapper">
            <Header />

            <main className="account-main">
                <div className="stars-container">
                    {Array.from({ length: 20 }).map((_, index) => (
                        <div key={index} className="star"></div>
                    ))}
                </div>
                <div className="account-container">
                    <AccountSidebar
                        onNavigate={handleNavigation}
                        onCreateRequest={handleCreateRequest}
                    />

                    <div className="account-content">
                        <div className="account-content__header">
                            <h1 className="account-content__title">Мой аккаунт</h1>
                            <div className="account-content__actions">
                                <button
                                    className="account-content__edit-btn"
                                    onClick={handleEditProfile}
                                >
                                    Редактировать профиль
                                </button>
                                <button
                                    className="account-content__password-btn"
                                    onClick={handleChangePassword}
                                    disabled //пока не работает
                                >
                                    Сменить пароль
                                </button>
                            </div>
                        </div>

                        <div className="account-info">
                            <div className="account-info__card">
                                <div className="account-info__card-header">
                                    <h3 className="account-info__card-title">Основная информация</h3>
                                    <div className="account-info__status">
                                        <span className={`status-badge ${user.is_email_verified ? 'status-badge--verified' : 'status-badge--unverified'}`}>
                                            {user.is_email_verified ? 'Email подтвержден' : 'Email не подтвержден'}
                                        </span>
                                        <span className={`status-badge ${!user.is_blocked ? 'status-badge--active' : 'status-badge--blocked'}`}>
                                            {!user.is_blocked ? 'Аккаунт активен' : 'Аккаунт заблокирован'}
                                        </span>
                                    </div>
                                </div>

                                <div className="account-info__field">
                                    <label className="account-info__label">Имя:</label>
                                    <span className="account-info__value">
                                        {displayValue(getUserFullName(user))}
                                    </span>
                                </div>

                                <div className="account-info__field">
                                    <label className="account-info__label">Email:</label>
                                    <span className="account-info__value">
                                        {displayValue(user.email, 'Email не указан')}
                                    </span>
                                </div>

                                <div className="account-info__field">
                                    <label className="account-info__label">Название организации</label>
                                    <span className="account-info__value">
                                        {displayValue(user.organizations[0]?.name, 'Название организации не указано')}
                                    </span>
                                </div>

                                <div className="account-info__field">
                                    <label className="account-info__label">Телефон:</label>
                                    <span className="account-info__value">
                                        {displayValue(formatPhoneNumber(user.phone))}
                                    </span>
                                </div>

                                <div className="account-info__field">
                                    <label className="account-info__label">Telegram ID:</label>
                                    <span className="account-info__value">
                                        {displayValue(user.telegram_id, 'Не привязан')}
                                    </span>
                                </div>

                                <div className="account-info__field">
                                    <label className="account-info__label">Дата регистрации:</label>
                                    <span className="account-info__value">
                                        {formatRegistrationDate(user.registration_date)}
                                    </span>
                                </div>

                                <div className="account-info__field">
                                    <label className="account-info__label">ID пользователя:</label>
                                    <span className="account-info__value account-info__value--mono">
                                        {user.id}
                                    </span>
                                </div>

                                {user.organizations && user.organizations.length > 0 && (
                                    <div className="account-info__organizations">
                                        <h4 className="account-info__organizations-title">Организации:</h4>
                                        <div className="organizations-list">
                                            {user.organizations.map((org) => (
                                                <div key={org.id} className="organization-item">
                                                    <div className="organization-name">
                                                        {displayValue(org.name)}
                                                    </div>
                                                    <div className="organization-details">
                                                        <span className={`organization-role organization-role--${org.role}`}>
                                                            {org.role === 'owner' ? 'Владелец' :
                                                                org.role === 'admin' ? 'Администратор' : 'Участник'}
                                                        </span>
                                                        <span className={`organization-status ${org.is_active ? 'organization-status--active' : 'organization-status--inactive'}`}>
                                                            {org.is_active ? 'Активна' : 'Неактивна'}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="account-stats">
                                <div className="account-stat-card">
                                    <h4 className="account-stat-card__title">Всего запросов</h4>
                                    <div className="account-stat-card__value">{userStats.totalRequests}</div>
                                    <p className="account-stat-card__description">Созданные проекты</p>
                                </div>

                                <div className="account-stat-card">
                                    <h4 className="account-stat-card__title">Завершено</h4>
                                    <div className="account-stat-card__value">{userStats.completedProjects}</div>
                                    <p className="account-stat-card__description">Успешных проектов</p>
                                </div>

                                <div className="account-stat-card">
                                    <h4 className="account-stat-card__title">В работе</h4>
                                    <div className="account-stat-card__value">
                                        {userStats.totalRequests - userStats.completedProjects}
                                    </div>
                                    <p className="account-stat-card__description">Текущие проекты</p>
                                </div>

                                <div className="account-stat-card">
                                    <h4 className="account-stat-card__title">Статус</h4>
                                    <div className="account-stat-card__value">
                                        {user.is_staff ? 'Администратор' : 'Пользователь'}
                                    </div>
                                    <p className="account-stat-card__description">Уровень доступа</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <CreateForm
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSubmit={handleRequestSubmit}
                organizations={organizations}
            />

            {user && (
                <EditProfileModal
                    isOpen={isEditModalOpen}
                    onClose={handleEditModalClose}
                    user={user}
                    onSave={handleProfileSave}
                />
            )}

            <Footer />
        </div>
    );
}

export default AccountPage;