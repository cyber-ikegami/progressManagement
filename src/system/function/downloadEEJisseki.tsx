import AbstractFunctionBuilder, { FunctionFormProps } from "./abstractFunctionBuilder";

class DownloadEEJisseki extends AbstractFunctionBuilder{
    getFunctionName(): string{
        return 'EE_CSVダウンロード'; 
    };
    getFunctionList(): FunctionFormProps {
        return {
            formList: [
                { labelName: 'ラベル3', value: 'c' }, 
                { labelName: 'ラベル4', value: 'd' }
            ]
            // execute: (values) => { console.log('b'); }
        };
    }
}

export default DownloadEEJisseki;