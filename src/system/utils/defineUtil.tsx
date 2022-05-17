namespace DefineUtil {
    // 作業区分
    export const SAGYOU_KUBUN_LIST = [
        { key: '01', value: '一次受付(メール回答・PJWeb記載)' },
        { key: '02', value: '仕様確認(mantis該当検索・プロジェクトWEB調査・設計書)' },
        { key: '03', value: '仕様確認(プログラム調査)' },
        { key: '04', value: '調査（リモートアクセス）' },
        { key: '05', value: '修正モジュール作成・適用' },
        { key: '06', value: 'メール回答' },
        { key: '07', value: '電話対応' },
        { key: '08', value: 'システム間調整' },
        { key: '09', value: 'スポット対応(トラブル以外)' },
        { key: '10', value: 'トラブル対応' }
    ];

    export const convertKubun = (key: string) => {
        return SAGYOU_KUBUN_LIST.find(kubun => {
            if (kubun.key === key) {
                return kubun;
            }
        });
    };
}

export default DefineUtil;