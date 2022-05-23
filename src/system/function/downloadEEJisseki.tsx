import AbstractFunctionBuilder, { FunctionFormProps } from "./abstractFunctionBuilder";

class DownloadEEJisseki extends AbstractFunctionBuilder{
    getFunctionName(): string{
        return 'EE_CSVダウンロード'; 
    };
    getFormProps(): FunctionFormProps {
        return {
            formList: [
                { labelName: 'ラベル3', value: 'c' }, 
                { labelName: 'ラベル4', value: 'd' }
            ],
            execute: (values) => {
                return String(values);
            }
        };
    }
}

export default DownloadEEJisseki;