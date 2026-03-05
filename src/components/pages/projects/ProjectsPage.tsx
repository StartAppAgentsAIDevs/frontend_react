import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../api/Authorization/authContext';
import {
    getOrganizationProjects,
    formatProjectDate,
    getProjectStatusText,
    getProjectLanguageText,
    getProjectStatusColor
} from '../../api/Projects/apiGetListProjects';
import { ProjectFormData, ProjectResponse } from '../../types/project';
import Header from '../../widgets/header/header';
import Footer from '../../widgets/footer/footer';
import AccountSidebar from '../account/components/Sidebar/AccountSidebar';
import CreateForm from '../account/components/Modal/CreateForm';
import { useToast } from '../../widgets/toast/ToastProvider';
import { Organization } from '../../types/organization';
import './ProjectsPage.scss';

const ProjectsPage: React.FC = () => {
    const { orgId } = useParams<{ orgId: string }>();
    const navigate = useNavigate();
    const { user, isLoading, isAuthenticated } = useAuth();
    const { showToast } = useToast();

    const [projects, setProjects] = useState<ProjectResponse[]>([]);
    const [isLoadingProjects, setIsLoadingProjects] = useState(true);
    const [filter, setFilter] = useState<string>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [organizations, setOrganizations] = useState<Organization[]>([]);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate('/auth', {
                state: {
                    message: 'Для доступа к проектам необходимо авторизоваться'
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
        if (orgId && isAuthenticated) {
            fetchProjects();
        }
    }, [orgId, isAuthenticated]);

    const fetchProjects = async () => {
        if (!orgId) return;
        setIsLoadingProjects(true);
        try {
            const data = await getOrganizationProjects(orgId);
            setProjects(data);
        } catch (error) {
            console.error('Ошибка при загрузке проектов:', error);
            showToast(error instanceof Error ? error.message : 'Не удалось загрузить список проектов', 'error', 4000);
        } finally {
            setIsLoadingProjects(false);
        }
    };

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    const handleCreateRequest = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleRequestSubmit = async (requestData: ProjectFormData) => {
        console.log('Создан новый запрос:', requestData);

        // Показываем уведомление об успешном создании
        showToast('Запрос успешно создан!', 'success', 4000);

        // Закрываем модальное окно
        setIsModalOpen(false);

        // Обновляем список проектов, если мы находимся в организации, для которой создан проект
        if (orgId && requestData.organization_id === orgId) {
            await fetchProjects();
        } else if (requestData.organization_id) {
            // Если проект создан в другой организации, перенаправляем пользователя на страницу проектов этой организации
            navigate(`/account/organization/${requestData.organization_id}/projects`);
        }
    };

    const handleProjectClick = (projectId: string) => {
        navigate(`/account/organization/${orgId}/project/${projectId}`);
    };

    const filteredProjects = projects.filter(project => {
        if (filter === 'all') return true;
        if (filter === 'active') return project.status === 'active';
        if (filter === 'completed') return project.status === 'completed';
        return true;
    });

    if (!user) {
        return null;
    }

    const organization = user.organizations?.find(org => org.id === orgId);

    return (
        <div className="projects-wrapper">
            <Header />

            <main className="projects-main">
                <div className="stars-container">
                    {Array.from({ length: 20 }).map((_, index) => (
                        <div key={index} className="star"></div>
                    ))}
                </div>

                <div className="projects-container">
                    <AccountSidebar
                        onNavigate={handleNavigation}
                        onCreateRequest={handleCreateRequest}
                    />

                    <div className="projects-content">
                        <div className="projects-content__header">
                            <div className="projects-header__info">
                                <h1 className="projects-content__title">
                                    Проекты организации:
                                </h1>
                                {organization && (
                                    <span className="projects-organization-name">
                                        {organization.name}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="projects-filters">
                            <button
                                className={`filter-btn ${filter === 'all' ? 'filter-btn--active' : ''}`}
                                onClick={() => setFilter('all')}
                            >
                                Все проекты ({projects.length})
                            </button>
                            <button
                                className={`filter-btn ${filter === 'active' ? 'filter-btn--active' : ''}`}
                                onClick={() => setFilter('active')}
                            >
                                Активные ({projects.filter(p => p.status === 'active').length})
                            </button>
                            <button
                                className={`filter-btn ${filter === 'completed' ? 'filter-btn--active' : ''}`}
                                onClick={() => setFilter('completed')}
                            >
                                Завершенные ({projects.filter(p => p.status === 'completed').length})
                            </button>
                        </div>

                        {isLoadingProjects ? (
                            <div className="projects-loading">
                                <div className="loading-spinner"></div>
                                <p>Загрузка проектов...</p>
                            </div>
                        ) : filteredProjects.length > 0 ? (
                            <div className="projects-grid">
                                {filteredProjects.map((project) => (
                                    <div
                                        key={project.id}
                                        className="project-card"
                                        onClick={() => handleProjectClick(project.id)}
                                    >
                                        <div className="project-card__header">
                                            <h3 className="project-card__title">{project.name}</h3>
                                            <div className="project-card__badges">
                                                <span
                                                    className="status-badge"
                                                    style={{
                                                        backgroundColor: `${getProjectStatusColor(project.status)}20`,
                                                        color: getProjectStatusColor(project.status),
                                                        border: `1px solid ${getProjectStatusColor(project.status)}40`
                                                    }}
                                                >
                                                    {getProjectStatusText(project.status)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="project-card__info">
                                            <div className="project-info__item">
                                                <span className="info-label">Платформа:</span>
                                                <span className="info-value">{project.platform_type || 'Не указано'}</span>
                                            </div>
                                            <div className="project-info__item">
                                                <span className="info-label">Язык:</span>
                                                <span className="info-value">{getProjectLanguageText(project.language)}</span>
                                            </div>
                                            <div className="project-info__item">
                                                <span className="info-label">Часовой пояс:</span>
                                                <span className="info-value">{project.timezone}</span>
                                            </div>
                                            <div className="project-info__item">
                                                <span className="info-label">Создан:</span>
                                                <span className="info-value">{formatProjectDate(project.created_at)}</span>
                                            </div>
                                            {project.updated_at && (
                                                <div className="project-info__item">
                                                    <span className="info-label">Обновлен:</span>
                                                    <span className="info-value">{formatProjectDate(project.updated_at)}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="project-card__footer">
                                            <span className="project-id" title={project.id}>
                                                ID: {project.id.slice(0, 8)}...
                                            </span>
                                            <button className="project-card__more-btn">
                                                Подробнее →
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="projects-empty">
                                <div className="empty-state">
                                    <div className="empty-state__icon">📁</div>
                                    <h3 className="empty-state__title">Нет проектов</h3>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <CreateForm
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSubmit={handleRequestSubmit}
                organizations={organizations}
            />

            <Footer />
        </div>
    );
};

export default ProjectsPage;