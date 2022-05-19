import AbstractFunctionBuilder, { FunctionFormProps } from "./abstractFunctionBuilder";

class DownloadPKGJisseki extends AbstractFunctionBuilder{
    getFunctionName(): string{
        return 'PKG連絡票_CSVダウンロード'; 
    };
    getFunctionList(): FunctionFormProps {
        return {
            formList: [
                { labelName: 'ラベル5', value: 'e' }, 
                { labelName: 'ラベル6', value: 'f' }
            ]
            // execute: (values) => { console.log('b'); }
        };
    }
}

export default DownloadPKGJisseki;