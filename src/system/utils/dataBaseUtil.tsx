export const API_DOMAIN = 'http://localhost:5000';

export const createQueryRequestInit = (sql: string): RequestInit => {
    return {
        mode: 'cors',
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sql })
    }
}

export const sendQueryRequestToAPI = (queryType: 'select' | 'update', sql: string): Promise<Response> => {
    return fetch(API_DOMAIN + '/' + queryType,
        createQueryRequestInit(sql)
    );
}