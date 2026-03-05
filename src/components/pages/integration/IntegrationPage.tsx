import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../api/Authorization/authContext';
import {
    getProject,
    formatProjectDate,
    getProjectStatusText,
    getProjectLanguageText,
    getProjectStatusColor
} from '../../api/Projects/apiGetProject';
import { getProjectIntegrations, formatIntegrationDate, maskSecretKey } from '../../api/Integrations/apiGetIntegrations';
import { IntegrationResponse, CreateIntegrationRequest } from '../../types/integrations';
import { ProjectResponse, ProjectFormData } from '../../types/project';
import Header from '../../widgets/header/header';
import Footer from '../../widgets/footer/footer';
import AccountSidebar from '../account/components/Sidebar/AccountSidebar';
import CreateIntegrationModal from './components/CreateIntegrationModal/CreateIntegrationModal';
import CreateForm from '../account/components/Modal/CreateForm';
import { useToast } from '../../widgets/toast/ToastProvider';
import { Organization } from '../../types/organization';
import './IntegrationPage.scss';
import { createIntegration } from '../../api/Integrations/apiCreateIntegration';
import { deleteIntegration } from '../../api/Integrations/apiDeleteIntegration';
import DeleteConfirmationModal from './components/DeleteConfirmationModal/DeleteConfirmationModal';

