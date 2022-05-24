import AbstractFunctionBuilder, { FunctionFormProps } from "./abstractFunctionBuilder";

class DownloadEEJisseki extends AbstractFunctionBuilder{
    getFunctionName(): string{
        return 'EE_CSVダウンロード'; 
    };
    getFormProps(): FunctionFormProps {
        return {
            formList: [
                // 都市大 or 鎌女
                { labelName: '大学', value: 'a' }, 
                // 開始日
                { labelName: '開始日', value: 'b' },
                // 終了日
                { labelName: '終了日', value: 'c' }
            ],
            execute: (values) => {
                return String(values);
            }
        };
    }
}

export default DownloadEEJisseki;