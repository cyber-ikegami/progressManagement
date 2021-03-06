// 本番用
// export const API_DOMAIN = 'http://10.114.240.172:5000';
// テスト用
export const API_DOMAIN = 'http://10.114.240.172:4000';

namespace DataBaseUtil {
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
};

export default DataBaseUtil;