const IntegrationPage: React.FC = () => {
    const { orgId, projectId } = useParams<{ orgId: string; projectId: string }>();
    const navigate = useNavigate();
    const { user, isLoading, isAuthenticated } = useAuth();
    const { showToast } = useToast();

    const [project, setProject] = useState<ProjectResponse | null>(null);
    const [integrations, setIntegrations] = useState<IntegrationResponse[]>([]);
    const [isLoadingProject, setIsLoadingProject] = useState(true);
    const [isLoadingIntegrations, setIsLoadingIntegrations] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'integrations'>('overview');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [organizations, setOrganizations] = useState<Organization[]>([]);

    const [deleteModalState, setDeleteModalState] = useState<{
        isOpen: boolean;
        integrationId: string | null;
        integrationName: string;
    }>({
        isOpen: false,
        integrationId: null,
        integrationName: ''
    });
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate('/auth', {
                state: {
                    message: 'Для доступа к интеграциям необходимо авторизоваться'
                }
            });
        }
    }, [isLoading, isAuthenticated, navigate]);

    useEffect(() => {
        if (user?.organizations) {
            setOrganizations(user.organizations);
        }
    }, [user]);

    useEffect(() => {
        if (projectId && isAuthenticated) {
            fetchProject();
        }
    }, [projectId, isAuthenticated]);

    useEffect(() => {
        if (projectId && isAuthenticated && activeTab === 'integrations') {
            fetchIntegrations();
        }
    }, [projectId, isAuthenticated, activeTab]);

    const fetchProject = async () => {
        if (!projectId) return;
        setIsLoadingProject(true);
        try {
            const data = await getProject(projectId);
            setProject(data);
        } catch (error) {
            console.error('Ошибка при загрузке проекта:', error);
            showToast(error instanceof Error ? error.message : 'Не удалось загрузить информацию о проекте', 'error', 4000);
            if (orgId) {
                navigate(`/account/organization/${orgId}/projects`);
            }
        } finally {
            setIsLoadingProject(false);
        }
    };

    const fetchIntegrations = async () => {
        if (!projectId) return;
        setIsLoadingIntegrations(true);
        try {
            const data = await getProjectIntegrations(projectId);
            setIntegrations(data);
            console.log('Загружены интеграции:', data); // Для отладки
        } catch (error) {
            console.error('Ошибка при загрузке интеграции:', error);
            showToast(error instanceof Error ? error.message : 'Не удалось загрузить интеграцию', 'error', 4000);
        } finally {
            setIsLoadingIntegrations(false);
        }
    };

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    const handleCreateRequest = () => {
        setIsProjectModalOpen(true);
    };

    const handleProjectModalClose = () => {
        setIsProjectModalOpen(false);
    };

    const handleProjectSubmit = async (requestData: ProjectFormData) => {
        console.log('Создан новый запрос:', requestData);

        showToast('Запрос успешно создан!', 'success', 4000);
        setIsProjectModalOpen(false);

        if (requestData.organization_id) {
            navigate(`/account/organization/${requestData.organization_id}/projects`);
        }
    };

    const handleBackToProjects = () => {
        navigate(`/account/organization/${orgId}/projects`);
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleIntegrationSubmit = async (data: CreateIntegrationRequest) => {
        try {
            // Проверяем, что projectId существует
            if (!projectId) {
                showToast('ID проекта не найден', 'error', 4000);
                return;
            }

            // Теперь TypeScript знает, что projectId - это string
            const response = await createIntegration(data, projectId);
            console.log('Интеграция создана:', response);
            await fetchIntegrations();
            showToast('Интеграция успешно создана!', 'success', 4000);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Ошибка:', error);
            const errorMessage = error instanceof Error
                ? error.message
                : 'Ошибка при создании интеграции';
            showToast(errorMessage, 'error', 4000);
        }
    };

    const handleDeleteClick = (integrationId: string, integrationName: string) => {
        setDeleteModalState({
            isOpen: true,
            integrationId,
            integrationName
        });
    };

    const handleDeleteCancel = () => {
        setDeleteModalState({
            isOpen: false,
            integrationId: null,
            integrationName: ''
        });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteModalState.integrationId) return;

        setIsDeleting(true);
        try {
            // hardDelete: true для полного удаления
            await deleteIntegration(deleteModalState.integrationId, true);

            showToast('Интеграция успешно удалена', 'success', 4000);

            await fetchIntegrations();
            handleDeleteCancel();
        } catch (error) {
            console.error('Ошибка при удалении:', error);
            showToast(
                error instanceof Error ? error.message : 'Ошибка при удалении интеграции',
                'error',
                4000
            );
        } finally {
            setIsDeleting(false);
        }
    };

    if (!user || !project) {
        return null;
    }

    const organization = user.organizations?.find(org => org.id === project.organization_id);

    return (
        <div className="integration-wrapper">
            <Header />

            <main className="integration-main">
                <div className="stars-container">
                    {Array.from({ length: 20 }).map((_, index) => (
                        <div key={index} className="star"></div>
                    ))}
                </div>

                <div className="integration-container">
                    <AccountSidebar
                        onNavigate={handleNavigation}
                        onCreateRequest={handleCreateRequest}
                    />

                    <div className="integration-content">
                        <div className="integration-content__header">
                            <div className="integration-header__info">
                                <h1 className="integration-content__title">
                                    {project.name}
                                </h1>
                                {organization && (
                                    <span className="integration-organization-name">
                                        {organization.name}
                                    </span>
                                )}
                            </div>
                            <button
                                className="back-button"
                                onClick={handleBackToProjects}
                            >
                                ← К проектам
                            </button>
                        </div>

                        <div className="integration-tabs">
                            <button
                                className={`tab-btn ${activeTab === 'overview' ? 'tab-btn--active' : ''}`}
                                onClick={() => setActiveTab('overview')}
                            >
                                Обзор
                            </button>
                            <button
                                className={`tab-btn ${activeTab === 'integrations' ? 'tab-btn--active' : ''}`}
                                onClick={() => setActiveTab('integrations')}
                            >
                                Интеграции {integrations.length > 0 && `(${integrations.length})`}
                            </button>
                        </div>

                        {isLoadingProject ? (
                            <div className="integration-loading">
                                <div className="loading-spinner"></div>
                                <p>Загрузка данных проекта...</p>
                            </div>
                        ) : (
                            <div className="integration-tab-content">
                                {activeTab === 'overview' && (
                                    <div className="overview-tab">

                                        <div className="info-grid">
                                            <div className="info-card">
                                                <h3 className="info-card__title">Основная информация</h3>
                                                <div className="info-card__content">
                                                    <div className="info-row">
                                                        <span className="info-label">ID проекта:</span>
                                                        <span className="info-value project-id">{project.id}</span>
                                                    </div>
                                                    <div className="info-row">
                                                        <span className="info-label">Организация:</span>
                                                        <span className="info-value">{organization?.name || 'Не указано'}</span>
                                                    </div>
                                                    <div className="info-row">
                                                        <span className="info-label">Статус:</span>
                                                        <span className="info-value">
                                                            <span
                                                                className="status-dot"
                                                                style={{ backgroundColor: getProjectStatusColor(project.status) }}
                                                            ></span>
                                                            {getProjectStatusText(project.status)}
                                                        </span>
                                                    </div>
                                                    <div className="info-row">
                                                        <span className="info-label">Состояние:</span>
                                                        <span className="info-value">{project.state || 'Не указано'}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="info-card">
                                                <h3 className="info-card__title">Технические детали</h3>
                                                <div className="info-card__content">
                                                    <div className="info-row">
                                                        <span className="info-label">Платформа:</span>
                                                        <span className="info-value">{project.platform_type || 'Не указано'}</span>
                                                    </div>
                                                    <div className="info-row">
                                                        <span className="info-label">Язык:</span>
                                                        <span className="info-value">{getProjectLanguageText(project.language)}</span>
                                                    </div>
                                                    <div className="info-row">
                                                        <span className="info-label">Часовой пояс:</span>
                                                        <span className="info-value">{project.timezone}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="info-card">
                                                <h3 className="info-card__title">Даты</h3>
                                                <div className="info-card__content">
                                                    <div className="info-row">
                                                        <span className="info-label">Создан:</span>
                                                        <span className="info-value">{formatProjectDate(project.created_at)}</span>
                                                    </div>
                                                    <div className="info-row">
                                                        <span className="info-label">Создал:</span>
                                                        <span className="info-value project-id">{project.created_by}</span>
                                                    </div>
                                                    {project.updated_at && (
                                                        <>
                                                            <div className="info-row">
                                                                <span className="info-label">Обновлен:</span>
                                                                <span className="info-value">{formatProjectDate(project.updated_at)}</span>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {project.application && (
                                            <div className="info-card">
                                                <h3 className="info-card__title">Подключенное приложение</h3>
                                                <div className="info-card__content">
                                                    <pre className="application-json">{JSON.stringify(project.application, null, 2)}</pre>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'integrations' && (
                                    <div className="integrations-tab">
                                        <div className="integrations-header">
                                            <h2 className="integrations-title">Интеграции проекта</h2>
                                            <button
                                                className="create-btn"
                                                onClick={handleOpenModal}
                                            >
                                                + Добавить интеграцию
                                            </button>
                                        </div>

                                        {isLoadingIntegrations ? (
                                            <div className="integrations-loading">
                                                <div className="loading-spinner-small"></div>
                                                <p>Загрузка интеграций...</p>
                                            </div>
                                        ) : integrations.length > 0 ? (
                                            <div className="integrations-list">
                                                {integrations.map((integration) => (
                                                    <div key={integration.id} className="integration-card">
                                                        <div className="integration-card__header">
                                                            <h3 className="integration-card__title">{integration.name}</h3>
                                                            <span className={`integration-status ${integration.is_active ? 'active' : 'inactive'}`}>
                                                                {integration.is_active ? 'Активна' : 'Неактивна'}
                                                            </span>
                                                        </div>

                                                        <div className="integration-card__content">
                                                            <div className="integration-card__row">
                                                                <span className="integration-card__label">Subdomain:</span>
                                                                <span className="integration-card__value">{integration.subdomain}.amocrm.ru</span>
                                                            </div>
                                                            <div className="integration-card__row">
                                                                <span className="integration-card__label">Client ID:</span>
                                                                <span className="integration-card__value integration-card__value--mono">
                                                                    {maskSecretKey(integration.client_id)}
                                                                </span>
                                                            </div>
                                                            <div className="integration-card__row">
                                                                <span className="integration-card__label">Pipeline (новые):</span>
                                                                <span className="integration-card__value">{integration.new_lead_pipeline_id}</span>
                                                            </div>
                                                            <div className="integration-card__row">
                                                                <span className="integration-card__label">Pipeline (существ.):</span>
                                                                <span className="integration-card__value">{integration.existing_lead_pipeline_id}</span>
                                                            </div>
                                                            <div className="integration-card__row">
                                                                <span className="integration-card__label">Ответственный:</span>
                                                                <span className="integration-card__value">{integration.responsible_user_id}</span>
                                                            </div>
                                                            <div className="integration-card__row">
                                                                <span className="integration-card__label">Последняя синхр.:</span>
                                                                <span className="integration-card__value">{formatIntegrationDate(integration.last_sync_at)}</span>
                                                            </div>
                                                        </div>

                                                        <div className="integration-card__footer">
                                                            <span className="integration-card__id" title={integration.id}>
                                                                ID: {integration.id}...
                                                            </span>
                                                            <button
                                                                className="integration-card__delete-btn"
                                                                onClick={() => handleDeleteClick(integration.id, integration.name)}
                                                            >
                                                                Удалить
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="empty-state-integration">
                                                <h3 className="empty-state__title">Нет интеграций</h3>
                                                <p className="empty-state__description">
                                                    Добавьте первую интеграцию с AmoCRM, чтобы начать синхронизацию данных
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <CreateIntegrationModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleIntegrationSubmit}
                projectId={projectId || ''}
            />

            <CreateForm
                isOpen={isProjectModalOpen}
                onClose={handleProjectModalClose}
                onSubmit={handleProjectSubmit}
                organizations={organizations}
            />

            <DeleteConfirmationModal
                isOpen={deleteModalState.isOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                integrationName={deleteModalState.integrationName}
                isDeleting={isDeleting}
            />

            <Footer />
        </div>
    );
};

export default IntegrationPage;