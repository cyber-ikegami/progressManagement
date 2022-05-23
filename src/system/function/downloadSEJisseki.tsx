import AbstractFunctionBuilder, { FunctionFormProps } from "./abstractFunctionBuilder";

class DownloadSEJisseki extends AbstractFunctionBuilder {
    getFunctionName(): string {
        return 'SE_CSVダウンロード';
    };
    getFormProps(): FunctionFormProps {
        return {
            formList: [
                { labelName: 'ラベル1', value: 'a' }, 
                { labelName: 'ラベル2', value: 'b' }
            ],
            execute: (values) => { 
                return String(values);
            }
        };
    }
}

export default DownloadSEJisseki;