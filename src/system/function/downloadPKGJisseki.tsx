import AbstractFunctionBuilder, { FunctionFormProps } from "./abstractFunctionBuilder";

class DownloadPKGJisseki extends AbstractFunctionBuilder{
    getFunctionName(): string{
        return 'PKG連絡票_CSVダウンロード'; 
    };
    getFormProps(): FunctionFormProps {
        return {
            formList: [
                { labelName: 'ラベル5', value: 'e' }, 
                { labelName: 'ラベル6', value: 'f' }
            ],
            execute: (values) => { 
                return String(values);
            }
        };
    }
}

export default DownloadPKGJisseki;