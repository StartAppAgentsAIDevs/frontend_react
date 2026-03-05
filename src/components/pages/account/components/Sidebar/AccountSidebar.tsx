import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AccountSidebar.scss';
import { useAuth } from '../../../../api/Authorization/authContext';

interface SidebarItem {
    id: string;
    title: string;
    path: string;
    icon?: string;
}

interface AccountSidebarProps {
    onNavigate?: (path: string) => void;
    onCreateRequest?: () => void;
}

const AccountSidebar: React.FC<AccountSidebarProps> = ({
    onNavigate,
    onCreateRequest
}) => {
    const location = useLocation();
    const { user } = useAuth();

    // Получаем ID первой организации пользователя для формирования ссылки на проекты
    const organizationId = user?.organizations?.[0]?.id;

    const menuItems: SidebarItem[] = [
        { id: 'account', title: 'Аккаунт', path: '/account' },
        {
            id: 'projects',
            title: 'Проекты',
            path: organizationId ? `/account/organization/${organizationId}/projects` : '/account'
        },
    ];

    const handleCreateRequest = () => {
        if (onCreateRequest) {
            onCreateRequest();
        } else {
            alert('Функция создания запроса временно недоступна');
        }
    };

    const handleNavigation = (path: string) => {
        if (onNavigate) {
            onNavigate(path);
        }
    };

    // Проверяем активный пункт меню
    const isActive = (itemPath: string) => {
        if (itemPath === '/account') {
            return location.pathname === '/account';
        }
        // Для проектов проверяем, содержит ли текущий путь /projects
        return location.pathname.includes('/projects');
    };

    return (
        <aside className="account-sidebar">
            <div className="account-sidebar__header">
                <h2 className="account-sidebar__title">Личный кабинет</h2>
            </div>

            <nav className="account-sidebar__nav">
                <ul className="account-sidebar__menu">
                    {menuItems.map((item) => (
                        <li key={item.id} className="account-sidebar__item">
                            <Link
                                to={item.path}
                                className={`account-sidebar__link ${isActive(item.path) ? 'account-sidebar__link--active' : ''
                                    }`}
                                onClick={() => handleNavigation(item.path)}
                            >
                                <span className="account-sidebar__link-text">{item.title}</span>
                                <div className="account-sidebar__link-arrow">→</div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="account-sidebar__actions">
                <button
                    className="account-sidebar__create-btn"
                    onClick={handleCreateRequest}
                >
                    Создать проект
                </button>
            </div>
        </aside>
    );
};

export default AccountSidebar;