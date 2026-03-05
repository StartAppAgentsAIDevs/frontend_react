import axios, { AxiosError } from 'axios';
import { CreateProjectRequest, ProjectResponse } from '../../types/project';
import { getAccessToken } from '../Authorization/apiAuth'; // Импортируем функцию из вашего apiAuth

const API_BASE_URL = process.env.REACT_APP_API_URL;

export const createProject = async (data: CreateProjectRequest): Promise<ProjectResponse> => {
    try {
        // Получаем токен из куков с помощью вашей функции
        const token = getAccessToken(); // Эта функция уже берет токен из куки

        // Отправляем запрос с заголовками авторизации
        const response = await axios.post<ProjectResponse>(
            `${API_BASE_URL}/projects/`,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                },
            }
        );

        return response.data;
    } catch (error) {
        // Подробная обработка ошибок Axios
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<any>;

            // Обработка разных статусов ошибок
            if (axiosError.response) {
                // Сервер ответил с ошибкой
                console.error('Server responded with error:', {
                    status: axiosError.response.status,
                    data: axiosError.response.data,
                    headers: axiosError.response.headers,
                });

                // Выбрасываем понятную ошибку в зависимости от статуса
                switch (axiosError.response.status) {
                    case 400:
                        throw new Error('Некорректные данные проекта. Пожалуйста, проверьте введенные данные.');
                    case 401:
                        throw new Error('Не авторизован. Пожалуйста, войдите в систему заново.');
                    case 403:
                        throw new Error('У вас нет прав для создания проекта. Требуются права администратора или владельца организации.');
                    case 422:
                        const validationErrors = axiosError.response.data?.detail;
                        if (validationErrors) {
                            const errorMessages = validationErrors.map((err: any) =>
                                `${err.loc.join('.')}: ${err.msg}`
                            ).join('; ');
                            throw new Error(`Ошибка валидации: ${errorMessages}`);
                        }
                        throw new Error('Ошибка валидации данных. Пожалуйста, проверьте введенные данные.');
                    default:
                        throw new Error(`Ошибка сервера: ${axiosError.response.status}. Пожалуйста, попробуйте позже.`);
                }
            } else if (axiosError.request) {
                // Запрос был сделан, но нет ответа
                console.error('No response received:', axiosError.request);
                throw new Error('Сервер не отвечает. Пожалуйста, проверьте подключение к интернету.');
            } else {
                // Ошибка при настройке запроса
                console.error('Error setting up request:', axiosError.message);
                throw new Error('Ошибка при отправке запроса. Пожалуйста, попробуйте снова.');
            }
        }

        throw new Error('Произошла непредвиденная ошибка. Пожалуйста, попробуйте позже.');
    }
};